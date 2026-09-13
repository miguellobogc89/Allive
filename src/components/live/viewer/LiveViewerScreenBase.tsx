// src/components/live/viewer/LiveViewerScreenBase.tsx

import type {
  Room,
} from "livekit-client";

import type {
  ReactNode,
} from "react";

import {
  useEffect,
} from "react";

import {
  Text,
  View,
} from "react-native";

import {
  useAuth,
} from "../../../auth/AuthContext";

import type {
  AuthUser,
  ViewerIdentity,
} from "../../../auth/types";

import type {
  LiveAudience,
} from "../liveAudience";

import type {
  ActiveLive,
} from "../types";

import {
  useLiveViewerFeed,
  type LiveViewerNavigation,
} from "./hooks/useLiveViewerFeed";

import {
  useLiveViewerSession,
} from "./hooks/useLiveViewerSession";

import {
  LiveViewerOverlay,
} from "./overlay/LiveViewerOverlay";

import {
  liveViewerScreenStyles as styles,
} from "./LiveViewerScreen.styles";

type RenderVideoSurfaceOptions = {
  live: ActiveLive;
  viewerIdentity:
    | ViewerIdentity
    | null;
  viewerUser:
    | AuthUser
    | null;
  authToken:
    | string
    | null;
  onAudienceChange: (
    audience: LiveAudience,
  ) => void;
  onRoomChange: (
    room: Room | null,
  ) => void;
};

type LiveViewerScreenBaseProps = {
  requestedLiveId?: string | null;
  initialLives?: ActiveLive[];
  refreshIntervalMs: number;
  loadLives: () => Promise<ActiveLive[]>;
  refreshErrorLabel?: string;
  renderLoading: () => ReactNode;
  renderVideoSurface: (
    options:
      RenderVideoSurfaceOptions,
  ) => ReactNode;
  onNoLivesAvailable?: () => void;
  onOpenUser?: (
    userId: string,
  ) => void;
  onNavigationReady?: (
    navigation:
      LiveViewerNavigation,
  ) => void;
  showNavigation?: boolean;
};

export function LiveViewerScreenBase({
  requestedLiveId = null,
  initialLives,
  refreshIntervalMs,
  loadLives,
  refreshErrorLabel,
  renderLoading,
  renderVideoSurface,
  onNoLivesAvailable,
  onOpenUser,
  onNavigationReady,
  showNavigation = true,
}: LiveViewerScreenBaseProps) {
  const {
    identity,
    user,
    token,
  } = useAuth();

  const {
    lives,
    activeLive,
    currentIndex,
    loadingLives,
    goToPreviousLive,
    goToNextLive,
  } = useLiveViewerFeed({
    requestedLiveId,
    initialLives,
    refreshIntervalMs,
    loadLives,
    onNoLivesAvailable,
    refreshErrorLabel,
  });

  const {
    audience,
    setAudience,
    viewerRoom,
    setViewerRoom,
  } = useLiveViewerSession({
    activeLiveId:
      activeLive?.id,
  });

  useEffect(() => {
    onNavigationReady?.({
      previous:
        goToPreviousLive,
      next:
        goToNextLive,
    });
  }, [
    goToNextLive,
    goToPreviousLive,
    onNavigationReady,
  ]);

  return (
    <View
      style={
        styles.container
      }
    >
      {loadingLives &&
      !activeLive ? (
        renderLoading()
      ) : activeLive ? (
        renderVideoSurface({
          live: activeLive,
          viewerIdentity:
            identity,
          viewerUser:
            user,
          authToken:
            token,
          onAudienceChange:
            setAudience,
          onRoomChange:
            setViewerRoom,
        })
      ) : (
        <View
          style={
            styles.emptyState
          }
        >
          <Text
            style={
              styles.emptyTitle
            }
          >
            No hay directos actualmente
          </Text>

          <Text
            style={
              styles.emptySubtitle
            }
          >
            Puedes ver los replays mientras tanto.
          </Text>
        </View>
      )}

      {activeLive ? (
        <LiveViewerOverlay
          live={
            activeLive
          }
          room={
            viewerRoom
          }
          audience={
            audience
          }
          viewerIdentity={
            identity
          }
          authToken={
            token
          }
          currentIndex={
            currentIndex
          }
          totalLives={
            lives.length
          }
          onPrevious={
            goToPreviousLive
          }
          onNext={
            goToNextLive
          }
          onOpenUser={
            onOpenUser
          }
          showNavigation={
            showNavigation
          }
        />
      ) : null}
    </View>
  );
}
