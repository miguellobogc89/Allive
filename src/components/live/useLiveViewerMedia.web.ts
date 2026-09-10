// src/components/live/useLiveViewerMedia.web.ts

import {
  RemoteTrack,
  Room,
  RoomEvent,
  Track,
} from "livekit-client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  API_URL,
} from "../../api/apiConfig";

import {
  refreshLiveViewerCount,
} from "../../api/liveRealtimeApi";

import type {
  AuthUser,
  ViewerIdentity,
} from "../../auth/types";

import {
  buildLiveAudience,
  emptyLiveAudience,
  type LiveAudience,
} from "./liveAudience";

import {
  getParticipantRole,
} from "./liveParticipantRole";

import type {
  ActiveLive,
  LiveKitTokenResponse,
} from "./types";

type UseLiveViewerMediaOptions = {
  live: ActiveLive | null;
  viewerIdentity:
    ViewerIdentity | null;
  viewerUser:
    AuthUser | null;
  authToken:
    string | null;
  onAudienceChange?: (
    audience: LiveAudience,
  ) => void;
  onRoomChange?: (
    room: Room | null,
  ) => void;
};

type TrackPublicationLike = {
  kind?: Track.Kind;
  track?: unknown;
  setSubscribed?: unknown;
};

async function getViewerToken(
  roomName: string,
  viewerIdentity:
    ViewerIdentity,
  authToken:
    string | null,
): Promise<LiveKitTokenResponse> {
  const headers:
    Record<string, string> = {
    "Content-Type":
      "application/json",
  };

  const body:
    Record<string, unknown> = {
    roomName,
    role: "viewer",
  };

  if (
    viewerIdentity.type ===
    "user"
  ) {
    if (!authToken) {
      throw new Error(
        "La sesion de usuario no esta disponible.",
      );
    }

    headers.Authorization =
      `Bearer ${authToken}`;
  } else {
    body.actorType =
      "guest";

    body.actorId =
      viewerIdentity.id;
  }

  const response =
    await fetch(
      `${API_URL}/api/livekit/token`,
      {
        method: "POST",
        headers,
        body:
          JSON.stringify(
            body,
          ),
      },
    );

  if (!response.ok) {
    const responseBody =
      await response
        .json()
        .catch(() => null);

    throw new Error(
      responseBody?.error ??
        `No se pudo obtener el token de espectador (${response.status})`,
    );
  }

  const data =
    (await response.json()) as
      LiveKitTokenResponse;

  if (
    !data.serverUrl ||
    !data.participantToken
  ) {
    throw new Error(
      "La API devolvio un token LiveKit invalido.",
    );
  }

  return data;
}

function hasRenderableFrame(
  element: HTMLVideoElement,
) {
  return (
    element.readyState >=
      HTMLMediaElement.HAVE_CURRENT_DATA &&
    element.videoWidth > 0 &&
    element.videoHeight > 0
  );
}

function isSubscribable(
  publication: TrackPublicationLike,
): publication is TrackPublicationLike & {
  setSubscribed: (
    subscribed: boolean,
  ) => void;
} {
  return (
    typeof publication.setSubscribed ===
    "function"
  );
}

