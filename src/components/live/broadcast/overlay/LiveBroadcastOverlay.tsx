// src/components/live/broadcast/overlay/LiveBroadcastOverlay.tsx

import { LinearGradient } from "expo-linear-gradient";
import {
  useRef,
  useState,
} from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import type {
  LocationPlace,
} from "../../../../api/locationApi";

import type {
  LiveCommentModel,
} from "../../comments/liveCommentTypes";

import {
  LiveTimedCommentsLayer,
} from "../../comments/LiveTimedCommentsLayer";

import {
  LiveNotice,
} from "../../shared";

import {
  LiveBroadcastBottomNav,
} from "../bottom-nav";

import {
  LiveBroadcastHeader,
} from "../header";

import {
  LiveBroadcastMetadata,
} from "../metadata/LiveBroadcastMetadata";

import {
  LiveStartMetadataModal,
} from "../metadata/LiveStartMetadataModal";

import {
  LiveBroadcastMoreMenu,
} from "../more-menu";

import {
  LiveBroadcastError,
} from "./LiveBroadcastError";

type LiveCoordinates = {
  latitude: number;
  longitude: number;
};

type LiveBroadcastOverlayProps = {
  isLive: boolean;
  isConnecting: boolean;
  cameraReady: boolean;

  viewers?: number;
  likes?: number;
  comments?: LiveCommentModel[];

  error: string | null;

  title?: string;
  eventName?: string;
  locationName?: string | null;

  locationCoordinates?: LiveCoordinates | null;

  selectedLocationPlace?: LocationPlace | null;

  microphoneEnabled?: boolean;
  initialStartMetadataVisible?: boolean;
  moreEnabled?: boolean;
  microphoneControlEnabled?: boolean;
  filtersEnabled?: boolean;
  cameraSwitchEnabled?: boolean;

  onChangeTitle?: (
    value: string,
  ) => void;

  onChangeEventName?: (
    value: string,
  ) => void;

  onChangeLocationPlace?: (
    place: LocationPlace | null,
  ) => void;

  onSaveMetadata?: () => void;

  onToggleMicrophone?: () => void;
  onOpenFilters?: () => void;
  onSwitchCamera?: () => void;

  onStartLive: () => void;
  onFinishLive: () => void;
};

