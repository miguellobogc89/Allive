// src/components/live/viewer/overlay/LiveViewerOverlay.tsx

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
  viewerIdentity: ViewerIdentity | null;
  authToken: string | null;
  currentIndex: number;
  totalLives: number;
  onPreviousLive: () => void;
  onNextLive: () => void;
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
  onPreviousLive,
  onNextLive,
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
      />

      <LiveTimedCommentsLayer
        comments={comments}
        visible
        onPressActor={
          onOpenUser
        }
      />

      <LiveViewerNavigation
        currentIndex={
          currentIndex
        }
        total={totalLives}
        onPrevious={
          onPreviousLive
        }
        onNext={
          onNextLive
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

const styles =
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFill,
      zIndex: 10,
    },
  });