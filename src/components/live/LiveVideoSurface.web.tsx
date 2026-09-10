// src/components/live/LiveVideoSurface.web.tsx

import type {
  Room,
} from "livekit-client";

import {
  Image,
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

import type {
  LiveAudience,
} from "./liveAudience";

import type {
  ActiveLive,
} from "./types";

import {
  useLiveViewerMedia,
} from "./useLiveViewerMedia.web";

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

  onRoomChange?: (
    room: Room | null,
  ) => void;
};

export function LiveVideoSurface({
  live,
  viewerIdentity,
  viewerUser,
  authToken,
  onAudienceChange,
  onRoomChange,
}: Props) {
  const {
    audioRef,
    error,
    hasVideo,
    status,
    videoRef,
  } =
    useLiveViewerMedia({
      live,
      viewerIdentity,
      viewerUser,
      authToken,
      onAudienceChange,
      onRoomChange,
    });

  const thumbnailUrl =
    live?.thumbnailUrl ?? null;

  return (
    <View style={styles.container}>
      {thumbnailUrl &&
      !hasVideo ? (
        <Image
          source={{
            uri: thumbnailUrl,
          }}
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
        />
      ) : null}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          ...videoStyle,
          opacity: hasVideo ? 1 : 0,
        }}
      />

      <audio
        ref={audioRef}
        autoPlay
      />

      {!hasVideo ? (
        <View style={styles.waiting}>
          <Text style={styles.status}>
            {status}
          </Text>
        </View>
      ) : null}

      {error ? (
        <View style={styles.errorBox}>
          <Text
            style={styles.errorText}
          >
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const videoStyle = {
  position:
    "absolute" as const,

  inset: 0,

  width: "100%",
  height: "100%",

  objectFit:
    "cover" as const,

  backgroundColor:
    colors.background,
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

      backgroundColor:
        "rgba(0,0,0,0.28)",
    },

    status: {
      color:
        colors.textMuted,

      ...typography.label,
    },

    errorBox: {
      position: "absolute",

      left:
        layout
          .liveErrorHorizontal,

      right:
        layout
          .liveErrorHorizontal,

      bottom:
        layout
          .liveErrorBottom,

      padding:
        spacing.sm,

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
