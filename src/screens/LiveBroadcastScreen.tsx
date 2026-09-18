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
  RoomContext,
  VideoTrack,
  useRemoteParticipants,
  useTracks,
} from "@livekit/react-native";

import {
  ConnectionState,
  LocalVideoTrack,
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
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";

import {
  releaseNativeCamera,
  replaceNativeCamera,
} from "../components/live/broadcast/replaceNativeCamera.native";

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

import type {
  EmitScreenControls,
  EmitScreenProps,
  EmitScreenStatus,
} from "./EmitScreen/emitScreen.types";

type LiveBroadcastScreenProps = {
  initialMicrophoneEnabled: boolean;
  onMicrophoneEnabledChange: (enabled: boolean) => void;
  onFacingChange: (facing: CameraType) => void;
  onStatusChange: (status: EmitScreenStatus) => void;
  onControlsReady: EmitScreenProps["onControlsReady"];
  onFinishLiveReady: EmitScreenProps["onFinishLiveReady"];
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
  status,
  controls,
  error,
  eventName,
  onFinish,
  title,
}: {
  status: EmitScreenStatus;
  controls: EmitScreenControls;
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
        ...status,
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
        microphoneControlEnabled: status.isLive,
        filtersEnabled: false,
        cameraSwitchEnabled: status.isLive,
        onStartLive: () => {},
        onFinishLive: onFinish,
        onToggleMicrophone: controls.toggleMicrophone,
        onOpenFilters: () => {},
        onSwitchCamera: controls.switchCamera,
      }}
    />
  );
}

