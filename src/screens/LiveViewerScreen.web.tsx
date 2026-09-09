// src/screens/LiveViewerScreen.web.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Participant,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
  Track,
} from "livekit-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  LiveViewerOverlay,
  type LiveComment,
} from "../components/live";
import { colors } from "../theme/colors";

const API_URL = "http://localhost:3001";
const REFRESH_INTERVAL_MS = 5000;

type ActiveLive = {
  id: string;
  roomName: string;
  status: "LIVE" | "ENDED";
  title: string | null;
  eventName: string | null;
  description: string | null;
  placeName: string | null;
  latitude?: number | null;
  longitude?: number | null;
  startedAt: string;

  creator: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
};

type LiveKitTokenResponse = {
  serverUrl: string;
  participantToken: string;
  role: "broadcaster" | "viewer";
};

const MOCK_COMMENTS: LiveComment[] = [
  {
    id: "mock-1",
    username: "lucia",
    text: "¿Qué está pasando ahora?",
    likes: 3,
  },
  {
    id: "mock-2",
    username: "dani",
    text: "Se ve perfecto 👀",
    likes: 1,
  },
];

function getParticipantRole(participant: Participant) {
  const attributeRole = participant.attributes?.role;

  if (
    attributeRole === "viewer" ||
    attributeRole === "broadcaster"
  ) {
    return attributeRole;
  }

  if (participant.metadata) {
    try {
      const parsed = JSON.parse(participant.metadata);

      if (
        parsed?.role === "viewer" ||
        parsed?.role === "broadcaster"
      ) {
        return parsed.role;
      }
    } catch {
      // Fallback a identity.
    }
  }

  if (participant.identity.startsWith("viewer-")) {
    return "viewer";
  }

  if (participant.identity.startsWith("broadcaster-")) {
    return "broadcaster";
  }

  return null;
}

