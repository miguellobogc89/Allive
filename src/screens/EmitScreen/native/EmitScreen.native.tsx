// src/screens/EmitScreen/native/EmitScreen.native.tsx

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  type CameraType,
  useCameraPermissions,
} from "expo-camera";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Pressable,
  Text,
  View,
} from "react-native";

import type {
  LocationPlace,
} from "../../../api/locationApi";

import type {
  BroadcastLocation,
} from "../../../components/live/broadcastTypes";

import {
  useAuth,
} from "../../../auth/AuthContext";

import {
  LiveBroadcastStage,
} from "../../../components/live/broadcast";

import {
  LiveBroadcastSurface,
} from "../../../components/live/broadcast/LiveBroadcastSurface.native";

import {
  useBroadcastLocation,
} from "../../../components/live/useBroadcastLocation.native";

import {
  tokens,
} from "../../../styles";

import {
  LiveBroadcastScreen,
} from "../../LiveBroadcastScreen";

import {
  EmitBackButton,
} from "../components/EmitBackButton";

import {
  emitScreenStyles as styles,
} from "../EmitScreen.styles";

import type {
  EmitScreenProps,
  EmitScreenStatus,
} from "../emitScreen.types";

export function EmitScreen({
  onStatusChange,
  onStartLiveReady,
  onFinishLiveReady,
  onControlsReady,
  onClose,
}: EmitScreenProps) {
  const {
    token,
    isAuthenticated,
  } = useAuth();

  const [
    permission,
    requestPermission,
  ] = useCameraPermissions();

  const [
    facing,
    setFacing,
  ] = useState<CameraType>(
    "back",
  );

  const [broadcastRequested, setBroadcastRequested] = useState(false);
  const broadcastRequestedRef = useRef(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [broadcastStatus, setBroadcastStatus] = useState<EmitScreenStatus>({
    isLive: false,
    isConnecting: true,
    cameraReady: false,
    microphoneEnabled: false,
  });

  const [
    microphoneEnabled,
    setMicrophoneEnabled,
  ] = useState(true);

  const [
    title,
    setTitle,
  ] = useState("");

  const [
    eventName,
    setEventName,
  ] = useState("");

  const [
    selectedLocationPlace,
    setSelectedLocationPlace,
  ] = useState<LocationPlace | null>(
    null,
  );

  const {
    location,
  } = useBroadcastLocation();

  const cameraReady = Boolean(permission?.granted) && previewReady && !cameraError;

let effectiveLocation: BroadcastLocation | null = null;

if (selectedLocationPlace) {
  effectiveLocation = {
    latitude: selectedLocationPlace.latitude,
    longitude: selectedLocationPlace.longitude,
    placeName: selectedLocationPlace.name,
  };
} else if (location) {
  effectiveLocation = location;
}

const displayedLocationName =
  effectiveLocation?.placeName ?? null;

const locationCoordinates =
  effectiveLocation
    ? {
        latitude: effectiveLocation.latitude,
        longitude: effectiveLocation.longitude,
      }
    : null;

  const toggleCamera = useCallback(() => {
    if (broadcastRequestedRef.current) return;
    setPreviewReady(false);
    setCameraError(null);
    setFacing((current) => current === "back" ? "front" : "back");
  }, []);

  const toggleMicrophone = useCallback(() => {
    if (broadcastRequestedRef.current) return;
    // Before connecting this is a preference; during LIVE the room owns the control.
    setMicrophoneEnabled((current) => !current);
  }, []);

  const startLive = useCallback(() => {
    if (!isAuthenticated || !token || !cameraReady || broadcastRequestedRef.current) return;
    broadcastRequestedRef.current = true;
    setBroadcastStatus({
      isLive: false,
      isConnecting: true,
      cameraReady: false,
      microphoneEnabled: false,
    });
    setPreviewReady(false);
    setBroadcastRequested(true);
  }, [isAuthenticated, token, cameraReady]);

  const finishLive = useCallback(() => {
    broadcastRequestedRef.current = false;
    setPreviewReady(false);
    setCameraError(null);
    setBroadcastRequested(false);
  }, []);

  useEffect(() => {
    onStatusChange?.(broadcastRequested ? broadcastStatus : {
      isLive: false,
      isConnecting: false,
      cameraReady,
      microphoneEnabled,
    });
  }, [broadcastRequested, broadcastStatus, cameraReady, microphoneEnabled, onStatusChange]);

  useEffect(() => {
    onStartLiveReady?.(
      !broadcastRequested && isAuthenticated && token && cameraReady ? startLive : null,
    );
    return () => onStartLiveReady?.(null);
  }, [broadcastRequested, isAuthenticated, token, cameraReady, startLive, onStartLiveReady]);

  useEffect(() => {
    // The mounted broadcast screen registers its own real room controls and finish action.
    if (broadcastRequested) return;
    onFinishLiveReady?.(null);
    onControlsReady?.({ toggleMicrophone, switchCamera: toggleCamera });
    return () => onControlsReady?.(null);
  }, [broadcastRequested, onControlsReady, onFinishLiveReady, toggleMicrophone, toggleCamera]);

  if (
    !isAuthenticated ||
    !token
  ) {
    return (
      <View
        style={
          styles.permissionScreen
        }
      >
        <View
          style={
            styles.permissionIcon
          }
        >
          <Ionicons
            name="person-outline"
            size={34}
            color={
              tokens.color.text
                .primary
            }
          />
        </View>

        <Text
          style={
            styles.permissionTitle
          }
        >
          Inicia sesión para emitir
        </Text>

        <Text
          style={
            styles.permissionText
          }
        >
          Los invitados pueden ver
          emisiones, pero necesitas una
          cuenta de Allive para iniciar un
          LIVE.
        </Text>
      </View>
    );
  }

  if (!permission) {
    return (
      <View
        style={
          styles.permissionScreen
        }
      >
        <Text
          style={
            styles.permissionText
          }
        >
          Preparando cámara...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View
        style={
          styles.permissionScreen
        }
      >
        <View
          style={
            styles.permissionIcon
          }
        >
          <Ionicons
            name="videocam-outline"
            size={34}
            color={
              tokens.color.text
                .primary
            }
          />
        </View>

        <Text
          style={
            styles.permissionTitle
          }
        >
          Allive necesita tu cámara
        </Text>

        <Text
          style={
            styles.permissionText
          }
        >
          La cámara es necesaria para
          poder emitir en directo.
        </Text>

        <Pressable
          style={
            styles.permissionButton
          }
          onPress={
            requestPermission
          }
        >
          <Text
            style={
              styles.permissionButtonText
            }
          >
            PERMITIR CÁMARA
          </Text>
        </Pressable>
      </View>
    );
  }

  if (broadcastRequested) {
    return (
      <LiveBroadcastScreen
        facing={facing}
        location={effectiveLocation}
        initialMicrophoneEnabled={microphoneEnabled}
        onMicrophoneEnabledChange={setMicrophoneEnabled}
        onFacingChange={setFacing}
        onStatusChange={setBroadcastStatus}
        onControlsReady={onControlsReady}
        onFinishLiveReady={onFinishLiveReady}
        authToken={token}
        title={title}
        eventName={eventName}
        onFinish={
          finishLive
        }
      />
    );
  }

  return (
    <LiveBroadcastStage
      media={
        <LiveBroadcastSurface
          facing={facing}
          cameraReady={cameraReady}
          cameraError={cameraError}
          onCameraReady={() => {
            setCameraError(null);
            setPreviewReady(true);
          }}
          onMountError={({ message }) => {
            setPreviewReady(false);
            setCameraError(message || "No se ha podido preparar la cámara.");
          }}
        />
      }
      overlay={{
        isLive: false,
        isConnecting: false,
        cameraReady,
        microphoneEnabled,
        viewers: 0,
        likes: 0,
        comments: [],
        error: cameraError,

        title,
        eventName,

        locationName:
          displayedLocationName,

        locationCoordinates,

        selectedLocationPlace,

        onChangeTitle:
          setTitle,

        onChangeEventName:
          setEventName,

        onChangeLocationPlace:
          setSelectedLocationPlace,

        onStartLive:
          startLive,

        onFinishLive:
          finishLive,

        onToggleMicrophone:
          toggleMicrophone,

        onOpenFilters:
          () => {},

        onSwitchCamera:
          toggleCamera,
      }}
    >
      <EmitBackButton
        onPress={
          onClose
        }
      />
    </LiveBroadcastStage>
  );
}