export function LiveBroadcastScreen({
  facing,
  initialMicrophoneEnabled,
  onMicrophoneEnabledChange,
  onFacingChange,
  onStatusChange,
  onControlsReady,
  onFinishLiveReady,
  authToken,
  title,
  eventName,
  onFinish,
}: LiveBroadcastScreenProps) {
  const [connection, setConnection] = useState<NativeLiveConnection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [room] = useState(() => new Room({
    adaptiveStream: { pixelDensity: "screen" },
    dynacast: true,
  }));
  const [status, setStatus] = useState<EmitScreenStatus>({
    isLive: false,
    isConnecting: true,
    cameraReady: false,
    microphoneEnabled: false,
  });
  const initialMedia = useRef({ facing, microphoneEnabled: initialMicrophoneEnabled });
  // A completed capture replacement is not a hardware settling signal. Limit
  // repeated open/close cycles as an additional safeguard, not as resource cleanup.
  const cameraSwitchAvailableAt = useRef(0);
  const liveSessionIdRef = useRef<string | null>(null);
  const finalizedRef = useRef(false);
  const mountedRef = useRef(true);
  const finishingRef = useRef(false);
  const startupAttempted = useRef(false);
  const publicationReady = useRef(false);
  const failedRef = useRef(false);
  const mediaOperation = useRef<Promise<void> | null>(null);

  const disconnectCamera = useCallback(async () => {
    const camera = room.localParticipant.getTrackPublication(Track.Source.Camera)?.track;
    await room.disconnect();
    if (camera instanceof LocalVideoTrack) releaseNativeCamera(camera);
  }, [room]);

  const syncStatus = useCallback(() => {
    if (!mountedRef.current) return;
    const connected = room.state === ConnectionState.Connected;
    const participant = room.localParticipant;
    const camera = participant.getTrackPublication(Track.Source.Camera);
    const microphone = participant.getTrackPublication(Track.Source.Microphone);
    const cameraReady = connected && !finishingRef.current &&
      !!camera?.track && !camera.isMuted &&
      camera.track.mediaStreamTrack.readyState === "live" &&
      !camera.track.isUpstreamPaused;
    const microphoneEnabled = connected && !finishingRef.current &&
      !!microphone?.track && !microphone.isMuted &&
      microphone.track.mediaStreamTrack.readyState === "live" &&
      !microphone.track.isUpstreamPaused;
    setStatus({
      isLive: cameraReady && publicationReady.current,
      isConnecting: !finishingRef.current && !failedRef.current &&
        (!publicationReady.current ||
          room.state === ConnectionState.Reconnecting ||
          room.state === ConnectionState.SignalReconnecting),
      cameraReady,
      microphoneEnabled,
    });
  }, [room]);

  const reportError = useCallback((caughtError: unknown, fallback: string) => {
    if (!mountedRef.current) return;
    failedRef.current = true;
    setError(caughtError instanceof Error ? caughtError.message : fallback);
    syncStatus();
  }, [syncStatus]);

  useEffect(() => {
    onStatusChange(status);
  }, [status, onStatusChange]);

  useEffect(() => {
    const events = [
      RoomEvent.ConnectionStateChanged,
      RoomEvent.LocalTrackPublished,
      RoomEvent.LocalTrackUnpublished,
      RoomEvent.TrackMuted,
      RoomEvent.TrackUnmuted,
    ] as const;
    events.forEach((event) => room.on(event, syncStatus));
    return () => {
      events.forEach((event) => room.off(event, syncStatus));
    };
  }, [room, syncStatus]);

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    async function prepareLive() {
      let createdLiveSessionId: string | null = null;
      try {
        await AudioSession.startAudioSession();
        if (cancelled) {
          await AudioSession.stopAudioSession();
          return;
        }
        const roomName = createLiveRoomName();
        createdLiveSessionId = await registerLiveInBackend(
          roomName, { title, eventName, location: null }, authToken,
        );
        if (cancelled) {
          await markLiveAsEnded(createdLiveSessionId, authToken);
          return;
        }
        liveSessionIdRef.current = createdLiveSessionId;
        const tokenData: LiveKitTokenResponse = await getBroadcasterToken(roomName, authToken);
        if (cancelled) return;
        setConnection({
          roomName,
          liveSessionId: createdLiveSessionId,
          serverUrl: tokenData.serverUrl,
          participantToken: tokenData.participantToken,
        });
      } catch (caughtError) {
        if (createdLiveSessionId && !finalizedRef.current) {
          await markLiveAsEnded(createdLiveSessionId, authToken).catch(() => null);
        }
        liveSessionIdRef.current = null;
        if (!cancelled) reportError(caughtError, "No se ha podido iniciar el LIVE.");
      }
    }

    void prepareLive();
    return () => {
      cancelled = true;
      mountedRef.current = false;
      // Wait for native acquisition/replacement before destroying its sender/capturer.
      void (async () => {
        await mediaOperation.current;
        await disconnectCamera();
      })().catch((cleanupError) => {
        console.warn("No se pudo liberar la cámara native:", cleanupError);
      }).finally(() => AudioSession.stopAudioSession().catch(() => undefined));
      const liveSessionId = liveSessionIdRef.current;
      if (liveSessionId && !finalizedRef.current) {
        finalizedRef.current = true;
        void markLiveAsEnded(liveSessionId, authToken).catch((cleanupError) => {
          console.warn("No se pudo cerrar el LIVE native durante cleanup:", cleanupError);
        });
      }
    };
  }, [authToken, eventName, title, room, reportError, disconnectCamera]);

  const publishInitialMedia = useCallback(() => {
    if (startupAttempted.current || !mountedRef.current || finishingRef.current) return;
    startupAttempted.current = true;
    const operation = (async () => {
      try {
        const camera = await room.localParticipant.setCameraEnabled(true, {
          facingMode: initialMedia.current.facing === "front" ? "user" : "environment",
        });
        if (!mountedRef.current || finishingRef.current) return;
        if (!camera?.track || camera.isMuted) throw new Error("No se ha podido publicar la cámara.");
        // No automatic audio publication: a muted start never enables the microphone.
        await room.localParticipant.setMicrophoneEnabled(initialMedia.current.microphoneEnabled);
        if (!mountedRef.current || finishingRef.current) return;
        if (initialMedia.current.microphoneEnabled && !room.localParticipant.isMicrophoneEnabled) {
          throw new Error("No se ha podido publicar el micrófono.");
        }
        publicationReady.current = true;
        failedRef.current = false;
        setError(null);
      } catch (caughtError) {
        // Avoid leaving a partially started transmission after a permission/publication failure.
        await room.disconnect().catch(() => undefined);
        reportError(caughtError, "No se ha podido publicar cámara o micrófono.");
      } finally {
        syncStatus();
      }
    })();
    mediaOperation.current = operation;
    void operation.finally(() => {
      if (mediaOperation.current === operation) mediaOperation.current = null;
    });
  }, [room, reportError, syncStatus]);

  useEffect(() => {
    if (!connection) return;
    let cancelled = false;
    const onDisconnected = () => {
      if (!finishingRef.current) reportError(null, "Se ha desconectado el LIVE.");
    };
    room.on(RoomEvent.Disconnected, onDisconnected);
    // Own publication explicitly; LiveKitRoom automatically changes media on SignalConnected.
    void room.connect(connection.serverUrl, connection.participantToken).then(() => {
      if (!cancelled) publishInitialMedia();
    }).catch((caughtError) => {
      if (!cancelled) reportError(caughtError, "Error conectando con LiveKit.");
    });
    return () => {
      cancelled = true;
      room.off(RoomEvent.Disconnected, onDisconnected);
    };
  }, [connection, room, publishInitialMedia, reportError]);

  const runMediaOperation = useCallback((operation: () => Promise<void>) => {
    if (!mountedRef.current || finishingRef.current || mediaOperation.current ||
        !publicationReady.current || room.state !== ConnectionState.Connected) return;
    // Reserve the slot before invoking SDK operations or synchronous event handlers.
    const pending = Promise.resolve().then(async () => {
      if (!mountedRef.current || finishingRef.current || room.state !== ConnectionState.Connected) return;
      try {
        await operation();
        if (mountedRef.current) {
          failedRef.current = false;
          setError(null);
        }
      } catch (caughtError) {
        reportError(caughtError, "No se pudo cambiar la cámara o el micrófono.");
      } finally {
        syncStatus();
      }
    });
    mediaOperation.current = pending;
    void pending.finally(() => {
      if (mediaOperation.current === pending) mediaOperation.current = null;
    });
  }, [room, reportError, syncStatus]);

  const toggleMicrophone = useCallback(() => {
    runMediaOperation(async () => {
      const participant = room.localParticipant;
      const nextEnabled = !participant.isMicrophoneEnabled;
      try {
        await participant.setMicrophoneEnabled(nextEnabled);
        if (participant.isMicrophoneEnabled !== nextEnabled) {
          throw new Error("No se pudo cambiar el estado del micrófono.");
        }
      } finally {
        // Read the publication even on failure; never optimistically flip the UI.
        if (mountedRef.current && !finishingRef.current) {
          onMicrophoneEnabledChange(participant.isMicrophoneEnabled);
        }
      }
    });
  }, [room, runMediaOperation, onMicrophoneEnabledChange]);

  const switchCamera = useCallback(() => {
    if (performance.now() < cameraSwitchAvailableAt.current) return;
    runMediaOperation(async () => {
      const track = room.localParticipant.getTrackPublication(Track.Source.Camera)?.track;
      if (!(track instanceof LocalVideoTrack)) throw new Error("La cámara no está publicada.");
      const canContinue = () => mountedRef.current && !finishingRef.current &&
        room.state === ConnectionState.Connected &&
        room.localParticipant.getTrackPublication(Track.Source.Camera)?.track === track;
      const previousMode = track.mediaStreamTrack.getSettings().facingMode;
      if (previousMode !== "user" && previousMode !== "environment") {
        throw new Error("No se puede determinar la cámara activa.");
      }
      try {
        await replaceNativeCamera(
          room, track, previousMode === "user" ? "environment" : "user", canContinue,
        );
      } catch (caughtError) {
        // Acquisition failures leave the previous capture stopped. Recover only once,
        // never during teardown or after a failed sender replacement/disconnection.
        if (canContinue() && track.mediaStreamTrack.readyState !== "live") {
          try {
            await replaceNativeCamera(room, track, previousMode, canContinue);
          } catch (recoveryError) {
            await disconnectCamera();
            throw new Error("No se pudo recuperar la cámara. Finaliza el LIVE y vuelve a entrar.", {
              cause: recoveryError,
            });
          }
        }
        throw caughtError;
      } finally {
        cameraSwitchAvailableAt.current = performance.now() + 750;
        if (canContinue() && track.mediaStreamTrack.readyState === "live") {
          const actualMode = track.mediaStreamTrack.getSettings().facingMode;
          if (actualMode === "user" || actualMode === "environment") {
            onFacingChange(actualMode === "user" ? "front" : "back");
          }
        }
      }
    });
  }, [room, runMediaOperation, onFacingChange, disconnectCamera]);

  const finishLive = useCallback(async () => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    setFinishing(true);
    syncStatus();
    try {
      await mediaOperation.current;
      await disconnectCamera();
      const liveSessionId = liveSessionIdRef.current;
      if (liveSessionId && !finalizedRef.current) {
        await markLiveAsEnded(liveSessionId, authToken);
        finalizedRef.current = true;
        liveSessionIdRef.current = null;
      }
      await AudioSession.stopAudioSession();
      if (mountedRef.current) onFinish();
    } catch (caughtError) {
      finishingRef.current = false;
      if (mountedRef.current) setFinishing(false);
      reportError(caughtError, "No se ha podido finalizar el LIVE.");
    }
  }, [disconnectCamera, authToken, onFinish, reportError, syncStatus]);

  useEffect(() => {
    onControlsReady?.({ toggleMicrophone, switchCamera });
    return () => onControlsReady?.(null);
  }, [onControlsReady, toggleMicrophone, switchCamera]);

  useEffect(() => {
    onFinishLiveReady?.(() => { void finishLive(); });
    return () => onFinishLiveReady?.(null);
  }, [onFinishLiveReady, finishLive]);

  if (error && !status.isLive && !status.isConnecting) {
    return (
      <View style={styles.centered}>
        <Ionicons name="warning-outline" size={34} color={tokens.color.danger.text} />
        <Text style={styles.errorTitle}>No se pudo continuar el LIVE</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.backButton} disabled={finishing} onPress={() => void finishLive()}>
          <Text style={styles.backButtonText}>{finishing ? "FINALIZANDO..." : "VOLVER"}</Text>
        </Pressable>
      </View>
    );
  }

  if (!connection) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={tokens.color.live.primary} />
        <Text style={styles.connectingText}>Preparando LIVE...</Text>
      </View>
    );
  }

  return (
    <RoomContext.Provider value={room}>
      <NativeBroadcastRoom
        status={status}
        controls={{ toggleMicrophone, switchCamera }}
        error={error}
        eventName={eventName}
        title={title}
        onFinish={() => void finishLive()}
      />
      {!status.isLive && status.isConnecting && (
        <View style={styles.finishingOverlay}>
          <ActivityIndicator color={tokens.color.text.primary} />
          <Text style={styles.finishingText}>Conectando y preparando emisión...</Text>
        </View>
      )}
      {finishing && (
        <View style={styles.finishingOverlay}>
          <ActivityIndicator color={tokens.color.text.primary} />
          <Text style={styles.finishingText}>Finalizando LIVE...</Text>
        </View>
      )}
    </RoomContext.Provider>
  );
}
