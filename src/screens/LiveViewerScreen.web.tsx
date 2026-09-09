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
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "../theme/colors";

const API_URL = "http://localhost:3001";
const REFRESH_INTERVAL_MS = 5000;

type ActiveLive = {
  id: string;
  roomName: string;
  status: "LIVE" | "ENDED";
  title: string | null;
  description: string | null;
  placeName: string | null;
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

function getParticipantRole(
  participant: Participant
) {
  const attributeRole =
    participant.attributes?.role;

  if (
    attributeRole === "viewer" ||
    attributeRole === "broadcaster"
  ) {
    return attributeRole;
  }

  if (participant.metadata) {
    try {
      const parsed = JSON.parse(
        participant.metadata
      );

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

  if (
    participant.identity.startsWith(
      "viewer-"
    )
  ) {
    return "viewer";
  }

  if (
    participant.identity.startsWith(
      "broadcaster-"
    )
  ) {
    return "broadcaster";
  }

  return null;
}

export function LiveViewerScreen() {
  const roomRef =
    useRef<Room | null>(null);

  const connectionVersionRef =
    useRef(0);

  const videoContainerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const audioContainerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const previousViewerCountRef =
    useRef(0);

  const hasViewerCountRef =
    useRef(false);

  const viewerDeltaAnimation =
    useRef(new Animated.Value(0))
      .current;

  const [lives, setLives] =
    useState<ActiveLive[]>([]);

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const [status, setStatus] =
    useState("Buscando LIVE...");

  const [connected, setConnected] =
    useState(false);

  const [viewers, setViewers] =
    useState(0);

  const [viewerDelta, setViewerDelta] =
    useState<number | null>(null);

  const [hasVideo, setHasVideo] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const activeLive =
    lives[currentIndex] ?? null;

  function resetViewerCounter() {
    previousViewerCountRef.current = 0;
    hasViewerCountRef.current = false;

    setViewers(0);
    setViewerDelta(null);

    viewerDeltaAnimation.setValue(0);
  }

  function applyViewerCount(
    nextCount: number
  ) {
    const previousCount =
      previousViewerCountRef.current;

    setViewers(nextCount);

    if (!hasViewerCountRef.current) {
      hasViewerCountRef.current = true;

      previousViewerCountRef.current =
        nextCount;

      return;
    }

    const delta =
      nextCount - previousCount;

    previousViewerCountRef.current =
      nextCount;

    if (delta === 0) {
      return;
    }

    setViewerDelta(delta);

    viewerDeltaAnimation.stopAnimation();
    viewerDeltaAnimation.setValue(0);

    Animated.sequence([
      Animated.timing(
        viewerDeltaAnimation,
        {
          toValue: 1,
          duration: 160,
          useNativeDriver: false,
        }
      ),

      Animated.delay(650),

      Animated.timing(
        viewerDeltaAnimation,
        {
          toValue: 0,
          duration: 220,
          useNativeDriver: false,
        }
      ),
    ]).start(() => {
      setViewerDelta(null);
    });
  }

  function updateViewerCount(
    room: Room
  ) {
    /*
     * Esta pantalla SIEMPRE entra con un token viewer.
     * Por tanto contamos al participante local como 1.
     */
    let viewerCount = 1;

    room.remoteParticipants.forEach(
      (participant) => {
        if (
          getParticipantRole(
            participant
          ) === "viewer"
        ) {
          viewerCount += 1;
        }
      }
    );

    applyViewerCount(viewerCount);
  }

  async function getViewerToken(
    roomName: string
  ): Promise<LiveKitTokenResponse> {
    const response = await fetch(
      `${API_URL}/api/livekit/token`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          roomName,
          role: "viewer",
        }),
      }
    );

    if (!response.ok) {
      const responseBody =
        await response
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

  const clearMedia =
    useCallback(() => {
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
    }, []);

  const disconnectCurrentRoom =
    useCallback(() => {
      connectionVersionRef.current += 1;

      const room =
        roomRef.current;

      if (room) {
        room.disconnect();
      }

      roomRef.current = null;

      clearMedia();

      setConnected(false);
      resetViewerCounter();
    }, [clearMedia]);

  const loadActiveLives =
    useCallback(async () => {
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

        if (
          !Array.isArray(nextLives)
        ) {
          throw new Error(
            "Respuesta inválida del servidor."
          );
        }

        setLives(
          (previousLives) => {
            if (
              nextLives.length === 0
            ) {
              return [];
            }

            const currentLive =
              previousLives[
                currentIndex
              ];

            if (!currentLive) {
              return nextLives;
            }

            const stillActiveIndex =
              nextLives.findIndex(
                (live) =>
                  live.id ===
                  currentLive.id
              );

            if (
              stillActiveIndex === -1
            ) {
              return nextLives;
            }

            if (
              stillActiveIndex !==
              currentIndex
            ) {
              const reordered = [
                ...nextLives,
              ];

              const [stillActiveLive] =
                reordered.splice(
                  stillActiveIndex,
                  1
                );

              reordered.splice(
                Math.min(
                  currentIndex,
                  reordered.length
                ),
                0,
                stillActiveLive
              );

              return reordered;
            }

            return nextLives;
          }
        );

        setCurrentIndex((index) => {
          if (
            nextLives.length === 0
          ) {
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

    const interval =
      window.setInterval(
        () => {
          loadActiveLives();
        },
        REFRESH_INTERVAL_MS
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [loadActiveLives]);

  useEffect(() => {
    if (!activeLive) {
      disconnectCurrentRoom();

      setStatus(
        "No hay LIVE activos"
      );

      return;
    }

    const connectionVersion =
      connectionVersionRef.current + 1;

    connectionVersionRef.current =
      connectionVersion;

    let disposed = false;

    async function connectToLive(
      live: ActiveLive
    ) {
      try {
        const previousRoom =
          roomRef.current;

        if (previousRoom) {
          previousRoom.disconnect();
        }

        roomRef.current = null;

        clearMedia();

        setConnected(false);
        resetViewerCounter();

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
        } = await getViewerToken(
          live.roomName
        );

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
          if (
            !isCurrentConnection()
          ) {
            return;
          }

          updateViewerCount(room);
        }

        function attachTrack(
          track: RemoteTrack,
          _publication: RemoteTrackPublication,
          participant: RemoteParticipant
        ) {
          if (
            !isCurrentConnection()
          ) {
            return;
          }

          console.log(
            "Allive viewer received track:",
            track.kind,
            participant.identity,
            getParticipantRole(
              participant
            )
          );

          if (
            track.kind ===
            Track.Kind.Video
          ) {
            const element =
              track.attach() as HTMLVideoElement;

            element.autoplay = true;
            element.playsInline = true;
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
                element
              );
            }

            element
              .play()
              .catch(
                (playError) => {
                  console.error(
                    "Allive video play error:",
                    playError
                  );
                }
              );

            setHasVideo(true);
            setStatus("LIVE");
          }

          if (
            track.kind ===
            Track.Kind.Audio
          ) {
            const element =
              track.attach();

            element.autoplay = true;

            if (
              audioContainerRef.current
            ) {
              audioContainerRef.current.innerHTML =
                "";

              audioContainerRef.current.appendChild(
                element
              );
            }
          }
        }

        room.on(
          RoomEvent.TrackSubscribed,
          attachTrack
        );

        room.on(
          RoomEvent.TrackUnsubscribed,
          (track) => {
            track
              .detach()
              .forEach(
                (element) => {
                  element.remove();
                }
              );
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
            if (
              !isCurrentConnection()
            ) {
              return;
            }

            setConnected(false);
            setHasVideo(false);

            setStatus(
              "LIVE finalizado"
            );

            resetViewerCounter();
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

      const room =
        roomRef.current;

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
      if (
        index >=
        lives.length - 1
      ) {
        return 0;
      }

      return index + 1;
    });
  }

  function enableAudio() {
    roomRef.current?.startAudio();
  }

  const deltaOpacity =
    viewerDeltaAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

  const deltaTranslateY =
    viewerDeltaAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [6, 0],
    });

  const badgeScale =
    viewerDeltaAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.08],
    });

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

      <div
        ref={audioContainerRef}
      />

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

          <Text
            style={
              styles.waitingTitle
            }
          >
            {status}
          </Text>

          <Text
            style={
              styles.waitingSubtitle
            }
          >
            {lives.length > 0
              ? "Preparando emisión"
              : "Buscando emisiones activas"}
          </Text>
        </View>
      )}

      {activeLive && (
        <View style={styles.top}>
          <View
            style={
              styles.liveBadge
            }
          >
            <View
              style={
                styles.liveDot
              }
            />

            <Text
              style={
                styles.liveText
              }
            >
              {hasVideo
                ? "LIVE"
                : "CONECTANDO"}
            </Text>
          </View>

          <View
            style={
              styles.viewerBadgeWrapper
            }
          >
            <Animated.View
              style={[
                styles.viewerBadge,
                {
                  transform: [
                    {
                      scale:
                        badgeScale,
                    },
                  ],
                },
              ]}
            >
              <Ionicons
                name="eye-outline"
                size={15}
                color={colors.text}
              />

              <Text
                style={
                  styles.viewerText
                }
              >
                {viewers}
              </Text>
            </Animated.View>

            {viewerDelta !==
              null && (
              <Animated.Text
                style={[
                  styles.viewerDelta,
                  {
                    opacity:
                      deltaOpacity,
                    transform: [
                      {
                        translateY:
                          deltaTranslateY,
                      },
                    ],
                  },
                ]}
              >
                {viewerDelta > 0
                  ? `+${viewerDelta}`
                  : viewerDelta}
              </Animated.Text>
            )}
          </View>

          {lives.length > 1 && (
            <View
              style={
                styles.positionBadge
              }
            >
              <Text
                style={
                  styles.positionText
                }
              >
                {currentIndex + 1} /{" "}
                {lives.length}
              </Text>
            </View>
          )}
        </View>
      )}

      {activeLive &&
        hasVideo && (
          <View
            style={styles.bottom}
          >
            <View
              style={
                styles.locationRow
              }
            >
              <Ionicons
                name="location"
                size={16}
                color={colors.text}
              />

              <Text
                style={
                  styles.location
                }
              >
                {activeLive.placeName ??
                  "Allive"}
              </Text>
            </View>

            <Text
              style={styles.creator}
            >
              @
              {
                activeLive.creator
                  .username
              }
            </Text>

            <Text
              style={
                styles.description
              }
            >
              {activeLive.description ??
                "Emisión en directo en Allive."}
            </Text>

            <Pressable
              style={
                styles.audioButton
              }
              onPress={
                enableAudio
              }
            >
              <Ionicons
                name="volume-high-outline"
                size={17}
                color={colors.text}
              />

              <Text
                style={
                  styles.audioText
                }
              >
                Activar audio
              </Text>
            </Pressable>
          </View>
        )}

      {lives.length > 1 && (
        <View
          style={
            styles.liveNavigation
          }
        >
          <Pressable
            style={
              styles.navButton
            }
            onPress={
              goToPreviousLive
            }
          >
            <Ionicons
              name="chevron-up"
              size={24}
              color={colors.text}
            />
          </Pressable>

          <Pressable
            style={
              styles.navButton
            }
            onPress={goToNextLive}
          >
            <Ionicons
              name="chevron-down"
              size={24}
              color={colors.text}
            />
          </Pressable>
        </View>
      )}

      {error && (
        <View style={styles.errorBox}>
          <Text
            style={styles.errorText}
          >
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
    backgroundColor:
      colors.background,
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

  top: {
    position: "absolute",
    top: 22,
    left: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  liveBadge: {
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    borderRadius: 9,
    backgroundColor:
      "rgba(0,0,0,0.68)",
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.live,
  },

  liveText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "900",
  },

  viewerBadgeWrapper: {
    position: "relative",
    alignItems: "center",
  },

  viewerBadge: {
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    borderRadius: 9,
    backgroundColor:
      "rgba(0,0,0,0.68)",
  },

  viewerText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },

  viewerDelta: {
    position: "absolute",
    top: 32,
    color: colors.text,
    fontSize: 10,
    fontWeight: "900",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 7,
    backgroundColor:
      "rgba(0,0,0,0.72)",
  },

  positionBadge: {
    height: 30,
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: 9,
    backgroundColor:
      "rgba(0,0,0,0.68)",
  },

  positionText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "800",
  },

  bottom: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 115,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  location: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },

  creator: {
    marginTop: 6,
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },

  description: {
    marginTop: 6,
    color: colors.text,
    fontSize: 13,
  },

  audioButton: {
    alignSelf: "flex-start",
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 11,
    backgroundColor:
      "rgba(0,0,0,0.65)",
  },

  audioText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "700",
  },

  liveNavigation: {
    position: "absolute",
    right: 22,
    top: "42%",
    gap: 10,
  },

  navButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor:
      "rgba(0,0,0,0.68)",
  },

  errorBox: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 130,
    padding: 12,
    borderRadius: 12,
    backgroundColor:
      "rgba(255,59,48,0.18)",
  },

  errorText: {
    color: "#FF8A83",
    fontSize: 11,
  },
});