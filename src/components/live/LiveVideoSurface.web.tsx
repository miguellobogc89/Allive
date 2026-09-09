// src/components/live/LiveVideoSurface.web.tsx

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
  StyleSheet,
  Text,
  View,
} from "react-native";

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
  colors,
  layout,
  radius,
  spacing,
  typography,
} from "../../styles";

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
    useState<string | null>(
      null,
    );

  useEffect(() => {
    let disposed = false;

    function updateAudience(
      room: Room,
    ) {
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

      videoTrackRef.current =
        null;

      audioTrackRef.current =
        null;

      setHasVideo(false);
    }

    const previousRoom =
      roomRef.current;

    if (previousRoom) {
      previousRoom.disconnect();
    }

    detachTracks();

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

    if (!viewerIdentity) {
      setStatus(
        "No disponible",
      );

      setError(
        "No hay una identidad de espectador disponible.",
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

        onRoomChange?.(
          room,
        );

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
              Track.Kind.Video &&
            videoRef.current
          ) {
            if (
              videoTrackRef.current &&
              videoTrackRef.current !==
                track
            ) {
              videoTrackRef.current.detach(
                videoRef.current,
              );
            }

            track.attach(
              videoRef.current,
            );

            videoTrackRef.current =
              track;

            videoRef.current.autoplay =
              true;

            videoRef.current.playsInline =
              true;

            videoRef.current.muted =
              true;

            void videoRef.current
              .play()
              .catch(
                (playError) => {
                  console.warn(
                    "Allive viewer video play:",
                    playError,
                  );
                },
              );

            setHasVideo(
              true,
            );

            setStatus(
              "LIVE",
            );

            return;
          }

          if (
            track.kind ===
              Track.Kind.Audio &&
            audioRef.current
          ) {
            if (
              audioTrackRef.current &&
              audioTrackRef.current !==
                track
            ) {
              audioTrackRef.current.detach(
                audioRef.current,
              );
            }

            track.attach(
              audioRef.current,
            );

            audioTrackRef.current =
              track;

            audioRef.current.autoplay =
              true;

            void audioRef.current
              .play()
              .catch(
                () => {},
              );
          }
        }

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
                videoTrackRef.current &&
              videoRef.current
            ) {
              track.detach(
                videoRef.current,
              );

              videoTrackRef.current =
                null;

              setHasVideo(
                false,
              );

              setStatus(
                "Recuperando vídeo...",
              );
            }

            if (
              track ===
                audioTrackRef.current &&
              audioRef.current
            ) {
              track.detach(
                audioRef.current,
              );

              audioTrackRef.current =
                null;
            }
          },
        );

        const refreshAudience =
          () => {
            updateAudience(
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
          refreshAudience,
        );

        room.on(
          RoomEvent.ParticipantMetadataChanged,
          refreshAudience,
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
            if (!disposed) {
              updateAudience(
                room,
              );
            }
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

            onAudienceChange?.(
              emptyLiveAudience(),
            );

            onRoomChange?.(
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
          "Conectado · esperando vídeo",
        );

        for (
          const participant of
          room.remoteParticipants.values()
        ) {
          const role =
            getParticipantRole(
              participant,
            );

          for (
            const publication of
            participant.trackPublications.values()
          ) {
            if (
              publication.track
            ) {
              attachTrack(
                publication.track,
                role,
              );
            }
          }
        }

        updateAudience(
          room,
        );

        window.setTimeout(
          () => {
            if (!disposed) {
              void refreshLiveViewerCount(
                live!.id,
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

      const room =
        roomRef.current;

      detachTracks();

      if (room) {
        room.disconnect();
      }

      roomRef.current =
        null;

      onRoomChange?.(
        null,
      );

      if (live?.id) {
        window.setTimeout(
          () => {
            void refreshLiveViewerCount(
              live.id,
            );
          },
          750,
        );
      }
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
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={videoStyle}
      />

      <audio
        ref={audioRef}
        autoPlay
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

  objectFit:
    "cover" as const,

  backgroundColor:
    colors.background,
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