export function useLiveViewerMedia({
  live,
  viewerIdentity,
  viewerUser,
  authToken,
  onAudienceChange,
  onRoomChange,
}: UseLiveViewerMediaOptions) {
  const roomRef =
    useRef<Room | null>(null);

  const videoRef =
    useRef<HTMLVideoElement | null>(
      null,
    );

  const audioRef =
    useRef<HTMLAudioElement | null>(
      null,
    );

  const videoTrackRef =
    useRef<RemoteTrack | null>(
      null,
    );

  const audioTrackRef =
    useRef<RemoteTrack | null>(
      null,
    );

  const viewerUserRef =
    useRef(viewerUser);

  const onAudienceChangeRef =
    useRef(onAudienceChange);

  const onRoomChangeRef =
    useRef(onRoomChange);

  const [hasVideo, setHasVideo] =
    useState(false);

  const [status, setStatus] =
    useState(
      "Buscando LIVE...",
    );

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    viewerUserRef.current =
      viewerUser;

    onAudienceChangeRef.current =
      onAudienceChange;

    onRoomChangeRef.current =
      onRoomChange;
  }, [
    viewerUser,
    onAudienceChange,
    onRoomChange,
  ]);

  useEffect(() => {
    let disposed = false;

    function setAudience(
      audience: LiveAudience,
    ) {
      onAudienceChangeRef.current?.(
        audience,
      );
    }

    function setViewerRoom(
      room: Room | null,
    ) {
      onRoomChangeRef.current?.(
        room,
      );
    }

    function updateAudience(
      room: Room,
    ) {
      if (!viewerIdentity) {
        setAudience(
          emptyLiveAudience(),
        );

        return;
      }

      setAudience(
        buildLiveAudience(
          room,
          {
            identity:
              viewerIdentity,
            user:
              viewerUserRef.current,
          },
        ),
      );
    }

    function markVideoReady() {
      const element =
        videoRef.current;

      const track =
        videoTrackRef.current;

      if (
        disposed ||
        !element ||
        !track ||
        track.isMuted ||
        track.mediaStreamTrack
          .readyState !== "live"
      ) {
        return;
      }

      if (
        hasRenderableFrame(
          element,
        )
      ) {
        setHasVideo(true);
        setStatus("LIVE");
      }
    }

    function addVideoReadinessEvents() {
      const element =
        videoRef.current;

      if (!element) {
        return () => {};
      }

      const events = [
        "loadeddata",
        "canplay",
        "playing",
        "resize",
      ];

      for (const event of events) {
        element.addEventListener(
          event,
          markVideoReady,
        );
      }

      return () => {
        for (const event of events) {
          element.removeEventListener(
            event,
            markVideoReady,
          );
        }
      };
    }

    function playVideoElement(
      element: HTMLVideoElement,
    ) {
      element.autoplay = true;
      element.playsInline = true;
      element.muted = true;

      void element
        .play()
        .then(markVideoReady)
        .catch((playError) => {
          console.warn(
            "Allive viewer video play:",
            playError,
          );
        });
    }

    function detachTracks() {
      if (
        videoTrackRef.current &&
        videoRef.current
      ) {
        videoTrackRef.current.detach(
          videoRef.current,
        );
      }

      if (
        audioTrackRef.current &&
        audioRef.current
      ) {
        audioTrackRef.current.detach(
          audioRef.current,
        );
      }

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject =
          null;
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.srcObject =
          null;
      }

      videoTrackRef.current = null;
      audioTrackRef.current = null;
      setHasVideo(false);
    }

    function attachTrack(
      track: RemoteTrack,
      participantRole:
        string | null,
    ) {
      if (
        disposed ||
        participantRole !==
          "broadcaster"
      ) {
        return;
      }

      if (
        track.kind ===
          Track.Kind.Video
      ) {
        const element =
          videoRef.current;

        if (!element) {
          return;
        }

        if (
          track.mediaStreamTrack
            .readyState !== "live" ||
          track.isMuted
        ) {
          setHasVideo(false);
          setStatus(
            "Esperando video...",
          );

          return;
        }

        if (
          videoTrackRef.current &&
          videoTrackRef.current !==
            track
        ) {
          videoTrackRef.current.detach(
            element,
          );
        }

        if (
          videoTrackRef.current !==
          track
        ) {
          track.attach(element);
          videoTrackRef.current =
            track;
        }

        playVideoElement(element);

        if (
          hasRenderableFrame(element)
        ) {
          setHasVideo(true);
          setStatus("LIVE");
        } else {
          setStatus(
            "Cargando video...",
          );
        }

        return;
      }

      if (
        track.kind ===
          Track.Kind.Audio
      ) {
        const element =
          audioRef.current;

        if (!element) {
          return;
        }

        if (
          audioTrackRef.current &&
          audioTrackRef.current !==
            track
        ) {
          audioTrackRef.current.detach(
            element,
          );
        }

        if (
          audioTrackRef.current !==
          track
        ) {
          track.attach(element);
          audioTrackRef.current =
            track;
        }

        element.autoplay = true;

        void element
          .play()
          .catch(() => {});
      }
    }

    function attachPublicationTrack(
      publication:
        TrackPublicationLike,
      participantRole:
        string | null,
    ) {
      if (
        participantRole !==
        "broadcaster"
      ) {
        return;
      }

      if (
        publication.kind ===
          Track.Kind.Video &&
        isSubscribable(
          publication,
        )
      ) {
        publication.setSubscribed(
          true,
        );
      }

      if (
        publication.track instanceof
        RemoteTrack
      ) {
        attachTrack(
          publication.track,
          participantRole,
        );
      }
    }

    function attachBroadcasterTracks(
      room: Room,
    ) {
      for (
        const participant of
        room.remoteParticipants.values()
      ) {
        const role =
          getParticipantRole(
            participant,
          );

        if (
          role !==
          "broadcaster"
        ) {
          continue;
        }

        for (
          const publication of
          participant.trackPublications.values()
        ) {
          attachPublicationTrack(
            publication,
            role,
          );
        }
      }
    }

    const removeVideoReadinessEvents =
      addVideoReadinessEvents();

    const previousRoom =
      roomRef.current;

    if (previousRoom) {
      previousRoom.disconnect();
    }

    detachTracks();
    roomRef.current = null;
    setViewerRoom(null);
    setAudience(emptyLiveAudience());
    setError(null);

    if (!live) {
      setStatus(
        "No hay LIVE activos",
      );

      return () => {
        disposed = true;
        removeVideoReadinessEvents();
      };
    }

    if (!viewerIdentity) {
      setStatus("No disponible");
      setError(
        "No hay una identidad de espectador disponible.",
      );

      return () => {
        disposed = true;
        removeVideoReadinessEvents();
      };
    }

    const activeLive = live;
    const activeViewerIdentity =
      viewerIdentity;
    const activeAuthToken =
      authToken;

    async function connect() {
      try {
        setStatus(
          "Conectando...",
        );

        const {
          serverUrl,
          participantToken,
        } =
          await getViewerToken(
            activeLive.roomName,
            activeViewerIdentity,
            activeAuthToken,
          );

        if (disposed) {
          return;
        }

        const room =
          new Room({
            adaptiveStream: false,
            dynacast: false,
          });

        roomRef.current = room;
        setViewerRoom(room);

        room.on(
          RoomEvent.TrackSubscribed,
          (
            track,
            _publication,
            participant,
          ) => {
            attachTrack(
              track,
              getParticipantRole(
                participant,
              ),
            );
          },
        );

        room.on(
          RoomEvent.TrackPublished,
          (
            publication,
            participant,
          ) => {
            attachPublicationTrack(
              publication,
              getParticipantRole(
                participant,
              ),
            );
          },
        );

        room.on(
          RoomEvent.TrackUnsubscribed,
          (
            track,
            _publication,
            participant,
          ) => {
            if (
              getParticipantRole(
                participant,
              ) !==
              "broadcaster"
            ) {
              return;
            }

            if (
              track ===
              videoTrackRef.current
            ) {
              if (videoRef.current) {
                track.detach(
                  videoRef.current,
                );
              }

              videoTrackRef.current =
                null;

              setHasVideo(false);
              setStatus(
                "Esperando video...",
              );
            }

            if (
              track ===
              audioTrackRef.current
            ) {
              if (audioRef.current) {
                track.detach(
                  audioRef.current,
                );
              }

              audioTrackRef.current =
                null;
            }
          },
        );

        room.on(
          RoomEvent.TrackMuted,
          (
            publication,
            participant,
          ) => {
            if (
              getParticipantRole(
                participant,
              ) !==
                "broadcaster" ||
              publication.kind !==
                Track.Kind.Video
            ) {
              return;
            }

            setHasVideo(false);
            setStatus(
              "Camara pausada",
            );
          },
        );

        room.on(
          RoomEvent.TrackUnmuted,
          (
            publication,
            participant,
          ) => {
            attachPublicationTrack(
              publication,
              getParticipantRole(
                participant,
              ),
            );
          },
        );

        room.on(
          RoomEvent.TrackStreamStateChanged,
          (
            publication,
            streamState,
            participant,
          ) => {
            if (
              getParticipantRole(
                participant,
              ) !==
                "broadcaster" ||
              publication.kind !==
                Track.Kind.Video
            ) {
              return;
            }

            if (
              streamState ===
              Track.StreamState.Paused
            ) {
              setStatus(
                "Recuperando video...",
              );

              return;
            }

            attachPublicationTrack(
              publication,
              "broadcaster",
            );
          },
        );

        const refreshAudience =
          () => {
            updateAudience(room);
          };

        const refreshAudienceAndTracks =
          () => {
            updateAudience(room);
            attachBroadcasterTracks(
              room,
            );
          };

        room.on(
          RoomEvent.ParticipantConnected,
          refreshAudience,
        );

        room.on(
          RoomEvent.ParticipantDisconnected,
          refreshAudience,
        );

        room.on(
          RoomEvent.ParticipantAttributesChanged,
          refreshAudienceAndTracks,
        );

        room.on(
          RoomEvent.ParticipantMetadataChanged,
          refreshAudienceAndTracks,
        );

        room.on(
          RoomEvent.Reconnecting,
          () => {
            if (!disposed) {
              setStatus(
                "Reconectando...",
              );
            }
          },
        );

        room.on(
          RoomEvent.Reconnected,
          () => {
            if (disposed) {
              return;
            }

            updateAudience(room);
            attachBroadcasterTracks(
              room,
            );
          },
        );

        room.on(
          RoomEvent.Disconnected,
          () => {
            if (disposed) {
              return;
            }

            detachTracks();
            setStatus(
              "LIVE finalizado",
            );
            setAudience(
              emptyLiveAudience(),
            );
            setViewerRoom(null);
          },
        );

        await room.connect(
          serverUrl,
          participantToken,
          {
            autoSubscribe: true,
          },
        );

        if (disposed) {
          room.disconnect();
          return;
        }

        setStatus(
          "Conectado, esperando video...",
        );

        attachBroadcasterTracks(room);
        updateAudience(room);

        window.setTimeout(
          () => {
            if (!disposed) {
              void refreshLiveViewerCount(
                activeLive.id,
              );
            }
          },
          750,
        );
      } catch (caughtError) {
        if (disposed) {
          return;
        }

        console.error(
          "Allive NOW connection error:",
          caughtError,
        );

        setError(
          caughtError instanceof
            Error
            ? caughtError.message
            : "No se ha podido conectar al LIVE.",
        );

        setStatus("No disponible");
        setViewerRoom(null);
      }
    }

    void connect();

    return () => {
      disposed = true;
      removeVideoReadinessEvents();

      const room =
        roomRef.current;

      detachTracks();

      if (room) {
        room.disconnect();
      }

      roomRef.current = null;
      setViewerRoom(null);

      if (activeLive.id) {
        window.setTimeout(
          () => {
            void refreshLiveViewerCount(
              activeLive.id,
            );
          },
          750,
        );
      }
    };
  }, [
    live?.id,
    live?.roomName,
    viewerIdentity?.type,
    viewerIdentity?.id,
    authToken,
  ]);

  return {
    audioRef,
    error,
    hasVideo,
    status,
    videoRef,
  };
}
