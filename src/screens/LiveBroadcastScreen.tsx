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
  Text,
  View,
} from "react-native";

import {
  LiveBroadcastStage,
} from "../components/live/broadcast";

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
  tokens,
} from "../styles";

import {
  liveBroadcastScreenStyles as styles,
} from "./LiveBroadcastScreen.styles";

type LiveBroadcastScreenProps = {
  facing: CameraType;
  authToken: string;
  title: string;
  eventName: string;
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

function NativeBroadcastRoom({
  error,
  eventName,
  onFinish,
  title,
}: {
  error: string | null;
  eventName: string;
  onFinish: () => void;
  title: string;
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

  const media =
    localCameraTrack &&
    isTrackReference(
      localCameraTrack,
    ) ? (
      <VideoTrack
        trackRef={
          localCameraTrack
        }
        style={
          styles.media
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
            tokens.color.text
              .primary
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
    );

  return (
    <LiveBroadcastStage
      media={media}
      overlay={{
        isLive: true,
        isConnecting: false,
        cameraReady: Boolean(
          localCameraTrack,
        ),
        viewers,
        likes: 0,
        comments: [],
        error,
        title,
        eventName,
        locationName: null,
        initialStartMetadataVisible:
          false,
        moreEnabled: false,
        microphoneControlEnabled:
          false,
        filtersEnabled: false,
        cameraSwitchEnabled:
          false,
        onStartLive: () => {},
        onFinishLive: onFinish,
        onToggleMicrophone:
          () => {},
        onOpenFilters: () => {},
        onSwitchCamera: () => {},
      }}
    />
  );
}

export function LiveBroadcastScreen({
  facing,
  authToken,
  title,
  eventName,
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
              title,
              eventName,
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
  }, [
    authToken,
    eventName,
    title,
  ]);

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

  if (error && !connection) {
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
            tokens.color.danger
              .text
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
            tokens.color.live
              .primary
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
        error={error}
        eventName={eventName}
        title={title}
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
              tokens.color.text
                .primary
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
