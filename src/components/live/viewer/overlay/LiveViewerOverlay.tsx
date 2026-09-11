// src/components/live/viewer/overlay/LiveViewerOverlay.tsx

import {
  LinearGradient,
} from "expo-linear-gradient";

import type {
  Room,
} from "livekit-client";

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
  onPrevious,
  onNext,
  onOpenUser,
}: Props) {
  const creatorId =
    live.creator?.id;

  const [
    contentVisible,
    setContentVisible,
  ] = useState(true);

  const topOpacity =
    useRef(
      new Animated.Value(1),
    ).current;

  const topTranslateY =
    useRef(
      new Animated.Value(0),
    ).current;

  const bottomOpacity =
    useRef(
      new Animated.Value(1),
    ).current;

  const bottomTranslateY =
    useRef(
      new Animated.Value(0),
    ).current;

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
  likeCount,
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

  function hideContent() {
    if (!contentVisible) {
      return;
    }

    Animated.parallel([
      Animated.timing(
        topOpacity,
        {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        },
      ),

      Animated.timing(
        topTranslateY,
        {
          toValue: -14,
          duration: 180,
          useNativeDriver: true,
        },
      ),

      Animated.timing(
        bottomOpacity,
        {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        },
      ),

      Animated.timing(
        bottomTranslateY,
        {
          toValue: 14,
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

    topOpacity.setValue(0);
    topTranslateY.setValue(-14);

    bottomOpacity.setValue(0);
    bottomTranslateY.setValue(14);

    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.timing(
          topOpacity,
          {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          },
        ),

        Animated.timing(
          topTranslateY,
          {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          },
        ),

        Animated.timing(
          bottomOpacity,
          {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          },
        ),

        Animated.timing(
          bottomTranslateY,
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
    if (contentVisible) {
      hideContent();
      return;
    }

    showContent();
  }

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

      <Pressable
        style={
          StyleSheet.absoluteFill
        }
        onPress={
          handleBackgroundPress
        }
      />

      <View
        pointerEvents="box-none"
        style={styles.header}
      >
        <View
          pointerEvents="box-none"
          style={styles.permanentHeader}
        >
<LiveViewerHeader
  viewers={
    audience.total
  }
  likes={likeCount}
/>
        </View>
      </View>

      {contentVisible ? (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.identityLayer,
            {
              opacity:
                topOpacity,

              transform: [
                {
                  translateY:
                    topTranslateY,
                },
              ],
            },
          ]}
        >
          <LiveViewerIdentityLayer
            live={live}
            followLoading={
              followLoading
            }
            isFollowing={
              followingCreator
            }
            canFollow={
              canFollow
            }
            onFollow={() => {
              void toggleFollow();
            }}
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
        </Animated.View>
      ) : null}

      {contentVisible ? (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.bottomContent,
            {
              opacity:
                bottomOpacity,

              transform: [
                {
                  translateY:
                    bottomTranslateY,
                },
              ],
            },
          ]}
        >
          <LiveTimedCommentsLayer
            comments={comments}
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
        </Animated.View>
      ) : null}

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
    </View>
  );
}

type IdentityLayerProps = {
  live: ActiveLive;
  followLoading: boolean;
  isFollowing: boolean;
  canFollow: boolean;
  onFollow: () => void;
  onOpenCreator?: () => void;
};

function LiveViewerIdentityLayer({
  live,
  followLoading,
  isFollowing,
  canFollow,
  onFollow,
  onOpenCreator,
}: IdentityLayerProps) {
  return (
    <LiveViewerHeaderIdentity
      live={live}
      followLoading={
        followLoading
      }
      isFollowing={
        isFollowing
      }
      onFollowPress={
        canFollow
          ? onFollow
          : undefined
      }
      onOpenCreator={
        onOpenCreator
      }
    />
  );
}

import {
  LiveViewerIdentity as LiveViewerHeaderIdentity,
} from "../header/LiveViewerIdentity";

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

    header: {
      position: "absolute",

      top: 18,
      left: 0,
      right: 0,

      zIndex: 30,
    },

    permanentHeader: {
      width: "100%",
    },

    identityLayer: {
      position: "absolute",

      top: 78,
      left: 16,
      right: 16,

      zIndex: 29,
    },

    bottomContent: {
      ...StyleSheet.absoluteFill,

      zIndex: 20,
    },
  });