// src/screens/LiveBroadcastScreen.tsx

import {
  Ionicons,
} from "@expo/vector-icons";

import type {
  CameraType,
} from "expo-camera";

import {
  AudioSession,
  isTrackReference,
  LiveKitRoom,
  VideoTrack,
  useRemoteParticipants,
  useTracks,
} from "@livekit/react-native";

import {
  Track,
} from "livekit-client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  getBroadcasterToken,
  markLiveAsEnded,
  registerLiveInBackend,
} from "../components/live/liveBroadcastApi";

import {
  getParticipantRole,
} from "../components/live/liveParticipantRole";

import type {
  LiveKitTokenResponse,
} from "../components/live/types";

import {
  colors,
  controls,
  layout,
  typography,
} from "../styles";

type LiveBroadcastScreenProps = {
  facing: CameraType;
  authToken: string;
  onFinish: () => void;
};

type NativeLiveConnection = {
  roomName: string;
  liveSessionId: string;
  serverUrl: string;
  participantToken: string;
};

function createLiveRoomName() {
  return `live-${Date.now()}`;
}

function formatDuration(
  totalSeconds: number,
) {
  const minutes = Math.floor(
    totalSeconds / 60,
  );

  const remainingSeconds =
    totalSeconds % 60;

  return `${minutes
    .toString()
    .padStart(
      2,
      "0",
    )}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

function NativeBroadcastRoom({
  seconds,
  onFinish,
}: {
  seconds: number;
  onFinish: () => void;
}) {
  const tracks = useTracks([
    Track.Source.Camera,
  ]);

  const remoteParticipants =
    useRemoteParticipants();

  const viewers =
    remoteParticipants.filter(
      (participant) =>
        getParticipantRole(
          participant,
        ) === "viewer",
    ).length;

  const localCameraTrack =
    tracks.find(
      (track) =>
        isTrackReference(
          track,
        ) &&
        track.participant.isLocal,
    );

  return (
    <View style={styles.container}>
      {localCameraTrack &&
      isTrackReference(
        localCameraTrack,
      ) ? (
        <VideoTrack
          trackRef={
            localCameraTrack
          }
          style={
            styles.video
          }
        />
      ) : (
        <View
          style={
            styles.cameraWaiting
          }
        >
          <ActivityIndicator
            color={
              colors.text
            }
          />

          <Text
            style={
              styles.cameraWaitingText
            }
          >
            Activando cámara...
          </Text>
        </View>
      )}

      <View style={styles.shade} />

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
            LIVE
          </Text>
        </View>

        <View
          style={
            styles.durationBadge
          }
        >
          <Text
            style={
              styles.duration
            }
          >
            {formatDuration(
              seconds,
            )}
          </Text>
        </View>

        <View
          style={
            styles.viewerBadge
          }
        >
          <Ionicons
            name="eye-outline"
            size={15}
            color={
              colors.text
            }
          />

          <Text
            style={
              styles.viewerText
            }
          >
            {viewers}
          </Text>
        </View>
      </View>

      <View
        style={styles.bottom}
      >
        <View
          style={
            styles.location
          }
        >
          <Ionicons
            name="location"
            size={16}
            color={
              colors.text
            }
          />

          <Text
            style={
              styles.locationText
            }
          >
            Ubicación actual
          </Text>
        </View>

        <View
          style={styles.status}
        >
          <View
            style={
              styles.statusDot
            }
          />

          <Text
            style={
              styles.statusText
            }
          >
            Estás emitiendo ahora
          </Text>
        </View>

        <Pressable
          style={
            styles.finishButton
          }
          onPress={onFinish}
        >
          <View
            style={
              styles.stopIcon
            }
          />

          <Text
            style={
              styles.finishText
            }
          >
            FINALIZAR LIVE
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export function LiveBroadcastScreen({
  facing,
  authToken,
  onFinish,
}: LiveBroadcastScreenProps) {
  const [
    connection,
    setConnection,
  ] =
    useState<NativeLiveConnection | null>(
      null,
    );

  const [
    seconds,
    setSeconds,
  ] = useState(0);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    finishing,
    setFinishing,
  ] = useState(false);

  const liveSessionIdRef =
    useRef<string | null>(
      null,
    );

  const finalizedRef =
    useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function prepareLive() {
      let createdLiveSessionId:
        | string
        | null = null;

      try {
        setError(null);

        await AudioSession.startAudioSession();

        const roomName =
          createLiveRoomName();

        createdLiveSessionId =
          await registerLiveInBackend(
            roomName,
            {
              title: "",
              eventName: "",
              location: null,
            },
            authToken,
          );

        liveSessionIdRef.current =
          createdLiveSessionId;

        const tokenData:
          LiveKitTokenResponse =
          await getBroadcasterToken(
            roomName,
            authToken,
          );

        if (cancelled) {
          await markLiveAsEnded(
            createdLiveSessionId,
            authToken,
          ).catch(() => null);

          return;
        }

        setConnection({
          roomName,

          liveSessionId:
            createdLiveSessionId,

          serverUrl:
            tokenData.serverUrl,

          participantToken:
            tokenData.participantToken,
        });
      } catch (
        caughtError
      ) {
        if (
          createdLiveSessionId
        ) {
          await markLiveAsEnded(
            createdLiveSessionId,
            authToken,
          ).catch(
            () => null,
          );
        }

        liveSessionIdRef.current =
          null;

        console.error(
          "Allive native broadcast setup error:",
          caughtError,
        );

        if (!cancelled) {
          setError(
            caughtError instanceof
              Error
              ? caughtError.message
              : "No se ha podido iniciar el LIVE.",
          );
        }
      }
    }

    void prepareLive();

    return () => {
      cancelled = true;

      void AudioSession.stopAudioSession();

      const liveSessionId =
        liveSessionIdRef.current;

      if (
        liveSessionId &&
        !finalizedRef.current
      ) {
        finalizedRef.current =
          true;

        void markLiveAsEnded(
          liveSessionId,
          authToken,
        ).catch(
          (cleanupError) => {
            console.warn(
              "No se pudo cerrar el LIVE native durante cleanup:",
              cleanupError,
            );
          },
        );
      }
    };
  }, [authToken]);

  useEffect(() => {
    if (!connection) {
      return;
    }

    const timer = setInterval(
      () => {
        setSeconds(
          (current) =>
            current + 1,
        );
      },
      1000,
    );

    return () =>
      clearInterval(timer);
  }, [connection]);

  async function finishLive() {
    if (finishing) {
      return;
    }

    setFinishing(true);

    try {
      const liveSessionId =
        liveSessionIdRef.current;

      if (
        liveSessionId &&
        !finalizedRef.current
      ) {
        finalizedRef.current =
          true;

        await markLiveAsEnded(
          liveSessionId,
          authToken,
        );

        liveSessionIdRef.current =
          null;
      }

      await AudioSession.stopAudioSession();

      onFinish();
    } catch (
      caughtError
    ) {
      finalizedRef.current =
        false;

      console.error(
        "Allive native finish error:",
        caughtError,
      );

      setError(
        caughtError instanceof
          Error
          ? caughtError.message
          : "No se ha podido finalizar el LIVE.",
      );

      setFinishing(false);
    }
  }

  if (error) {
    return (
      <View
        style={
          styles.centered
        }
      >
        <Ionicons
          name="warning-outline"
          size={34}
          color={
            colors.dangerText
          }
        />

        <Text
          style={
            styles.errorTitle
          }
        >
          No se pudo iniciar el LIVE
        </Text>

        <Text
          style={
            styles.errorText
          }
        >
          {error}
        </Text>

        <Pressable
          style={
            styles.backButton
          }
          onPress={onFinish}
        >
          <Text
            style={
              styles.backButtonText
            }
          >
            VOLVER
          </Text>
        </Pressable>
      </View>
    );
  }

  if (!connection) {
    return (
      <View
        style={
          styles.centered
        }
      >
        <ActivityIndicator
          color={
            colors.live
          }
        />

        <Text
          style={
            styles.connectingText
          }
        >
          Preparando LIVE...
        </Text>
      </View>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={
        connection.serverUrl
      }
      token={
        connection.participantToken
      }
      connect
      audio
      video={{
        facingMode:
          facing === "front"
            ? "user"
            : "environment",
      }}
      options={{
        adaptiveStream: {
          pixelDensity:
            "screen",
        },

        dynacast: true,
      }}
      onConnected={() => {
        console.log(
          "Allive native broadcaster connected:",
          connection.roomName,
        );
      }}
      onError={(
        roomError,
      ) => {
        console.error(
          "Allive native LiveKit error:",
          roomError,
        );

        setError(
          roomError.message ||
            "Error conectando con LiveKit.",
        );
      }}
      onMediaDeviceFailure={(
        failure,
      ) => {
        console.error(
          "Allive native media device failure:",
          failure,
        );

        setError(
          "No se ha podido acceder correctamente a la cámara o al micrófono.",
        );
      }}
    >
      <NativeBroadcastRoom
        seconds={seconds}
        onFinish={() =>
          void finishLive()
        }
      />

      {finishing ? (
        <View
          style={
            styles.finishingOverlay
          }
        >
          <ActivityIndicator
            color={
              colors.text
            }
          />

          <Text
            style={
              styles.finishingText
            }
          >
            Finalizando LIVE...
          </Text>
        </View>
      ) : null}
    </LiveKitRoom>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        colors.pureBlack,
    },

    video: {
      ...StyleSheet.absoluteFill,
    },

    cameraWaiting: {
      ...StyleSheet.absoluteFill,

      alignItems: "center",
      justifyContent: "center",

      gap: 10,

      backgroundColor:
        colors.cameraBackground,
    },

    cameraWaitingText: {
      color:
        colors.textSecondary,

      fontSize: 12,
    },

    shade: {
      ...StyleSheet.absoluteFill,

      backgroundColor:
        colors.cameraShade,

      pointerEvents: "none",
    },

    top: {
      position: "absolute",

      top:
        layout.overlayTop,

      left:
        layout.overlayHorizontal,

      right:
        layout.overlayHorizontal,

      flexDirection: "row",

      alignItems: "center",

      gap: 8,
    },

    liveBadge: {
      height:
        controls.liveBadgeHeight,

      flexDirection: "row",

      alignItems: "center",

      gap: 6,

      paddingHorizontal: 11,

      borderRadius: 10,

      backgroundColor:
        colors.live,
    },

    liveDot: {
      width:
        controls.badgeDotSize,

      height:
        controls.badgeDotSize,

      borderRadius: 4,

      backgroundColor:
        colors.text,
    },

    liveText: {
      color: colors.text,

      fontSize: 11,

      fontWeight: "900",
    },

    durationBadge: {
      height:
        controls.liveBadgeHeight,

      alignItems: "center",

      justifyContent:
        "center",

      paddingHorizontal: 11,

      borderRadius: 10,

      backgroundColor:
        colors.overlayStrong,
    },

    duration: {
      color: colors.text,

      fontSize: 12,

      fontWeight: "800",
    },

    viewerBadge: {
      height:
        controls.liveBadgeHeight,

      flexDirection: "row",

      alignItems: "center",

      gap: 5,

      paddingHorizontal: 11,

      borderRadius: 10,

      backgroundColor:
        colors.overlayStrong,
    },

    viewerText: {
      color: colors.text,

      fontSize: 12,

      fontWeight: "700",
    },

    bottom: {
      position: "absolute",

      left: 22,
      right: 22,

      bottom:
        layout.nativeBroadcastBottom,

      alignItems: "center",
    },

    location: {
      flexDirection: "row",

      alignItems: "center",

      gap: 5,

      paddingHorizontal: 12,

      paddingVertical: 8,

      borderRadius: 10,

      backgroundColor:
        colors.overlayChrome,
    },

    locationText: {
      color: colors.text,

      fontSize: 12,

      fontWeight: "700",
    },

    status: {
      marginTop: 10,

      flexDirection: "row",

      alignItems: "center",

      gap: 6,
    },

    statusDot: {
      width:
        controls.badgeDotSize,

      height:
        controls.badgeDotSize,

      borderRadius: 4,

      backgroundColor:
        colors.live,
    },

    statusText: {
      color:
        colors.textOnOverlaySecondary,

      fontSize: 11,

      fontWeight: "600",
    },

    finishButton: {
      height: 54,

      marginTop: 22,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "center",

      gap: 9,

      paddingHorizontal: 24,

      borderRadius: 18,

      backgroundColor:
        colors.overlayRaisedStrong,

      borderWidth: 1,

      borderColor:
        colors.borderOnOverlaySubtle,
    },

    stopIcon: {
      width:
        controls.stopIconSize,

      height:
        controls.stopIconSize,

      borderRadius: 3,

      backgroundColor:
        colors.live,
    },

    finishText: {
      color: colors.text,

      fontSize:
        typography.caption
          .fontSize + 2,

      fontWeight: "900",
    },

    centered: {
      flex: 1,

      alignItems: "center",

      justifyContent:
        "center",

      paddingHorizontal: 32,

      backgroundColor:
        colors.background,
    },

    connectingText: {
      marginTop: 12,

      color:
        colors.textSecondary,

      fontSize: 13,
    },

    errorTitle: {
      marginTop: 14,

      color: colors.text,

      fontSize: 18,

      fontWeight: "900",

      textAlign: "center",
    },

    errorText: {
      marginTop: 8,

      color:
        colors.textSecondary,

      fontSize: 12,

      lineHeight: 18,

      textAlign: "center",
    },

    backButton: {
      height: 46,

      marginTop: 22,

      paddingHorizontal: 22,

      alignItems: "center",

      justifyContent:
        "center",

      borderRadius: 14,

      backgroundColor:
        colors.surfaceElevated,
    },

    backButtonText: {
      color: colors.text,

      fontSize: 12,

      fontWeight: "900",
    },

    finishingOverlay: {
      ...StyleSheet.absoluteFill,

      zIndex: 100,

      alignItems: "center",

      justifyContent:
        "center",

      gap: 10,

      backgroundColor:
        colors.overlayStrong,
    },

    finishingText: {
      color: colors.text,

      fontSize: 12,

      fontWeight: "700",
    },
  });