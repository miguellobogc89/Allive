// src/components/live/viewer/hooks/useLiveViewerFeed.ts

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  ActiveLive,
} from "../../types";

const EMPTY_INITIAL_LIVES:
  ActiveLive[] = [];

export type LiveViewerNavigation = {
  previous: () => void;
  next: () => void;
};

type UseLiveViewerFeedOptions = {
  requestedLiveId?: string | null;
  initialLives?: ActiveLive[];
  refreshIntervalMs: number;
  loadLives: () => Promise<ActiveLive[]>;
  onNoLivesAvailable?: () => void;
  onActiveLiveEnded?: (
    endedLiveId: string,
  ) => void;
  refreshErrorLabel?: string;
};

export function useLiveViewerFeed({
  requestedLiveId = null,
  initialLives = EMPTY_INITIAL_LIVES,
  refreshIntervalMs,
  loadLives,
  onNoLivesAvailable,
  onActiveLiveEnded,
  refreshErrorLabel =
    "Allive NOW refresh error:",
}: UseLiveViewerFeedOptions) {
  const [
    lives,
    setLives,
  ] = useState<
    ActiveLive[]
  >(initialLives);

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const [
    loadingLives,
    setLoadingLives,
  ] = useState(
    initialLives.length ===
      0,
  );

  const activeLive =
    lives[currentIndex] ??
    null;

  /*
   * Guardamos el LIVE que el
   * espectador estaba viendo.
   *
   * Así podemos distinguir entre:
   * - una actualización normal
   * - el LIVE actual desapareciendo
   *   porque el emisor lo ha terminado.
   */
  const activeLiveIdRef =
    useRef<string | null>(
      null,
    );

  useEffect(() => {
    activeLiveIdRef.current =
      activeLive?.id ?? null;
  }, [
    activeLive?.id,
  ]);

  useEffect(() => {
    if (
      !requestedLiveId
    ) {
      return;
    }

    const requestedIndex =
      lives.findIndex(
        (live) =>
          live.id ===
          requestedLiveId,
      );

    if (
      requestedIndex < 0
    ) {
      return;
    }

    setCurrentIndex(
      requestedIndex,
    );
  }, [
    requestedLiveId,
    lives,
  ]);

  const loadActiveLives =
    useCallback(
      async () => {
        try {
          const nextLives =
            await loadLives();

          const previousActiveLiveId =
            activeLiveIdRef.current;

          const activeLiveStillExists =
            previousActiveLiveId
              ? nextLives.some(
                  (live) =>
                    live.id ===
                    previousActiveLiveId,
                )
              : true;

          const activeLiveEnded =
            Boolean(
              previousActiveLiveId &&
                !activeLiveStillExists,
            );

          if (
            activeLiveEnded &&
            previousActiveLiveId
          ) {
            /*
             * Limpiamos inmediatamente
             * la referencia para evitar
             * disparar varias veces el
             * mismo final de LIVE durante
             * los siguientes refresh.
             */
            activeLiveIdRef.current =
              null;

            onActiveLiveEnded?.(
              previousActiveLiveId,
            );
          }

          if (
            nextLives.length ===
            0
          ) {
            onNoLivesAvailable?.();
          }

          setLives(
            (
              previousLives,
            ) => {
              if (
                nextLives.length ===
                0
              ) {
                return [];
              }

              const currentLive =
                previousLives[
                  currentIndex
                ];

              /*
               * Si el LIVE actual ha
               * terminado, dejamos que
               * el índice actual apunte
               * al contenido que ocupa
               * ahora esa posición.
               *
               * Si era el último,
               * setCurrentIndex lo
               * ajustará posteriormente.
               */
              if (
                activeLiveEnded
              ) {
                return nextLives;
              }

              if (
                !currentLive
              ) {
                return nextLives;
              }

              const stillActiveIndex =
                nextLives.findIndex(
                  (live) =>
                    live.id ===
                    currentLive.id,
                );

              if (
                stillActiveIndex ===
                -1
              ) {
                return nextLives;
              }

              if (
                stillActiveIndex !==
                currentIndex
              ) {
                const reordered = [
                  ...nextLives,
                ];

                const [
                  stillActiveLive,
                ] =
                  reordered.splice(
                    stillActiveIndex,
                    1,
                  );

                reordered.splice(
                  Math.min(
                    currentIndex,
                    reordered.length,
                  ),
                  0,
                  stillActiveLive,
                );

                return reordered;
              }

              return nextLives;
            },
          );

          setCurrentIndex(
            (index) =>
              nextLives.length ===
              0
                ? 0
                : Math.min(
                    index,
                    nextLives.length -
                      1,
                  ),
          );
        } catch (error) {
          console.error(
            refreshErrorLabel,
            error,
          );
        } finally {
          setLoadingLives(
            false,
          );
        }
      },
      [
        currentIndex,
        loadLives,
        onActiveLiveEnded,
        onNoLivesAvailable,
        refreshErrorLabel,
      ],
    );

  useEffect(() => {
    setLives(
      initialLives,
    );

    setCurrentIndex(
      0,
    );

    setLoadingLives(
      initialLives.length ===
        0,
    );
  }, [
    initialLives,
  ]);

  useEffect(() => {
    void loadActiveLives();

    const interval =
      setInterval(
        loadActiveLives,
        refreshIntervalMs,
      );

    return () => {
      clearInterval(
        interval,
      );
    };
  }, [
    loadActiveLives,
    refreshIntervalMs,
  ]);

  const goToPreviousLive =
    useCallback(() => {
      setCurrentIndex(
        (index) =>
          lives.length <=
          1
            ? index
            : index <= 0
              ? lives.length - 1
              : index - 1,
      );
    }, [
      lives.length,
    ]);

  const goToNextLive =
    useCallback(() => {
      setCurrentIndex(
        (index) =>
          lives.length <=
          1
            ? index
            : index >=
                lives.length - 1
              ? 0
              : index + 1,
      );
    }, [
      lives.length,
    ]);

  return {
    lives,
    activeLive,
    currentIndex,
    loadingLives,
    goToPreviousLive,
    goToNextLive,
  };
}