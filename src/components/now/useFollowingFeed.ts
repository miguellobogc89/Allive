// src/components/now/useFollowingFeed.ts

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getFollowingFeed,
} from "../../api/followingApi";

import type {
  ReplayItem,
} from "../../api/replayApi";

import type {
  ActiveLive,
} from "../live/types";

import type {
  NowGridItem,
  NowSection,
} from "./now.types";

type UseFollowingFeedOptions = {
  activeSection: NowSection;
  token?: string | null;
};

export function useFollowingFeed({
  activeSection,
  token,
}: UseFollowingFeedOptions) {
  const [
    followingLives,
    setFollowingLives,
  ] = useState<
    ActiveLive[]
  >([]);

  const [
    followingReplays,
    setFollowingReplays,
  ] = useState<
    ReplayItem[]
  >([]);

  const [
    followingLoading,
    setFollowingLoading,
  ] = useState(true);

  const [
    followingError,
    setFollowingError,
  ] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!token) {
      setFollowingLives(
        [],
      );

      setFollowingReplays(
        [],
      );

      setFollowingError(
        "Inicia sesión para ver a las personas que sigues.",
      );

      setFollowingLoading(
        false,
      );

      return;
    }

    const authToken =
      token;

    const controller =
      new AbortController();

    let firstLoad = true;

    async function loadFollowing() {
      try {
        setFollowingError(
          null,
        );

        const result =
          await getFollowingFeed(
            authToken,
            controller.signal,
          );

        if (
          controller.signal
            .aborted
        ) {
          return;
        }

        setFollowingLives(
          result.lives,
        );

        setFollowingReplays(
          result.replays,
        );
      } catch (loadError) {
        if (
          controller.signal
            .aborted
        ) {
          return;
        }

        console.error(
          "Error cargando Siguiendo:",
          loadError,
        );

        setFollowingError(
          "No se pudo cargar Siguiendo.",
        );
      } finally {
        if (
          !controller.signal
            .aborted &&
          firstLoad
        ) {
          firstLoad = false;

          setFollowingLoading(
            false,
          );
        }
      }
    }

    setFollowingLoading(
      true,
    );

    void loadFollowing();

    const interval =
      setInterval(
        loadFollowing,
        5000,
      );

    return () => {
      controller.abort();

      clearInterval(
        interval,
      );
    };
  }, [
    token,
  ]);

  const followingItems =
    useMemo<
      NowGridItem[]
    >(
      () => [
        ...followingLives.map(
          (live) => ({
            type:
              "live" as const,

            live,
          }),
        ),

        ...followingReplays.map(
          (replay) => ({
            type:
              "replay" as const,

            replay,
          }),
        ),
      ],
      [
        followingLives,
        followingReplays,
      ],
    );

  return {
    followingLives,
    followingReplays,
    followingItems,
    followingLoading,
    followingError,
  };
}