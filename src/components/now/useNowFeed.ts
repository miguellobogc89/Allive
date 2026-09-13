// src/components/now/useNowFeed.ts

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getActiveLives,
} from "../../api/liveApi";

import {
  getReplays,
  type ReplayItem,
} from "../../api/replayApi";

import type {
  ActiveLive,
} from "../live/types";

import type {
  NowGridItem,
} from "./now.types";

type UseNowFeedOptions = {
  requestedLiveId?: string | null;
  requestedReplayId?: string | null;
};

export function useNowFeed({
  requestedLiveId = null,
  requestedReplayId = null,
}: UseNowFeedOptions) {
  const [
    lives,
    setLives,
  ] = useState<
    ActiveLive[]
  >([]);

  const [
    replays,
    setReplays,
  ] = useState<
    ReplayItem[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (
      requestedLiveId ||
      requestedReplayId
    ) {
      setLoading(
        false,
      );

      return;
    }

    const controller =
      new AbortController();

    async function loadContent() {
      try {
        setError(
          null,
        );

        const nextLives =
          await getActiveLives(
            controller.signal,
          );

        console.log(
          "[ANDROID NOW LIVES]",
          nextLives.map((live) => ({
            id: live.id,
            thumbnailUrl:
              live.thumbnailUrl,
          })),
        );

        const nextReplays =
          await getReplays(
            controller.signal,
          );

        if (
          controller.signal
            .aborted
        ) {
          return;
        }

        setLives(
          nextLives,
        );

        setReplays(
          nextReplays,
        );
      } catch (loadError) {
        if (
          controller.signal
            .aborted
        ) {
          return;
        }

        console.error(
          "Allive NOW error:",
          loadError,
        );

        setError(
          "No se pudo cargar el contenido.",
        );
      } finally {
        if (
          !controller.signal
            .aborted
        ) {
          setLoading(
            false,
          );
        }
      }
    }

    void loadContent();

    const interval =
      setInterval(
        loadContent,
        5000,
      );

    return () => {
      controller.abort();

      clearInterval(
        interval,
      );
    };
  }, [
    requestedLiveId,
    requestedReplayId,
  ]);

  const gridItems =
    useMemo<
      NowGridItem[]
    >(
      () => [
        ...lives.map(
          (live) => ({
            type:
              "live" as const,

            live,
          }),
        ),

        ...replays.map(
          (replay) => ({
            type:
              "replay" as const,

            replay,
          }),
        ),
      ],
      [
        lives,
        replays,
      ],
    );

  return {
    lives,
    replays,
    gridItems,
    loading,
    error,
  };
}
