// src/components/live/LiveViewerOverlay.tsx

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
  layout,
} from "../../styles";

import {
  LiveViewerActions,
} from "./LiveViewerActions";

import {
  LiveViewerCommentInput,
} from "./LiveViewerCommentInput";

import {
  LiveViewerComments,
} from "./LiveViewerComments";

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

import type {
  ActiveLive,
  LiveComment,
} from "./types";

type Props = {
  live: ActiveLive;
  audience: LiveAudience;
  viewerIdentity: ViewerIdentity | null;
  authToken: string | null;
  currentIndex: number;
  totalLives: number;
  onPreviousLive: () => void;
  onNextLive: () => void;
};

const INITIAL_COMMENTS:
  LiveComment[] = [
  {
    id: "mock-1",
    username: "lucia",
    text:
      "¿Qué está pasando ahora?",
    likes: 3,
  },
  {
    id: "mock-2",
    username: "dani",
    text:
      "Se ve perfecto 👀",
    likes: 1,
  },
];

export function LiveViewerOverlay({
  live,
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

  const [comments, setComments] =
    useState<LiveComment[]>(
      INITIAL_COMMENTS,
    );

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
    setCommentValue("");
    setComments(
      INITIAL_COMMENTS,
    );

    setLiked(false);
    setLikeCount(0);

    void loadLikeState();
  }, [
    live.id,
    loadLikeState,
  ]);

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

  function sendComment() {
    const text =
      commentValue.trim();

    if (!text) {
      return;
    }

    setComments(
      (current) => [
        ...current,
        {
          id:
            `local-${Date.now()}`,
          username: "tú",
          text,
          likes: 0,
        },
      ],
    );

    setCommentValue("");
  }

  function toggleCommentLike(
    commentId: string,
  ) {
    setComments(
      (current) =>
        current.map(
          (comment) => {
            if (
              comment.id !==
              commentId
            ) {
              return comment;
            }

            const nextLiked =
              !comment.liked;

            return {
              ...comment,
              liked: nextLiked,
              likes: Math.max(
                0,
                comment.likes +
                  (nextLiked
                    ? 1
                    : -1),
              ),
            };
          },
        ),
    );
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

        <LiveViewerComments
          comments={comments}
          onLikeComment={
            toggleCommentLike
          }
        />

        <LiveViewerCommentInput
          value={commentValue}
          onChangeText={
            setCommentValue
          }
          onSend={
            sendComment
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
