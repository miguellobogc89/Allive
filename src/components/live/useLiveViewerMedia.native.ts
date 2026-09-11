// src/components/live/useLiveViewerMedia.native.ts

import {
  Room,
  RoomEvent,
  Track,
  type Participant,
  type RemoteTrack,
  type RemoteTrackPublication,
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

type NativeVideoTrackRef = {
  participant:
    Participant;

  publication:
    RemoteTrackPublication;

  source:
    Track.Source;
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

export function useLiveViewerMedia({
  live,
  viewerIdentity,
  viewerUser,
  authToken,
  onAudienceChange,
  onRoomChange,
}: UseLiveViewerMediaOptions) {
  const roomRef =
    useRef<Room | null>(
      null,
    );

  const viewerUserRef =
    useRef(viewerUser);

  const onAudienceChangeRef =
    useRef(
      onAudienceChange,
    );

  const onRoomChangeRef =
    useRef(
      onRoomChange,
    );

  const [
    videoTrackRef,
    setVideoTrackRef,
  ] =
    useState<
      NativeVideoTrackRef | undefined
    >(undefined);

  const [
    hasVideo,
    setHasVideo,
  ] = useState(false);

  const [
    status,
    setStatus,
  ] = useState(
    "Buscando LIVE...",
  );

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

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
    let disposed =
      false;

    function setAudience(
      audience:
        LiveAudience,
    ) {
      onAudienceChangeRef.current?.(
        audience,
      );
    }

    function setViewerRoom(
      room:
        Room | null,
    ) {
      onRoomChangeRef.current?.(
        room,
      );
    }

    function updateAudience(
      room: Room,
    ) {
      if (
        !viewerIdentity
      ) {
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

    function clearVideo() {
      setVideoTrackRef(
        undefined,
      );

      setHasVideo(
        false,
      );
    }

    function useTrack(
      track:
        RemoteTrack,

      publication:
        RemoteTrackPublication,

      participant:
        Participant,

      participantRole:
        string | null,
    ) {
      if (
        disposed ||
        participantRole !==
          "broadcaster" ||
        track.kind !==
          Track.Kind.Video
      ) {
        return;
      }

      if (
        track.isMuted
      ) {
        clearVideo();

        setStatus(
          "Camara pausada",
        );

        return;
      }

      setVideoTrackRef({
        participant,
        publication,

        source:
          publication.source,
      });

      setHasVideo(true);

      setStatus("LIVE");
    }

    function usePublication(
      publication:
        RemoteTrackPublication,

      participant:
        Participant,

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
        Track.Kind.Video
      ) {
        publication.setSubscribed(
          true,
        );
      }

      if (
        publication.track
      ) {
        useTrack(
          publication.track,
          publication,
          participant,
          participantRole,
        );
      }
    }

    function findBroadcasterVideo(
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
          participant
            .trackPublications
            .values()
        ) {
          usePublication(
            publication as
              RemoteTrackPublication,

            participant,

            role,
          );
        }
      }
    }

    const previousRoom =
      roomRef.current;

    if (
      previousRoom
    ) {
      previousRoom.disconnect();
    }

    roomRef.current =
      null;

    clearVideo();

    setViewerRoom(
      null,
    );

    setAudience(
      emptyLiveAudience(),
    );

    setError(null);

    if (!live) {
      setStatus(
        "No hay LIVE activos",
      );

      return () => {
        disposed =
          true;
      };
    }

    if (
      !viewerIdentity
    ) {
      setStatus(
        "No disponible",
      );

      setError(
        "No hay una identidad de espectador disponible.",
      );

      return () => {
        disposed =
          true;
      };
    }

    const activeLive =
      live;

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
            adaptiveStream:
              false,

            dynacast:
              false,
          });

        roomRef.current =
          room;

        setViewerRoom(
          room,
        );

        room.on(
          RoomEvent.TrackSubscribed,

          (
            track,
            publication,
            participant,
          ) => {
            useTrack(
              track,

              publication,

              participant,

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
            usePublication(
              publication,

              participant,

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
              track.kind ===
              Track.Kind.Video
            ) {
              clearVideo();

              setStatus(
                "Esperando video...",
              );
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

            clearVideo();

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
            usePublication(
              publication as
                RemoteTrackPublication,

              participant,

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
              Track.StreamState
                .Paused
            ) {
              clearVideo();

              setStatus(
                "Recuperando video...",
              );

              return;
            }

            usePublication(
              publication as
                RemoteTrackPublication,

              participant,

              "broadcaster",
            );
          },
        );

        const refreshAudience =
          () => {
            updateAudience(
              room,
            );
          };

        const refreshEverything =
          () => {
            updateAudience(
              room,
            );

            findBroadcasterVideo(
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
          refreshEverything,
        );

        room.on(
          RoomEvent.ParticipantMetadataChanged,
          refreshEverything,
        );

        room.on(
          RoomEvent.Reconnecting,
          () => {
            if (
              !disposed
            ) {
              setStatus(
                "Reconectando...",
              );
            }
          },
        );

        room.on(
          RoomEvent.Reconnected,
          () => {
            if (
              disposed
            ) {
              return;
            }

            updateAudience(
              room,
            );

            findBroadcasterVideo(
              room,
            );
          },
        );

        room.on(
          RoomEvent.Disconnected,
          () => {
            if (
              disposed
            ) {
              return;
            }

            clearVideo();

            setStatus(
              "LIVE finalizado",
            );

            setAudience(
              emptyLiveAudience(),
            );

            setViewerRoom(
              null,
            );
          },
        );

        await room.connect(
          serverUrl,
          participantToken,
          {
            autoSubscribe:
              true,
          },
        );

        if (disposed) {
          room.disconnect();

          return;
        }

        setStatus(
          "Conectado, esperando video...",
        );

        findBroadcasterVideo(
          room,
        );

        updateAudience(
          room,
        );

        setTimeout(
          () => {
            if (
              !disposed
            ) {
              void refreshLiveViewerCount(
                activeLive.id,
              );
            }
          },
          750,
        );
      } catch (
        caughtError
      ) {
        if (disposed) {
          return;
        }

        console.error(
          "Allive NOW native connection error:",
          caughtError,
        );

        setError(
          caughtError instanceof
            Error
            ? caughtError.message
            : "No se ha podido conectar al LIVE.",
        );

        setStatus(
          "No disponible",
        );

        setViewerRoom(
          null,
        );
      }
    }

    void connect();

    return () => {
      disposed =
        true;

      const room =
        roomRef.current;

      clearVideo();

      if (room) {
        room.disconnect();
      }

      roomRef.current =
        null;

      setViewerRoom(
        null,
      );

      setTimeout(
        () => {
          void refreshLiveViewerCount(
            activeLive.id,
          );
        },
        750,
      );
    };
  }, [
    live?.id,
    live?.roomName,
    viewerIdentity?.type,
    viewerIdentity?.id,
    authToken,
  ]);

  return {
    error,
    hasVideo,
    status,
    videoTrackRef,
  };
}