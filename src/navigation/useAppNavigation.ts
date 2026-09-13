// src/navigation/useAppNavigation.ts

import {
  useCallback,
  useRef,
  useState,
} from "react";

import {
  type AppTab,
  type NavigationState,
} from "./navigation.types";

const INITIAL_STATE: NavigationState = {
  activeTab: "now",
  selectedUserId: null,
  notificationsVisible: false,
  requestedLiveId: null,
  requestedReplayId: null,
};

export function useAppNavigation() {
  const [
    navigation,
    setNavigation,
  ] = useState<NavigationState>(
    INITIAL_STATE,
  );

  const historyRef =
    useRef<NavigationState[]>([]);

  const navigationRef =
    useRef<NavigationState>(
      INITIAL_STATE,
    );

  const updateNavigation =
    useCallback(
      (
        updater:
          | NavigationState
          | ((
              current: NavigationState,
            ) => NavigationState),
      ) => {
        setNavigation(
          (current) => {
            const next =
              typeof updater ===
              "function"
                ? updater(
                    current,
                  )
                : updater;

            navigationRef.current =
              next;

            return next;
          },
        );
      },
      [],
    );

  const pushCurrent =
    useCallback(() => {
      historyRef.current.push({
        ...navigationRef.current,
      });
    }, []);

  const changeTab =
    useCallback(
      (tab: AppTab) => {
        const current =
          navigationRef.current;

        if (
          current.activeTab ===
            tab &&
          !current.selectedUserId &&
          !current.notificationsVisible
        ) {
          return;
        }

        pushCurrent();

        updateNavigation({
          activeTab: tab,

          selectedUserId: null,

          notificationsVisible:
            false,

          requestedLiveId:
            tab === "now"
              ? current.requestedLiveId
              : null,

          requestedReplayId:
            tab === "now"
              ? current.requestedReplayId
              : null,
        });
      },
      [
        pushCurrent,
        updateNavigation,
      ],
    );

  const openLive =
    useCallback(
      (liveId: string) => {
        pushCurrent();

        updateNavigation({
          activeTab: "now",
          selectedUserId: null,
          notificationsVisible:
            false,
          requestedLiveId:
            liveId,
          requestedReplayId:
            null,
        });
      },
      [
        pushCurrent,
        updateNavigation,
      ],
    );

  const openReplay =
    useCallback(
      (replayId: string) => {
        pushCurrent();

        updateNavigation({
          activeTab: "now",
          selectedUserId: null,
          notificationsVisible:
            false,
          requestedLiveId:
            null,
          requestedReplayId:
            replayId,
        });
      },
      [
        pushCurrent,
        updateNavigation,
      ],
    );

  const openUser =
    useCallback(
      (userId: string) => {
        pushCurrent();

        updateNavigation(
          (current) => ({
            ...current,

            selectedUserId:
              userId,

            notificationsVisible:
              false,
          }),
        );
      },
      [
        pushCurrent,
        updateNavigation,
      ],
    );

  const openNotifications =
    useCallback(() => {
      pushCurrent();

      updateNavigation(
        (current) => ({
          ...current,

          selectedUserId:
            null,

          notificationsVisible:
            true,
        }),
      );
    }, [
      pushCurrent,
      updateNavigation,
    ]);

  const goBack =
    useCallback(() => {
      const previous =
        historyRef.current.pop();

      if (!previous) {
        return;
      }

      updateNavigation(
        previous,
      );
    }, [
      updateNavigation,
    ]);

  const canGoBack =
    historyRef.current.length >
    0;

  return {
    navigation,

    activeTab:
      navigation.activeTab,

    selectedUserId:
      navigation.selectedUserId,

    notificationsVisible:
      navigation.notificationsVisible,

    requestedLiveId:
      navigation.requestedLiveId,

    requestedReplayId:
      navigation.requestedReplayId,

    canGoBack,

    changeTab,
    openLive,
    openReplay,
    openUser,
    openNotifications,
    goBack,
  };
}