// src/components/live/LiveViewerOverlay.tsx

import {
  RoomEvent,
  type Room,
} from "livekit-client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  StyleSheet,
  View,
} from "react-native";

import type {
  ViewerIdentity,
} from "../../auth/types";

import {
  followUser,
  getUserProfile,
  unfollowUser,
} from "../../api/userProfileApi";

import {
  subscribeToLiveMetrics,
} from "../../api/liveRealtimeApi";

import {
  layout,
} from "../../styles";

import {
  LiveCommentComposer,
  LiveTimedCommentsLayer,
  createLiveComment,
  getLiveComments,
  type LiveCommentModel,
} from "./comments";

import {
  LiveViewerActions,
} from "./LiveViewerActions";

import {
  LiveViewerHeader,
} from "./LiveViewerHeader";

import {
  LiveViewerNavigation,
} from "./LiveViewerNavigation";

import type {
  LiveAudience,
} from "./liveAudience";

import {
  getLiveLikeState,
  toggleLiveLike,
} from "./liveLikesApi";

import {
  parseLiveRealtimeMessage,
  publishLiveRealtimeMessage,
} from "./liveRealtime";

import type {
  ActiveLive,
} from "./types";

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
  onOpenUser?: (userId: string) => void;
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
  const [saved, setSaved] =
    useState(false);

  const [
    audienceOpen,
    setAudienceOpen,
  ] = useState(false);

  const [
    commentValue,
    setCommentValue,
  ] = useState("");

  const [
    comments,
    setComments,
  ] =
    useState<LiveCommentModel[]>(
      [],
    );

  const [
    commentSending,
    setCommentSending,
  ] = useState(false);

  const [liked, setLiked] =
    useState(false);

  const [
    likeCount,
    setLikeCount,
  ] = useState(0);

  const [
    likeLoading,
    setLikeLoading,
  ] = useState(false);

  const [
    followingCreator,
    setFollowingCreator,
  ] = useState(false);

  const [
    followLoading,
    setFollowLoading,
  ] = useState(false);

  const creatorId =
    live.creator?.id;

  const loadLikeState =
    useCallback(async () => {
      try {
        const state =
          await getLiveLikeState(
            live.id,
            viewerIdentity,
            authToken,
          );

        setLiked(state.liked);
        setLikeCount(
          state.count,
        );
      } catch (error) {
        console.error(
          "Allive like state error:",
          error,
        );
      }
    }, [
      live.id,
      viewerIdentity,
      authToken,
    ]);

  useEffect(() => {
    setSaved(false);
    setAudienceOpen(false);
    setCommentValue("");
    setComments([]);
    setLiked(false);
    setLikeCount(0);
    setFollowingCreator(false);
    setFollowLoading(false);

    void loadLikeState();

    let cancelled = false;

    void getLiveComments(
      live.id,
    )
      .then((items) => {
        if (!cancelled) {
          setComments(items);
        }
      })
      .catch((error) => {
        console.error(
          "Allive comments load error:",
          error,
        );
      });

    return () => {
      cancelled = true;
    };
  }, [
    live.id,
    loadLikeState,
  ]);

  useEffect(() => {
    if (
      !creatorId ||
      !authToken ||
      viewerIdentity?.type !== "user" ||
      viewerIdentity.id === creatorId
    ) {
      setFollowingCreator(false);
      setFollowLoading(false);
      return;
    }

    let cancelled = false;

    setFollowLoading(true);

    void getUserProfile(
      creatorId,
      authToken,
    )
      .then((profile) => {
        if (!cancelled) {
          setFollowingCreator(
            profile.isFollowing,
          );
        }
      })
      .catch((error) => {
        console.error(
          "No se pudo cargar el estado de follow:",
          error,
        );
      })
      .finally(() => {
        if (!cancelled) {
          setFollowLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    authToken,
    creatorId,
    viewerIdentity,
  ]);

  useEffect(() => {
    if (!room) {
      return;
    }

    const onData = (
      payload: Uint8Array,
    ) => {
      const message =
        parseLiveRealtimeMessage(
          payload,
        );

      if (
        !message ||
        message.comment
          .liveSessionId !==
          live.id
      ) {
        return;
      }

      setComments(
        (current) =>
          current.some(
            (item) =>
              item.id ===
              message.comment.id,
          )
            ? current
            : [
                ...current,
                message.comment,
              ],
      );
    };

    room.on(
      RoomEvent.DataReceived,
      onData,
    );

    return () => {
      room.off(
        RoomEvent.DataReceived,
        onData,
      );
    };
  }, [room, live.id]);

  useEffect(() => {
    return subscribeToLiveMetrics(
      (update) => {
        if (
          update.liveId !==
            live.id ||
          typeof update.likeCount !==
            "number"
        ) {
          return;
        }

        setLikeCount(
          update.likeCount,
        );
      },
    );
  }, [live.id]);

  async function handleLikePress() {
    if (
      !viewerIdentity ||
      likeLoading
    ) {
      return;
    }

    setLikeLoading(true);

    try {
      const state =
        await toggleLiveLike(
          live.id,
          viewerIdentity,
          authToken,
        );

      setLiked(state.liked);
      setLikeCount(
        state.count,
      );
    } catch (error) {
      console.error(
        "Allive toggle like error:",
        error,
      );
    } finally {
      setLikeLoading(false);
    }
  }

  async function sendComment() {
    const body =
      commentValue.trim();

    if (
      !body ||
      !viewerIdentity ||
      commentSending
    ) {
      return;
    }

    setCommentSending(true);

    try {
      const comment =
        await createLiveComment(
          live.id,
          body,
          viewerIdentity,
          authToken,
        );

      setComments(
        (current) =>
          current.some(
            (item) =>
              item.id ===
              comment.id,
          )
            ? current
            : [
                ...current,
                comment,
              ],
      );

      setCommentValue("");

      if (room) {
        await publishLiveRealtimeMessage(
          room,
          {
            type:
              "live-comment",
            comment,
          },
        );
      }
    } catch (error) {
      console.error(
        "Allive comment send error:",
        error,
      );
    } finally {
      setCommentSending(false);
    }
  }

  async function handleFollowPress() {
    if (
      !creatorId ||
      !authToken ||
      viewerIdentity?.type !== "user" ||
      viewerIdentity.id === creatorId ||
      followLoading
    ) {
      return;
    }

    const previous =
      followingCreator;

    setFollowLoading(true);
    setFollowingCreator(!previous);

    try {
      const result = previous
        ? await unfollowUser(
            creatorId,
            authToken,
          )
        : await followUser(
            creatorId,
            authToken,
          );

      setFollowingCreator(
        result.isFollowing,
      );
    } catch (error) {
      console.error(
        "No se pudo actualizar follow:",
        error,
      );
      setFollowingCreator(previous);
    } finally {
      setFollowLoading(false);
    }
  }

  return (
    <View
      style={styles.overlay}
      pointerEvents="box-none"
    >
      <LiveViewerHeader
        live={live}
        audience={audience}
        audienceOpen={
          audienceOpen
        }
        followLoading={followLoading}
        isFollowing={followingCreator}
        onFollowPress={
          live.creator?.id &&
          authToken &&
          viewerIdentity?.type ===
            "user" &&
          viewerIdentity.id !==
            live.creator.id
            ? () => {
                void handleFollowPress();
              }
            : undefined
        }
        onOpenCreator={
          creatorId
            ? () => {
                onOpenUser?.(creatorId);
              }
            : undefined
        }
        onAudienceToggle={() =>
          setAudienceOpen(
            (value) => !value,
          )
        }
      />

      <LiveTimedCommentsLayer
        comments={comments}
        visible
        onPressActor={onOpenUser}
      />

      <LiveViewerNavigation
        currentIndex={
          currentIndex
        }
        total={totalLives}
        onPrevious={
          onPreviousLive
        }
        onNext={onNextLive}
      />

      <LiveViewerActions
        liked={liked}
        likeCount={likeCount}
        likeDisabled={
          !viewerIdentity ||
          likeLoading
        }
        saved={saved}
        onLikePress={() =>
          void handleLikePress()
        }
        onSavePress={() =>
          setSaved(
            (value) => !value,
          )
        }
      />

      <View
        style={styles.bottomLeft}
        pointerEvents="box-none"
      >
        <LiveCommentComposer
          value={commentValue}
          disabled={
            !viewerIdentity ||
            commentSending
          }
          onChangeText={
            setCommentValue
          }
          onSend={() =>
            void sendComment()
          }
        />
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFill,
      zIndex: 10,
    },

    bottomLeft: {
      position: "absolute",
      left:
        layout.screenHorizontalPadding,
      right:
        layout.liveContentRight,
      bottom:
        layout.liveContentBottom,
      gap: 11,
    },
  });
