// src/components/live/LiveVideoSurface.native.tsx

import {
  VideoTrack,
} from "@livekit/react-native";

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
} from "./useLiveViewerMedia.native";

type Props = {
  live:
    ActiveLive | null;

  viewerIdentity:
    ViewerIdentity | null;

  viewerUser:
    AuthUser | null;

  authToken:
    string | null;

  onAudienceChange?: (
    audience:
      LiveAudience,
  ) => void;

  onRoomChange?: (
    room:
      Room | null,
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
    error,
    hasVideo,
    status,
    videoTrackRef,
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
    live?.thumbnailUrl ??
    null;

  return (
    <View
      style={
        styles.container
      }
    >
      {thumbnailUrl &&
      !hasVideo ? (
        <Image
          source={{
            uri:
              thumbnailUrl,
          }}
          resizeMode="cover"
          style={
            StyleSheet.absoluteFill
          }
        />
      ) : null}

      {videoTrackRef ? (
        <VideoTrack
          trackRef={
            videoTrackRef
          }
          style={
            styles.video
          }
          objectFit="cover"
        />
      ) : null}

      {!hasVideo ? (
        <View
          style={
            styles.waiting
          }
        >
          <Text
            style={
              styles.status
            }
          >
            {status}
          </Text>
        </View>
      ) : null}

      {error ? (
        <View
          style={
            styles.errorBox
          }
        >
          <Text
            style={
              styles.errorText
            }
          >
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFill,

      backgroundColor:
        colors.background,
    },

    video: {
      ...StyleSheet.absoluteFill,

      width: "100%",
      height: "100%",
    },

    waiting: {
      ...StyleSheet.absoluteFill,

      alignItems:
        "center",

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
      position:
        "absolute",

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

      fontWeight:
        "400",
    },
  });