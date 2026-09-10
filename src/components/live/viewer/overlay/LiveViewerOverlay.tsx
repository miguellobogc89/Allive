// src/components/live/viewer/overlay/LiveViewerOverlay.tsx

import {
  LinearGradient,
} from "expo-linear-gradient";

import type {
  Room,
} from "livekit-client";

import {
  StyleSheet,
  View,
} from "react-native";

import type {
  ViewerIdentity,
} from "../../../../auth/types";

import {
  LiveTimedCommentsLayer,
} from "../../comments";

import type {
  LiveAudience,
} from "../../liveAudience";

import type {
  ActiveLive,
} from "../../types";

import {
  LiveViewerBottomBar,
} from "../bottom-bar/LiveViewerBottomBar";

import {
  LiveViewerHeader,
} from "../header/LiveViewerHeader";

import {
  useLiveViewerComments,
} from "../hooks/useLiveViewerComments";

import {
  useLiveViewerFollow,
} from "../hooks/useLiveViewerFollow";

import {
  useLiveViewerLikes,
} from "../hooks/useLiveViewerLikes";

import {
  LiveViewerNavigation,
} from "../navigation/LiveViewerNavigation";

type Props = {
  live: ActiveLive;

  room: Room | null;

  audience: LiveAudience;

  viewerIdentity:
    | ViewerIdentity
    | null;

  authToken: string | null;

  currentIndex: number;
  totalLives: number;

  onOpenReplays?: () => void;

  onPrevious: () => void;
  onNext: () => void;

  onOpenUser?: (
    userId: string,
  ) => void;
};

export function LiveViewerOverlay({
  live,
  room,
  audience,
  viewerIdentity,
  authToken,
  currentIndex,
  totalLives,
  onOpenReplays,
  onPrevious,
  onNext,
  onOpenUser,
}: Props) {
  const creatorId =
    live.creator?.id;

  const {
    comments,
    commentValue,
    commentSending,
    setCommentValue,
    sendComment,
  } = useLiveViewerComments({
    liveId: live.id,
    room,
    viewerIdentity,
    authToken,
  });

  const {
    liked,
    likeLoading,
    toggleLike,
  } = useLiveViewerLikes({
    liveId: live.id,
    viewerIdentity,
    authToken,
  });

  const {
    followingCreator,
    followLoading,
    canFollow,
    toggleFollow,
  } = useLiveViewerFollow({
    creatorId,
    viewerIdentity,
    authToken,
  });

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

      <LiveViewerHeader
        live={live}
        audience={audience}
        followLoading={
          followLoading
        }
        isFollowing={
          followingCreator
        }
        onFollowPress={
          canFollow
            ? () => {
                void toggleFollow();
              }
            : undefined
        }
        onOpenCreator={
          creatorId
            ? () => {
                onOpenUser?.(
                  creatorId,
                );
              }
            : undefined
        }
        onOpenReplays={onOpenReplays}
      />

      <LiveTimedCommentsLayer
        comments={comments}
      />

      <LiveViewerNavigation
        currentIndex={
          currentIndex
        }
        total={totalLives}
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
          !viewerIdentity ||
          commentSending
        }
        liked={liked}
        likeDisabled={
          !viewerIdentity ||
          likeLoading
        }
        onCommentChange={
          setCommentValue
        }
        onCommentSend={() => {
          void sendComment();
        }}
        onLikePress={() => {
          void toggleLike();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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