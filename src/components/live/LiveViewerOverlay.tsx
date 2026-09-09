// src/components/live/LiveViewerOverlay.tsx

import {
  Ionicons,
} from "@expo/vector-icons";

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
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import type {
  ViewerIdentity,
} from "../../auth/types";

import {
  subscribeToLiveMetrics,
} from "../../api/liveRealtimeApi";

import {
  colors,
  iconSizes,
  layout,
  radius,
} from "../../styles";

import {
  LiveCommentComposer,
  LiveCommentList,
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
  LiveViewerMetadata,
} from "./LiveViewerMetadata";

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
    commentComposerOpen,
    setCommentComposerOpen,
  ] = useState(false);

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
    setCommentComposerOpen(false);
    setCommentValue("");
    setComments([]);
    setLiked(false);
    setLikeCount(0);

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
      setCommentComposerOpen(
        false,
      );

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

  const creatorName =
    live.creator?.username ??
    live.creator?.displayName ??
    null;

  return (
    <View
      style={styles.overlay}
      pointerEvents="box-none"
    >
      <LiveViewerHeader
        audience={audience}
        audienceOpen={
          audienceOpen
        }
        onAudienceToggle={() =>
          setAudienceOpen(
            (value) => !value,
          )
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
        <LiveViewerMetadata
          title={live.title}
          eventName={
            live.eventName
          }
          placeName={
            live.placeName
          }
          creatorName={
            creatorName
          }
        />

        <LiveCommentList
          comments={comments}
        />

        {commentComposerOpen ? (
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
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Comentar"
            disabled={!viewerIdentity}
            onPress={() =>
              setCommentComposerOpen(
                true,
              )
            }
            style={({ pressed }) => [
              styles.commentButton,
              pressed &&
                styles.commentButtonPressed,
              !viewerIdentity &&
                styles.commentButtonDisabled,
            ]}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={iconSizes.md}
              color={colors.text}
            />
          </Pressable>
        )}
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

    commentButton: {
      width: 48,
      height: 48,
      borderRadius:
        radius.round,
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        colors.overlayStrong,
      borderWidth:
        StyleSheet.hairlineWidth,
      borderColor:
        colors.borderOnOverlaySubtle,
    },

    commentButtonPressed: {
      opacity: 0.72,
    },

    commentButtonDisabled: {
      opacity: 0.42,
    },
  });
