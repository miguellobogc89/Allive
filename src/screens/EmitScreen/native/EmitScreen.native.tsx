// src/screens/EmitScreen.native.tsx

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  type CameraType,
  useCameraPermissions,
} from "expo-camera";

import {
  useEffect,
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
  CameraSwitchControl,
} from "../../../components/live/broadcast/bottom-nav/CameraSwitchControl";

import {
  useBroadcastLocation,
} from "../../../components/live/useBroadcastLocation.native";

import {
  tokens,
} from "../../../styles";

import {
  emitScreenStyles as styles,
} from "../EmitScreen.styles";

import {
  LiveBroadcastScreen,
} from "../../LiveBroadcastScreen";

type EmitScreenProps = {
  onStatusChange?: (status: {
    isLive: boolean;
    isConnecting: boolean;
    cameraReady: boolean;
  }) => void;

  onStartLiveReady?: (
    startLive: (() => void) | null,
  ) => void;
};

export function EmitScreen({
  onStatusChange,
  onStartLiveReady,
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

  const [
    isLive,
    setIsLive,
  ] = useState(false);

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

  const cameraReady =
    Boolean(
      permission?.granted,
    );

  let displayedLocationName:
    | string
    | null = null;

  if (location) {
    displayedLocationName =
      location.placeName;
  }

  if (selectedLocationPlace) {
    displayedLocationName =
      selectedLocationPlace.name;
  }

  let locationCoordinates:
    | {
        latitude: number;
        longitude: number;
      }
    | null = null;

  if (location) {
    locationCoordinates = {
      latitude:
        location.latitude,
      longitude:
        location.longitude,
    };
  }

  function toggleCamera() {
    setFacing(
      (
        current,
      ) => {
        if (
          current === "back"
        ) {
          return "front";
        }

        return "back";
      },
    );
  }

  useEffect(
    () => {
      if (!onStatusChange) {
        return;
      }

      onStatusChange({
        isLive,
        isConnecting:
          false,
        cameraReady,
      });
    },
    [
      cameraReady,
      isLive,
      onStatusChange,
    ],
  );

  useEffect(
    () => {
      if (
        !isAuthenticated ||
        !token ||
        !cameraReady
      ) {
        if (
          onStartLiveReady
        ) {
          onStartLiveReady(
            null,
          );
        }

        return;
      }

      if (
        onStartLiveReady
      ) {
        onStartLiveReady(
          () => {
            setIsLive(
              true,
            );
          },
        );
      }

      return () => {
        if (
          onStartLiveReady
        ) {
          onStartLiveReady(
            null,
          );
        }
      };
    },
    [
      cameraReady,
      isAuthenticated,
      onStartLiveReady,
      token,
    ],
  );

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

  if (isLive) {
    return (
      <LiveBroadcastScreen
        facing={facing}
        authToken={token}
        title={title}
        eventName={eventName}
        onFinish={() => {
          setIsLive(
            false,
          );
        }}
      />
    );
  }

  return (
    <LiveBroadcastStage
      media={
        <LiveBroadcastSurface
          facing={facing}
        />
      }
      overlay={{
        isLive: false,
        isConnecting: false,
        cameraReady: true,
        viewers: 0,
        likes: 0,
        comments: [],
        error: null,
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
        onStartLive: () => {
          setIsLive(
            true,
          );
        },
        onFinishLive: () => {
          setIsLive(
            false,
          );
        },
        onToggleMicrophone:
          () => {},
        onOpenFilters:
          () => {},
        onSwitchCamera:
          toggleCamera,
      }}
    >
      <View
        style={
          styles.previewCameraSwitch
        }
      >
        <CameraSwitchControl
          onPress={
            toggleCamera
          }
        />
      </View>
    </LiveBroadcastStage>
  );
}