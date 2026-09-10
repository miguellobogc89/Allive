// src/components/live/replay/overlay/ReplayOverlay.tsx

import {
  LinearGradient,
} from "expo-linear-gradient";

import {
  StyleSheet,
  View,
} from "react-native";

import {
  LiveViewerBottomBar,
} from "../../viewer/bottom-bar/LiveViewerBottomBar";

import {
  LiveViewerNavigation,
} from "../../viewer/navigation/LiveViewerNavigation";

import {
  ReplayHeader,
} from "../header/ReplayHeader";

import type {
  Replay,
} from "../types";

type ReplayOverlayProps = {
  replay: Replay;

  currentIndex: number;
  totalReplays: number;

  commentValue: string;

  liked: boolean;

  likeDisabled?: boolean;
  commentDisabled?: boolean;

  followLoading?: boolean;
  isFollowing?: boolean;

  onPrevious: () => void;
  onNext: () => void;

  onCommentChange: (
    value: string,
  ) => void;

  onCommentSend: () => void;

  onLikePress: () => void;

  onFollowPress?: () => void;

  onOpenCreator?: () => void;

  onOpenLives?: () => void;
};

export function ReplayOverlay({
  replay,

  currentIndex,
  totalReplays,

  commentValue,

  liked,

  likeDisabled = false,
  commentDisabled = false,

  followLoading = false,
  isFollowing = false,

  onPrevious,
  onNext,

  onCommentChange,
  onCommentSend,

  onLikePress,

  onFollowPress,

  onOpenCreator,

  onOpenLives,
}: ReplayOverlayProps) {
  return (
    <View
      style={styles.overlay}
      pointerEvents="box-none"
    >
      <LinearGradient
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
        pointerEvents="none"
      />

      <ReplayHeader
        replay={replay}
        followLoading={
          followLoading
        }
        isFollowing={
          isFollowing
        }
        onFollowPress={
          onFollowPress
        }
        onOpenCreator={
          onOpenCreator
        }
        onOpenLives={
          onOpenLives
        }
      />

      <LiveViewerNavigation
        currentIndex={
          currentIndex
        }
        total={
          totalReplays
        }
        onPrevious={
          onPrevious
        }
        onNext={
          onNext
        }
      />

      <LiveViewerBottomBar
        commentValue={
          commentValue
        }
        commentDisabled={
          commentDisabled
        }
        liked={liked}
        likeDisabled={
          likeDisabled
        }
        onCommentChange={
          onCommentChange
        }
        onCommentSend={
          onCommentSend
        }
        onLikePress={
          onLikePress
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
  });