export function LiveViewerScreen() {
  const roomRef = useRef<Room | null>(null);
  const connectionVersionRef = useRef(0);

  const videoContainerRef =
    useRef<HTMLDivElement | null>(null);

  const audioContainerRef =
    useRef<HTMLDivElement | null>(null);

  const [lives, setLives] = useState<ActiveLive[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [status, setStatus] =
    useState("Buscando LIVE...");

  const [connected, setConnected] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [hasVideo, setHasVideo] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [commentValue, setCommentValue] = useState("");
  const [comments, setComments] =
    useState<LiveComment[]>(MOCK_COMMENTS);

  const [savedLiveIds, setSavedLiveIds] =
    useState<string[]>([]);

  const activeLive = lives[currentIndex] ?? null;

  function updateViewerCount(room: Room) {
    // Esta pantalla siempre entra con un token viewer,
    // por eso contamos al participante local como 1.
    let viewerCount = 1;

    room.remoteParticipants.forEach((participant) => {
      if (getParticipantRole(participant) === "viewer") {
        viewerCount += 1;
      }
    });

    setViewers(viewerCount);
  }

  async function getViewerToken(
    roomName: string
  ): Promise<LiveKitTokenResponse> {
    const response = await fetch(
      `${API_URL}/api/livekit/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomName,
          role: "viewer",
        }),
      }
    );

    if (!response.ok) {
      const responseBody = await response
        .json()
        .catch(() => null);

      throw new Error(
        responseBody?.error ??
          `No se pudo obtener el token de espectador (${response.status})`
      );
    }

    const tokenData =
      (await response.json()) as LiveKitTokenResponse;

    if (
      !tokenData.serverUrl ||
      !tokenData.participantToken
    ) {
      throw new Error(
        "La API devolvió un token LiveKit inválido."
      );
    }

    return tokenData;
  }

  const clearMedia = useCallback(() => {
    if (videoContainerRef.current) {
      videoContainerRef.current.innerHTML = "";
    }

    if (audioContainerRef.current) {
      audioContainerRef.current.innerHTML = "";
    }

    setHasVideo(false);
  }, []);

  const disconnectCurrentRoom = useCallback(() => {
    connectionVersionRef.current += 1;

    const room = roomRef.current;

    if (room) {
      room.disconnect();
    }

    roomRef.current = null;

    clearMedia();
    setConnected(false);
    setViewers(0);
  }, [clearMedia]);

  const loadActiveLives = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/lives/active`
      );

      if (!response.ok) {
        throw new Error(
          `No se pudieron consultar los LIVE activos (${response.status})`
        );
      }

      const nextLives =
        (await response.json()) as ActiveLive[];

      if (!Array.isArray(nextLives)) {
        throw new Error(
          "Respuesta inválida del servidor."
        );
      }

      setLives((previousLives) => {
        if (nextLives.length === 0) {
          return [];
        }

        const currentLive =
          previousLives[currentIndex];

        if (!currentLive) {
          return nextLives;
        }

        const stillActiveIndex =
          nextLives.findIndex(
            (live) => live.id === currentLive.id
          );

        if (stillActiveIndex === -1) {
          return nextLives;
        }

        if (stillActiveIndex !== currentIndex) {
          const reordered = [...nextLives];

          const [stillActiveLive] =
            reordered.splice(stillActiveIndex, 1);

          reordered.splice(
            Math.min(currentIndex, reordered.length),
            0,
            stillActiveLive
          );

          return reordered;
        }

        return nextLives;
      });

      setCurrentIndex((index) => {
        if (nextLives.length === 0) {
          return 0;
        }

        return Math.min(
          index,
          nextLives.length - 1
        );
      });

      setError(null);
    } catch (caughtError) {
      console.error(
        "Allive NOW refresh error:",
        caughtError
      );

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No se pudieron obtener los LIVE activos."
      );
    }
  }, [currentIndex]);

  useEffect(() => {
    loadActiveLives();

    const interval = window.setInterval(
      loadActiveLives,
      REFRESH_INTERVAL_MS
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [loadActiveLives]);

  useEffect(() => {
    if (!activeLive) {
      disconnectCurrentRoom();
      setStatus("No hay LIVE activos");
      return;
    }

    const connectionVersion =
      connectionVersionRef.current + 1;

    connectionVersionRef.current =
      connectionVersion;

    let disposed = false;

    async function connectToLive(live: ActiveLive) {
      try {
        const previousRoom = roomRef.current;

        if (previousRoom) {
          previousRoom.disconnect();
        }

        roomRef.current = null;

        clearMedia();
        setConnected(false);
        setViewers(0);
        setError(null);
        setStatus("Conectando...");

        console.log(
          "Allive NOW entrando en LIVE:",
          live.id,
          live.roomName
        );

        const {
          serverUrl,
          participantToken,
        } = await getViewerToken(live.roomName);

        console.log(
          "Allive token viewer recibido:",
          live.roomName
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

        function isCurrentConnection() {
          return (
            !disposed &&
            connectionVersion ===
              connectionVersionRef.current &&
            roomRef.current === room
          );
        }

        function refreshViewerCount() {
          if (!isCurrentConnection()) {
            return;
          }

          updateViewerCount(room);
        }

        function attachTrack(
          track: RemoteTrack,
          _publication: RemoteTrackPublication,
          participant: RemoteParticipant
        ) {
          if (!isCurrentConnection()) {
            return;
          }

          console.log(
            "Allive viewer received track:",
            track.kind,
            participant.identity,
            getParticipantRole(participant)
          );

          if (track.kind === Track.Kind.Video) {
            const element =
              track.attach() as HTMLVideoElement;

            element.autoplay = true;
            element.playsInline = true;
            element.muted = true;

            element.style.position = "absolute";
            element.style.inset = "0";
            element.style.width = "100%";
            element.style.height = "100%";
            element.style.objectFit = "cover";

            if (videoContainerRef.current) {
              videoContainerRef.current.innerHTML = "";
              videoContainerRef.current.appendChild(
                element
              );
            }

            element.play().catch((playError) => {
              console.error(
                "Allive video play error:",
                playError
              );
            });

            setHasVideo(true);
            setStatus("LIVE");
          }

          if (track.kind === Track.Kind.Audio) {
            const element = track.attach();
            element.autoplay = true;

            if (audioContainerRef.current) {
              audioContainerRef.current.innerHTML = "";
              audioContainerRef.current.appendChild(
                element
              );
            }
          }
        }

        // IMPORTANTE:
        // No hacemos recorrido manual de remoteParticipants.
        // TrackSubscribed es el único punto de attach para evitar
        // el doble attach/play que ya provocó AbortError.
        room.on(
          RoomEvent.TrackSubscribed,
          attachTrack
        );

        room.on(
          RoomEvent.TrackUnsubscribed,
          (track) => {
            track
              .detach()
              .forEach((element) => {
                element.remove();
              });
          }
        );

        room.on(
          RoomEvent.ParticipantConnected,
          refreshViewerCount
        );

        room.on(
          RoomEvent.ParticipantDisconnected,
          refreshViewerCount
        );

        room.on(
          RoomEvent.ParticipantAttributesChanged,
          refreshViewerCount
        );

        room.on(
          RoomEvent.ParticipantMetadataChanged,
          refreshViewerCount
        );

        room.on(
          RoomEvent.Disconnected,
          () => {
            if (!isCurrentConnection()) {
              return;
            }

            setConnected(false);
            setHasVideo(false);
            setStatus("LIVE finalizado");
            setViewers(0);
          }
        );

        await room.connect(
          serverUrl,
          participantToken,
          {
            autoSubscribe: true,
          }
        );

        if (
          disposed ||
          connectionVersion !==
            connectionVersionRef.current
        ) {
          room.disconnect();
          return;
        }

        setConnected(true);
        setStatus(
          "Conectado · esperando vídeo"
        );

        updateViewerCount(room);
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
          caughtError
        );

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "No se ha podido conectar al LIVE."
        );

        setStatus("No disponible");
      }
    }

    connectToLive(activeLive);

    return () => {
      disposed = true;

      if (
        connectionVersion ===
        connectionVersionRef.current
      ) {
        connectionVersionRef.current += 1;
      }

      const room = roomRef.current;

      if (room) {
        room.disconnect();
      }

      roomRef.current = null;
      clearMedia();
    };
  }, [
    activeLive?.id,
    clearMedia,
    disconnectCurrentRoom,
  ]);

  useEffect(() => {
    setComments(MOCK_COMMENTS);
    setCommentValue("");
  }, [activeLive?.id]);

  function goToPreviousLive() {
    if (lives.length <= 1) {
      return;
    }

    setCurrentIndex((index) => {
      if (index <= 0) {
        return lives.length - 1;
      }

      return index - 1;
    });
  }

  function goToNextLive() {
    if (lives.length <= 1) {
      return;
    }

    setCurrentIndex((index) => {
      if (index >= lives.length - 1) {
        return 0;
      }

      return index + 1;
    });
  }

  function enableAudio() {
    roomRef.current?.startAudio();
  }

  function sendMockComment() {
    const text = commentValue.trim();

    if (!text) {
      return;
    }

    setComments((currentComments) => [
      ...currentComments,
      {
        id: `local-${Date.now()}`,
        username: "tú",
        text,
        likes: 0,
      },
    ]);

    setCommentValue("");
  }

  function toggleMockCommentLike(commentId: string) {
    setComments((currentComments) =>
      currentComments.map((comment) => {
        if (comment.id !== commentId) {
          return comment;
        }

        const liked = !comment.liked;

        return {
          ...comment,
          liked,
          likes: Math.max(
            0,
            comment.likes + (liked ? 1 : -1)
          ),
        };
      })
    );
  }

  function toggleSavedLive() {
    if (!activeLive) {
      return;
    }

    setSavedLiveIds((currentIds) => {
      if (currentIds.includes(activeLive.id)) {
        return currentIds.filter(
          (id) => id !== activeLive.id
        );
      }

      return [...currentIds, activeLive.id];
    });
  }

  const isSaved = activeLive
    ? savedLiveIds.includes(activeLive.id)
    : false;

  return (
    <View style={styles.container}>
      <div
        ref={videoContainerRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#08090A",
          overflow: "hidden",
        }}
      />

      <div ref={audioContainerRef} />

      {!hasVideo && (
        <View style={styles.waiting}>
          <Ionicons
            name="radio-outline"
            size={42}
            color={
              connected
                ? colors.live
                : "rgba(255,255,255,0.35)"
            }
          />

          <Text style={styles.waitingTitle}>
            {status}
          </Text>

          <Text style={styles.waitingSubtitle}>
            {lives.length > 0
              ? "Preparando emisión"
              : "Buscando emisiones activas"}
          </Text>
        </View>
      )}

      {activeLive && hasVideo && (
        <>
          <LiveViewerOverlay
            live={activeLive}
            viewerCount={viewers}
            currentIndex={currentIndex}
            totalLives={lives.length}
            comments={comments}
            commentValue={commentValue}
            saved={isSaved}
            onCommentChange={setCommentValue}
            onSendComment={sendMockComment}
            onLikeComment={toggleMockCommentLike}
            onSavePress={toggleSavedLive}
            onPreviousLive={goToPreviousLive}
            onNextLive={goToNextLive}
          />

          <Pressable
            style={styles.audioButton}
            onPress={enableAudio}
          >
            <Ionicons
              name="volume-high-outline"
              size={17}
              color={colors.text}
            />
            <Text style={styles.audioText}>
              Activar audio
            </Text>
          </Pressable>
        </>
      )}

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: colors.background,
  },

  waiting: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  waitingTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },

  waitingSubtitle: {
    color: colors.textMuted,
    fontSize: 11,
  },

  audioButton: {
    position: "absolute",
    left: 14,
    bottom: 58,
    zIndex: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.65)",
  },

  audioText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "700",
  },

  errorBox: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 130,
    zIndex: 50,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,59,48,0.18)",
  },

  errorText: {
    color: "#FF8A83",
    fontSize: 11,
  },
});
