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

import type { LiveCommentModel } from "../../comments/liveCommentTypes";
import { LiveTimedCommentsLayer } from "../../comments/LiveTimedCommentsLayer";
import { LiveBroadcastBottomNav } from "../bottom-nav";
import { LiveBroadcastHeader } from "../header";
import { LiveBroadcastMetadata } from "../metadata/LiveBroadcastMetadata";
import { LiveStartMetadataModal } from "../metadata/LiveStartMetadataModal";
import { LiveBroadcastMoreMenu } from "../more-menu";
import { LiveBroadcastError } from "./LiveBroadcastError";
import { LiveNotice } from "../../shared";

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
  microphoneEnabled?: boolean;

  onChangeTitle?: (
    value: string,
  ) => void;

  onChangeEventName?: (
    value: string,
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

  microphoneEnabled = true,

  onChangeTitle,
  onChangeEventName,
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
  ] = useState(true);

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
    onSaveMetadata?.();

    setNoticeMessage(
      "Información del directo actualizada",
    );
  }

  setStartMetadataVisible(false);
}

function toggleAudience() {
  setAudienceMode(
    (current) => {
      const next =
        current === "public"
          ? "followers"
          : "public";

      setNoticeMessage(
        next === "followers"
          ? "Directo visible solo para seguidores"
          : "El directo ahora es público",
      );

      return next;
    },
  );
}

function toggleComments() {
  setCommentsEnabled(
    (current) => {
      const next = !current;

      setNoticeMessage(
        next
          ? "Los comentarios se han activado"
          : "Los comentarios se han ocultado",
      );

      return next;
    },
  );
}

  return (
    <View
      pointerEvents="box-none"
      style={styles.overlay}
    >
      {isLive ? (
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
      ) : null}

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
  onFinishLive={onFinishLive}
/>

{contentVisible ? (
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
    (eventName.trim() ||
      title.trim() ||
      (
        locationVisible &&
        locationName
      )) ? (
      <Pressable
        onPress={openStartMetadata}
        style={styles.topMetadata}
      >
        <LiveBroadcastMetadata
          eventName={eventName}
          title={title}
          location={
            locationVisible
              ? locationName
              : null
          }
        />
      </Pressable>
    ) : null}

    <LiveTimedCommentsLayer
      comments={comments}
      visible={
        isLive &&
        commentsEnabled
      }
    />
  </Animated.View>
) : null}

{isLive ? (
  <LiveBroadcastBottomNav
    isLive={isLive}
    isConnecting={isConnecting}
    cameraReady={cameraReady}
    microphoneEnabled={
      microphoneEnabled
    }
    onOpenMore={
      toggleMoreMenu
    }
    onToggleMicrophone={
      onToggleMicrophone ??
      (() => {})
    }
    onOpenFilters={
      onOpenFilters ??
      (() => {})
    }
    onSwitchCamera={
      onSwitchCamera ??
      (() => {})
    }
    onStartLive={onStartLive}
    onFinishLive={onFinishLive}
  />
) : null}

      {isLive ? (
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
      ) : null}

      <LiveStartMetadataModal
        visible={
          startMetadataVisible
        }
        title={title}
        eventName={eventName}
        locationName={
          locationName ?? ""
        }
        locationVisible={
          locationVisible
        }
        onChangeTitle={
          onChangeTitle ??
          (() => {})
        }
        onChangeEventName={
          onChangeEventName ??
          (() => {})
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