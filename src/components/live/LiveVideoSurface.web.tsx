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
  colors,
  layout,
  radius,
  spacing,
  typography,
} from "../../styles";

import {
  API_URL,
} from "../../api/apiConfig";

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
};

async function getViewerToken(
  roomName: string,
  viewerIdentity:
    ViewerIdentity,
  authToken: string | null,
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
    body.actorType = "guest";
    body.actorId =
      viewerIdentity.id;
  }

  const response = await fetch(
    `${API_URL}/api/livekit/token`,
    {
      method: "POST",
      headers,

      body:
        JSON.stringify(body),
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
}: Props) {
  const roomRef =
    useRef<Room | null>(null);

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

  const [status, setStatus] =
    useState(
      "Buscando LIVE...",
    );

  const [hasVideo, setHasVideo] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    connectionVersionRef.current +=
      1;

    const connectionVersion =
      connectionVersionRef.current;

    let disposed = false;

    const clearMedia = () => {
      if (
        videoContainerRef.current
      ) {
        videoContainerRef.current.innerHTML =
          "";
      }

      if (
        audioContainerRef.current
      ) {
        audioContainerRef.current.innerHTML =
          "";
      }

      setHasVideo(false);
    };

    const updateAudience = (
      room: Room,
    ) => {
      if (!viewerIdentity) {
        onAudienceChange?.(
          emptyLiveAudience(),
        );

        return;
      }

      const audience =
        buildLiveAudience(
          room,
          {
            identity:
              viewerIdentity,

            user: viewerUser,
          },
        );

      onAudienceChange?.(
        audience,
      );
    };

    const previousRoom =
      roomRef.current;

    if (previousRoom) {
      previousRoom.disconnect();
    }

    roomRef.current = null;

    clearMedia();

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

        if (
          disposed ||
          connectionVersion !==
            connectionVersionRef.current
        ) {
          return;
        }

        const room = new Room({
          adaptiveStream: true,
          dynacast: true,
        });

        roomRef.current = room;

        const isCurrent = () =>
          !disposed &&
          connectionVersion ===
            connectionVersionRef.current &&
          roomRef.current === room;

        const refreshAudience =
          () => {
            if (isCurrent()) {
              updateAudience(
                room,
              );
            }
          };

        const attachTrack = (
          track: RemoteTrack,
          _publication:
            RemoteTrackPublication,
          participant:
            RemoteParticipant,
        ) => {
          if (!isCurrent()) {
            return;
          }

          console.log(
            "Allive viewer received track:",
            track.kind,
            participant.identity,
            getParticipantRole(
              participant,
            ),
          );

          if (
            track.kind ===
            Track.Kind.Video
          ) {
            const element =
              track.attach() as
                HTMLVideoElement;

            element.autoplay =
              true;

            element.playsInline =
              true;

            element.muted = true;

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

            if (
              videoContainerRef.current
            ) {
              videoContainerRef.current.innerHTML =
                "";

              videoContainerRef.current.appendChild(
                element,
              );
            }

            setHasVideo(true);

            setStatus("LIVE");
          }

          if (
            track.kind ===
            Track.Kind.Audio
          ) {
            const element =
              track.attach();

            element.autoplay =
              true;

            if (
              audioContainerRef.current
            ) {
              audioContainerRef.current.innerHTML =
                "";

              audioContainerRef.current.appendChild(
                element,
              );
            }
          }
        };

        room.on(
          RoomEvent.TrackSubscribed,
          attachTrack,
        );

        room.on(
          RoomEvent.TrackUnsubscribed,
          (track) => {
            track
              .detach()
              .forEach(
                (element) =>
                  element.remove(),
              );
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
          RoomEvent.Disconnected,
          () => {
            if (!isCurrent()) {
              return;
            }

            setHasVideo(false);

            setStatus(
              "LIVE finalizado",
            );

            onAudienceChange?.(
              emptyLiveAudience(),
            );
          },
        );

        await room.connect(
          serverUrl,
          participantToken,
          {
            autoSubscribe: true,
          },
        );

        if (!isCurrent()) {
          room.disconnect();

          return;
        }

        setStatus(
          "Conectado · esperando vídeo",
        );

        updateAudience(room);
      } catch (caughtError) {
        if (
          disposed ||
          connectionVersion !==
            connectionVersionRef.current
        ) {
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
      }
    }

    void connect();

    return () => {
      disposed = true;

      if (
        connectionVersion ===
        connectionVersionRef.current
      ) {
        connectionVersionRef.current +=
          1;
      }

      const room =
        roomRef.current;

      if (room) {
        room.disconnect();
      }

      roomRef.current = null;

      clearMedia();
    };
  }, [
    live?.id,
    live?.roomName,
    viewerIdentity,
    viewerUser,
    authToken,
    onAudienceChange,
  ]);

  return (
    <View style={styles.container}>
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
  position: "absolute" as const,
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
        layout.liveErrorHorizontal,

      right:
        layout.liveErrorHorizontal,

      bottom:
        layout.liveErrorBottom,

      padding: spacing.sm,

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