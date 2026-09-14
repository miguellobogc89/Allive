import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getActiveLives,
} from "../../api/liveApi";

import {
  getReplays,
} from "../../api/replayApi";

import type {
  ReplayItem,
} from "../../api/replayApi";

import type {
  ActiveLive,
} from "../../components/live/types";

import type {
  MapContentItem,
} from "../types/mapTypes";

import {
  groupMapContent,
  normalizeLiveForMap,
  normalizeReplayForMap,
} from "../utils/mapContent";

export function useMapContent() {
  const requestInFlightRef =
    useRef(false);

  const abortControllerRef =
    useRef<AbortController | null>(
      null,
    );

  const [
    lives,
    setLives,
  ] = useState<ActiveLive[]>([]);

  const [
    replays,
    setReplays,
  ] = useState<ReplayItem[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const refresh =
    useCallback(async () => {
      if (
        requestInFlightRef.current
      ) {
        return;
      }

      const controller =
        new AbortController();

      requestInFlightRef.current =
        true;
      abortControllerRef.current =
        controller;

      try {
        setError(null);
        setIsLoading(true);

        const [
          livesResult,
          replaysResult,
        ] =
          await Promise.allSettled([
            getActiveLives(
              controller.signal,
            ),
            getReplays(
              controller.signal,
            ),
          ]);

        if (
          controller.signal.aborted
        ) {
          return;
        }

        let nextError:
          | string
          | null = null;

        if (
          livesResult.status ===
          "fulfilled"
        ) {
          setLives(
            livesResult.value,
          );
        } else {
          console.error(
            "Error cargando LIVE del mapa:",
            livesResult.reason,
          );

          nextError =
            "No se pudo actualizar todo el mapa";
        }

        if (
          replaysResult.status ===
          "fulfilled"
        ) {
          setReplays(
            replaysResult.value,
          );
        } else {
          console.error(
            "Error cargando Replays del mapa:",
            replaysResult.reason,
          );

          nextError =
            "No se pudo actualizar todo el mapa";
        }

        setError(nextError);
      } catch (loadError) {
        if (
          !controller.signal
            .aborted
        ) {
          console.error(
            "Error cargando contenido del mapa:",
            loadError,
          );

          setError(
            "No se pudo cargar el mapa",
          );
        }
      } finally {
        if (
          !controller.signal
            .aborted
        ) {
          setIsLoading(false);
        }

        if (
          abortControllerRef.current ===
          controller
        ) {
          abortControllerRef.current =
            null;
        }

        requestInFlightRef.current =
          false;
      }
    }, []);

  useEffect(() => {
    void refresh();

    const intervalId =
      setInterval(() => {
        void refresh();
      }, 5000);

    return () => {
      clearInterval(intervalId);

      abortControllerRef.current?.abort();
      abortControllerRef.current =
        null;
      requestInFlightRef.current =
        false;
    };
  }, [
    refresh,
  ]);

  const items =
    useMemo<MapContentItem[]>(
      () => [
        ...lives
          .map(normalizeLiveForMap)
          .filter(
            (
              item,
            ): item is MapContentItem =>
              item !== null,
          ),
        ...replays
          .map(normalizeReplayForMap)
          .filter(
            (
              item,
            ): item is MapContentItem =>
              item !== null,
          ),
      ],
      [
        lives,
        replays,
      ],
    );

  const groups =
    useMemo(
      () =>
        groupMapContent(items),
      [
        items,
      ],
    );

  return {
    liveCount: lives.length,
    replayCount:
      replays.length,
    itemCount: items.length,
    groups,
    isLoading,
    error,
    refresh,
  };
}
