// src/components/live/LiveVideoSurface.web.tsx

import {
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
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
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  AuthUser,
  ViewerIdentity,
} from "../../auth/types";

import {
  API_URL,
} from "../../api/apiConfig";

import {
  refreshLiveViewerCount,
} from "../../api/liveRealtimeApi";

import {
  colors,
  layout,
  radius,
  spacing,
  typography,
} from "../../styles";

import {
  getParticipantRole,
} from "./liveParticipantRole";

import {
  buildLiveAudience,
  emptyLiveAudience,
  type LiveAudience,
} from "./liveAudience";

import type {
  ActiveLive,
  LiveKitTokenResponse,
} from "./types";

type Props = {
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
        "La sesión de usuario no está disponible.",
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
        .catch(
          () => null,
        );

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
      "La API devolvió un token LiveKit inválido.",
    );
  }

  return data;
}

export function LiveVideoSurface({
  live,
  viewerIdentity,
  viewerUser,
  authToken,
  onAudienceChange,
  onRoomChange,
}: Props) {
  const roomRef =
    useRef<Room | null>(
      null,
    );

  const videoTrackRef =
    useRef<RemoteTrack | null>(
      null,
    );

  const connectionVersionRef =
    useRef(0);

  const videoContainerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const audioContainerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const [
    status,
    setStatus,
  ] = useState(
    "Buscando LIVE...",
  );

  const [
    hasVideo,
    setHasVideo,
  ] = useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  useEffect(() => {
    connectionVersionRef.current +=
      1;

    const version =
      connectionVersionRef.current;

    let disposed = false;

    const isCurrent = (
      room?: Room,
    ) =>
      !disposed &&
      version ===
        connectionVersionRef.current &&
      (
        !room ||
        roomRef.current === room
      );

    const clearVideo = () => {
      const track =
        videoTrackRef.current;

      if (track) {
        track
          .detach()
          .forEach(
            (element) =>
              element.remove(),
          );
      }

      videoTrackRef.current =
        null;

      setHasVideo(false);
    };

    const clearAudio = () => {
      if (
        audioContainerRef.current
      ) {
        audioContainerRef.current
          .querySelectorAll(
            "audio",
          )
          .forEach(
            (element) =>
              element.remove(),
          );
      }
    };

    const updateAudience = (
      room: Room,
    ) => {
      if (
        !viewerIdentity
      ) {
        onAudienceChange?.(
          emptyLiveAudience(),
        );

        return;
      }

      onAudienceChange?.(
        buildLiveAudience(
          room,
          {
            identity:
              viewerIdentity,
            user:
              viewerUser,
          },
        ),
      );
    };

    const previousRoom =
      roomRef.current;

    if (previousRoom) {
      previousRoom.disconnect();
    }

    clearVideo();
    clearAudio();

    roomRef.current =
      null;

    onRoomChange?.(
      null,
    );

    onAudienceChange?.(
      emptyLiveAudience(),
    );

    if (!live) {
      setStatus(
        "No hay LIVE activos",
      );

      return;
    }

    if (
      !viewerIdentity
    ) {
      setError(
        "No hay una identidad de espectador disponible.",
      );

      setStatus(
        "No disponible",
      );

      return;
    }

    async function connect() {
      try {
        setError(null);

        setStatus(
          "Conectando...",
        );

        const {
          serverUrl,
          participantToken,
        } =
          await getViewerToken(
            live!.roomName,
            viewerIdentity!,
            authToken,
          );

        if (!isCurrent()) {
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

        onRoomChange?.(
          room,
        );

        const attachTrack = (
          track: RemoteTrack,
          _publication:
            RemoteTrackPublication,
          participant:
            RemoteParticipant,
        ) => {
          if (
            !isCurrent(room)
          ) {
            return;
          }

          const role =
            getParticipantRole(
              participant,
            );

          if (
            role !==
            "broadcaster"
          ) {
            return;
          }

          if (
            track.kind ===
            Track.Kind.Video
          ) {
            if (
              videoTrackRef.current &&
              videoTrackRef.current !==
                track
            ) {
              videoTrackRef.current
                .detach()
                .forEach(
                  (
                    element,
                  ) =>
                    element.remove(),
                );
            }

            const element =
              track.attach() as
                HTMLVideoElement;

            element.autoplay =
              true;

            element.playsInline =
              true;

            element.muted =
              true;

            element.style.position =
              "absolute";

            element.style.inset =
              "0";

            element.style.width =
              "100%";

            element.style.height =
              "100%";

            element.style.objectFit =
              "cover";

            element.style.backgroundColor =
              "#000";

            const container =
              videoContainerRef.current;

            if (container) {
              container
                .querySelectorAll(
                  "video",
                )
                .forEach(
                  (
                    existing,
                  ) => {
                    if (
                      existing !==
                      element
                    ) {
                      existing.remove();
                    }
                  },
                );

              if (
                !container.contains(
                  element,
                )
              ) {
                container.appendChild(
                  element,
                );
              }

              void element
                .play()
                .catch(
                  () => {},
                );
            }

            videoTrackRef.current =
              track;

            setHasVideo(
              true,
            );

            setStatus(
              "LIVE",
            );
          }

          if (
            track.kind ===
            Track.Kind.Audio
          ) {
            const element =
              track.attach();

            element.autoplay =
              true;

            const container =
              audioContainerRef.current;

            if (
              container &&
              !container.contains(
                element,
              )
            ) {
              container.appendChild(
                element,
              );
            }
          }
        };

        const attachExistingTracks =
          () => {
            for (
              const participant of
              room.remoteParticipants.values()
            ) {
              if (
                getParticipantRole(
                  participant,
                ) !==
                "broadcaster"
              ) {
                continue;
              }

              for (
                const publication of
                participant.trackPublications.values()
              ) {
                const track =
                  publication.track;

                if (track) {
                  attachTrack(
                    track,
                    publication,
                    participant,
                  );
                }
              }
            }
          };

        const refreshAudience =
          () => {
            if (
              !isCurrent(room)
            ) {
              return;
            }

            updateAudience(
              room,
            );

            void refreshLiveViewerCount(
              live!.id,
            );
          };

        room.on(
          RoomEvent.TrackSubscribed,
          attachTrack,
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

            track
              .detach()
              .forEach(
                (element) =>
                  element.remove(),
              );

            if (
              track.kind ===
                Track.Kind.Video &&
              videoTrackRef.current ===
                track
            ) {
              videoTrackRef.current =
                null;

              setHasVideo(
                false,
              );

              setStatus(
                "Recuperando vídeo...",
              );
            }
          },
        );

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
          refreshAudience,
        );

        room.on(
          RoomEvent.ParticipantMetadataChanged,
          refreshAudience,
        );

        room.on(
          RoomEvent.Reconnecting,
          () => {
            if (
              isCurrent(
                room,
              )
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
              !isCurrent(
                room,
              )
            ) {
              return;
            }

            attachExistingTracks();
            refreshAudience();
          },
        );

        room.on(
          RoomEvent.Disconnected,
          () => {
            if (
              !isCurrent(
                room,
              )
            ) {
              return;
            }

            clearVideo();

            setStatus(
              "LIVE finalizado",
            );

            onAudienceChange?.(
              emptyLiveAudience(),
            );

            onRoomChange?.(
              null,
            );

            void refreshLiveViewerCount(
              live!.id,
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

        if (
          !isCurrent(room)
        ) {
          room.disconnect();

          return;
        }

        setStatus(
          "Conectado · esperando vídeo",
        );

        attachExistingTracks();

        updateAudience(
          room,
        );

        void refreshLiveViewerCount(
          live!.id,
        );
      } catch (
        caughtError
      ) {
        if (!isCurrent()) {
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

        setStatus(
          "No disponible",
        );

        onRoomChange?.(
          null,
        );
      }
    }

    void connect();

    return () => {
      disposed = true;

      if (
        version ===
        connectionVersionRef.current
      ) {
        connectionVersionRef.current +=
          1;
      }

      const room =
        roomRef.current;

      clearVideo();
      clearAudio();

      if (room) {
        room.disconnect();
      }

      roomRef.current =
        null;

      onRoomChange?.(
        null,
      );
    };
  }, [
    live?.id,
    live?.roomName,
    viewerIdentity,
    viewerUser,
    authToken,
    onAudienceChange,
    onRoomChange,
  ]);

  return (
    <View
      style={
        styles.container
      }
    >
      <div
        ref={
          videoContainerRef
        }
        style={videoStyle}
      />

      <div
        ref={
          audioContainerRef
        }
      />

      {!hasVideo ? (
        <View
          style={
            styles.waiting
          }
        >
          <Text
            style={
              styles.status
            }
          >
            {status}
          </Text>
        </View>
      ) : null}

      {error ? (
        <View
          style={
            styles.errorBox
          }
        >
          <Text
            style={
              styles.errorText
            }
          >
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const videoStyle = {
  position:
    "absolute" as const,
  inset: 0,
  width: "100%",
  height: "100%",
  backgroundColor:
    colors.background,
  overflow: "hidden",
};

const styles =
  StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFill,
      backgroundColor:
        colors.background,
    },

    waiting: {
      ...StyleSheet.absoluteFill,
      alignItems: "center",
      justifyContent:
        "center",
    },

    status: {
      color:
        colors.textMuted,
      ...typography.label,
    },

    errorBox: {
      position: "absolute",
      left:
        layout
          .liveErrorHorizontal,
      right:
        layout
          .liveErrorHorizontal,
      bottom:
        layout
          .liveErrorBottom,
      padding:
        spacing.sm,
      borderRadius:
        radius.md,
      backgroundColor:
        colors.dangerSurface,
    },

    errorText: {
      color:
        colors.dangerText,
      ...typography.caption,
      fontWeight: "400",
    },
  });