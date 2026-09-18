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
  AppOverlaySlot,
} from "../../../layout";

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
  LiveViewerIdentity,
} from "../header/LiveViewerIdentity";

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

  onClose?: () => void;

  onPrevious: () => void;
  onNext: () => void;

  onOpenUser?: (
    userId: string,
  ) => void;

  showNavigation?: boolean;
};

export function LiveViewerOverlay({
  live,
  room,
  audience,
  viewerIdentity,
  authToken,
  currentIndex,
  totalLives,
  onClose,
  onPrevious,
  onNext,
  onOpenUser,
  showNavigation = true,
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
      style={
        styles.overlay
      }
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

      {/* HEADER */}
      <AppOverlaySlot
        name="header"
      >
        <View
          style={
            styles.slotFill
          }
          pointerEvents="box-none"
        >
          <LiveViewerHeader
            viewers={
              audience.total
            }
            onClose={
              onClose
            }
          />
        </View>
      </AppOverlaySlot>

      {/* COMMENTS */}
      <AppOverlaySlot
        name="comments"
      >
        <View
          style={
            styles.commentsSlot
          }
          pointerEvents="box-none"
        >
          <LiveTimedCommentsLayer
            comments={
              comments
            }
          />
        </View>
      </AppOverlaySlot>

      {/* METADATA */}
      <AppOverlaySlot
        name="metadata"
      >
        <View
          style={
            styles.metadataSlot
          }
          pointerEvents="box-none"
        >
          <LiveViewerIdentity
            live={
              live
            }
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
        </View>
      </AppOverlaySlot>

      {/* BOTTOM CONTROLS */}
      <AppOverlaySlot
        name="bottomControls"
      >
        <LiveViewerBottomBar
          commentValue={
            commentValue
          }
          commentDisabled={
            !viewerIdentity ||
            commentSending
          }
          liked={
            liked
          }
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
      </AppOverlaySlot>

      {showNavigation ? (
        <LiveViewerNavigation
          currentIndex={
            currentIndex
          }
          total={
            totalLives
          }
          onPrevious={
            onPrevious
          }
          onNext={
            onNext
          }
        />
      ) : null}
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

    slotFill: {
      width: "100%",
      height: "100%",

      justifyContent:
        "center",
    },

    commentsSlot: {
      width: "100%",
      height: "100%",

      overflow: "hidden",

      justifyContent:
        "flex-end",
    },

    metadataSlot: {
      width: "100%",
      height: "100%",

      overflow: "hidden",

      justifyContent:
        "flex-end",
    },
  });