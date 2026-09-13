import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getReplays,
  type ReplayItem,
} from "../../../../../api/replayApi";

export type ReplayViewerNavigation = {
  previous: () => void;
  next: () => void;
};

type UseReplayFeedOptions = {
  requestedReplayId?: string | null;
};

export function useReplayFeed({
  requestedReplayId = null,
}: UseReplayFeedOptions) {
  const [
    replays,
    setReplays,
  ] = useState<
    ReplayItem[]
  >([]);

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const activeReplay =
    replays[
      currentIndex
    ] ?? null;

  const goToPreviousReplay =
    useCallback(() => {
      setCurrentIndex(
        (index) =>
          replays.length <= 1
            ? index
            : index <= 0
              ? replays.length - 1
              : index - 1,
      );
    }, [
      replays.length,
    ]);

  const goToNextReplay =
    useCallback(() => {
      setCurrentIndex(
        (index) =>
          replays.length <= 1
            ? index
            : index >=
                replays.length - 1
              ? 0
              : index + 1,
      );
    }, [
      replays.length,
    ]);

  useEffect(() => {
    const controller =
      new AbortController();

    async function load() {
      try {
        setLoading(true);

        const result =
          await getReplays(
            controller.signal,
          );

        setReplays(
          result,
        );

        const requestedIndex =
          requestedReplayId
            ? result.findIndex(
                (replay) =>
                  replay.id ===
                  requestedReplayId,
              )
            : -1;

        setCurrentIndex(
          requestedIndex >= 0
            ? requestedIndex
            : 0,
        );
      } catch (error) {
        if (
          !controller.signal
            .aborted
        ) {
          console.error(
            "Allive replays error:",
            error,
          );
        }
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

    void load();

    return () => {
      controller.abort();
    };
  }, [
    requestedReplayId,
  ]);

  return {
    activeReplay,
    currentIndex,
    goToNextReplay,
    goToPreviousReplay,
    loading,
    replays,
  };
}
