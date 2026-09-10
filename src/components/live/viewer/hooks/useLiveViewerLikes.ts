// src/components/live/viewer/hooks/useLiveViewerLikes.ts

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  ViewerIdentity,
} from "../../../../auth/types";

import {
  subscribeToLiveMetrics,
} from "../../../../api/liveRealtimeApi";

import {
  getLiveLikeState,
  toggleLiveLike,
} from "../../liveLikesApi";

type Props = {
  liveId: string;
  viewerIdentity: ViewerIdentity | null;
  authToken: string | null;
};

export function useLiveViewerLikes({
  liveId,
  viewerIdentity,
  authToken,
}: Props) {
  const [liked, setLiked] =
    useState(false);

  const [likeCount, setLikeCount] =
    useState(0);

  const [likeLoading, setLikeLoading] =
    useState(false);

  const loadLikeState =
    useCallback(async () => {
      try {
        const state =
          await getLiveLikeState(
            liveId,
            viewerIdentity,
            authToken,
          );

        setLiked(state.liked);
        setLikeCount(state.count);
      } catch (error) {
        console.error(
          "Allive like state error:",
          error,
        );
      }
    }, [
      liveId,
      viewerIdentity,
      authToken,
    ]);

  useEffect(() => {
    setLiked(false);
    setLikeCount(0);

    void loadLikeState();
  }, [
    liveId,
    loadLikeState,
  ]);

  useEffect(() => {
    return subscribeToLiveMetrics(
      (update) => {
        if (
          update.liveId !== liveId ||
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
  }, [liveId]);

  async function toggleLike() {
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
          liveId,
          viewerIdentity,
          authToken,
        );

      setLiked(state.liked);
      setLikeCount(state.count);
    } catch (error) {
      console.error(
        "Allive toggle like error:",
        error,
      );
    } finally {
      setLikeLoading(false);
    }
  }

  return {
    liked,
    likeCount,
    likeLoading,
    toggleLike,
  };
}