export function LiveBroadcastOverlay({
  isLive,
  isConnecting,
  cameraReady,

  viewers = 0,
  likes = 0,
  comments = [],

  error,

  title = "",
  eventName = "",
  locationName = null,
  locationCoordinates = null,
  selectedLocationPlace = null,

  microphoneEnabled = true,
  initialStartMetadataVisible = true,
  moreEnabled = true,
  microphoneControlEnabled = true,
  filtersEnabled = true,
  cameraSwitchEnabled = true,

  onChangeTitle,
  onChangeEventName,
  onChangeLocationPlace,
  onSaveMetadata,

  onToggleMicrophone,
  onOpenFilters,
  onSwitchCamera,

  onStartLive,
  onFinishLive,
}: LiveBroadcastOverlayProps) {
  const [
    contentVisible,
    setContentVisible,
  ] = useState(true);

  const [
    startMetadataVisible,
    setStartMetadataVisible,
  ] = useState(
    initialStartMetadataVisible,
  );

  const [
    moreMenuVisible,
    setMoreMenuVisible,
  ] = useState(false);

  const [
    locationVisible,
    setLocationVisible,
  ] = useState(true);

  const [
    audienceMode,
    setAudienceMode,
  ] = useState<
    "public" | "followers"
  >("public");

  const [
    commentsEnabled,
    setCommentsEnabled,
  ] = useState(true);

  const [
    noticeMessage,
    setNoticeMessage,
  ] = useState<string | null>(
    null,
  );

  const opacity =
    useRef(
      new Animated.Value(1),
    ).current;

  const translateY =
    useRef(
      new Animated.Value(0),
    ).current;

  function hideContent() {
    if (
      !contentVisible ||
      startMetadataVisible
    ) {
      return;
    }

    setMoreMenuVisible(false);

    Animated.parallel([
      Animated.timing(
        opacity,
        {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        },
      ),

      Animated.timing(
        translateY,
        {
          toValue: -12,
          duration: 180,
          useNativeDriver: true,
        },
      ),
    ]).start(() => {
      setContentVisible(false);
    });
  }

  function showContent() {
    if (contentVisible) {
      return;
    }

    setContentVisible(true);

    opacity.setValue(0);
    translateY.setValue(-12);

    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.timing(
          opacity,
          {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          },
        ),

        Animated.timing(
          translateY,
          {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          },
        ),
      ]).start();
    });
  }

  function handleBackgroundPress() {
    if (startMetadataVisible) {
      return;
    }

    if (moreMenuVisible) {
      setMoreMenuVisible(false);
    }

    if (contentVisible) {
      hideContent();
      return;
    }

    showContent();
  }

  function toggleMoreMenu() {
    setMoreMenuVisible(
      (current) => !current,
    );
  }

  function openStartMetadata() {
    setMoreMenuVisible(false);
    setStartMetadataVisible(true);
  }

  function closeStartMetadata() {
    setStartMetadataVisible(false);
  }

  function acceptStartMetadata() {
    if (isLive) {
      if (onSaveMetadata) {
        onSaveMetadata();
      }

      setNoticeMessage(
        "Información del directo actualizada",
      );
    }

    setStartMetadataVisible(false);
  }

  function toggleAudience() {
    setAudienceMode(
      (current) => {
        let next:
          | "public"
          | "followers" =
          "public";

        if (
          current === "public"
        ) {
          next = "followers";
        }

        if (
          next === "followers"
        ) {
          setNoticeMessage(
            "Directo visible solo para seguidores",
          );
        } else {
          setNoticeMessage(
            "El directo ahora es público",
          );
        }

        return next;
      },
    );
  }

  function toggleComments() {
    setCommentsEnabled(
      (current) => {
        const next =
          !current;

        if (next) {
          setNoticeMessage(
            "Los comentarios se han activado",
          );
        } else {
          setNoticeMessage(
            "Los comentarios se han ocultado",
          );
        }

        return next;
      },
    );
  }

  function handleChangeTitle(
    value: string,
  ) {
    if (onChangeTitle) {
      onChangeTitle(value);
    }
  }

  function handleChangeEventName(
    value: string,
  ) {
    if (onChangeEventName) {
      onChangeEventName(value);
    }
  }

  function handleChangeLocationPlace(
    place: LocationPlace | null,
  ) {
    if (
      onChangeLocationPlace
    ) {
      onChangeLocationPlace(
        place,
      );
    }
  }

  function handleToggleMicrophone() {
    if (onToggleMicrophone) {
      onToggleMicrophone();
    }
  }

  function handleOpenFilters() {
    if (onOpenFilters) {
      onOpenFilters();
    }
  }

  function handleSwitchCamera() {
    if (onSwitchCamera) {
      onSwitchCamera();
    }
  }

  let metadataLocation:
    | string
    | null =
    locationName;

  if (!locationVisible) {
    metadataLocation = null;
  }

  let modalLocationName = "";

  if (locationName) {
    modalLocationName =
      locationName;
  }

  const hasMetadata =
    Boolean(
      eventName.trim(),
    ) ||
    Boolean(
      title.trim(),
    ) ||
    Boolean(
      locationVisible &&
        locationName,
    );

  return (
    <View
      pointerEvents="box-none"
      style={styles.overlay}
    >
      {isLive && (
        <LinearGradient
          pointerEvents="none"
          colors={[
            "rgba(0,0,0,0)",
            "rgba(0,0,0,0.08)",
            "rgba(0,0,0,0.22)",
            "rgba(0,0,0,0.48)",
          ]}
          locations={[
            0,
            0.35,
            0.7,
            1,
          ]}
          style={
            styles.bottomGradient
          }
        />
      )}

      <Pressable
        style={
          StyleSheet.absoluteFill
        }
        onPress={
          handleBackgroundPress
        }
      />

      <LiveBroadcastError
        message={error}
      />

      <LiveNotice
        message={noticeMessage}
        onHidden={() => {
          setNoticeMessage(null);
        }}
      />

      <LiveBroadcastHeader
        isLive={isLive}
        viewers={viewers}
        likes={likes}
        onFinishLive={
          onFinishLive
        }
      />

      {contentVisible && (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.contentLayer,
            {
              opacity,
              transform: [
                {
                  translateY,
                },
              ],
            },
          ]}
        >
          {isLive &&
            hasMetadata && (
              <Pressable
                onPress={
                  openStartMetadata
                }
                style={
                  styles.topMetadata
                }
              >
                <LiveBroadcastMetadata
                  eventName={
                    eventName
                  }
                  title={title}
                  location={
                    metadataLocation
                  }
                />
              </Pressable>
            )}

          <LiveTimedCommentsLayer
            comments={comments}
            visible={
              isLive &&
              commentsEnabled
            }
          />
        </Animated.View>
      )}

      {isLive && (
        <LiveBroadcastBottomNav
          isLive={isLive}
          isConnecting={
            isConnecting
          }
          cameraReady={
            cameraReady
          }
          microphoneEnabled={
            microphoneEnabled
          }
          moreEnabled={
            moreEnabled
          }
          microphoneControlEnabled={
            microphoneControlEnabled
          }
          filtersEnabled={
            filtersEnabled
          }
          cameraSwitchEnabled={
            cameraSwitchEnabled
          }
          onOpenMore={
            toggleMoreMenu
          }
          onToggleMicrophone={
            handleToggleMicrophone
          }
          onOpenFilters={
            handleOpenFilters
          }
          onSwitchCamera={
            handleSwitchCamera
          }
          onStartLive={
            onStartLive
          }
          onFinishLive={
            onFinishLive
          }
        />
      )}

      {isLive && (
        <LiveBroadcastMoreMenu
          visible={
            moreMenuVisible
          }
          audienceMode={
            audienceMode
          }
          commentsEnabled={
            commentsEnabled
          }
          onEdit={
            openStartMetadata
          }
          onToggleAudience={
            toggleAudience
          }
          onToggleComments={
            toggleComments
          }
        />
      )}

      <LiveStartMetadataModal
        visible={
          startMetadataVisible
        }
        title={title}
        eventName={eventName}
        locationName={
          modalLocationName
        }
        locationCoordinates={
          locationCoordinates
        }
        selectedLocationPlace={
          selectedLocationPlace
        }
        locationVisible={
          locationVisible
        }
        onChangeTitle={
          handleChangeTitle
        }
        onChangeEventName={
          handleChangeEventName
        }
        onChangeLocationPlace={
          handleChangeLocationPlace
        }
        onChangeLocationVisible={
          setLocationVisible
        }
        onAccept={
          acceptStartMetadata
        }
        onClose={
          closeStartMetadata
        }
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFill,
      zIndex: 10,
    },

    bottomGradient: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 190,
    },

    contentLayer: {
      ...StyleSheet.absoluteFill,
    },

    topMetadata: {
      position: "absolute",
      top: 70,
      left: 18,
      right: 96,
      zIndex: 24,
    },
  });