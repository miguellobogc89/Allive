import {
  useEffect,
  type ReactNode,
} from "react";

import {
  Text,
  View,
} from "react-native";

import {
  useAuth,
} from "../../../../auth/AuthContext";

import {
  useLiveViewerLikes,
} from "../../viewer/hooks/useLiveViewerLikes";

import {
  ReplayOverlay,
} from "../overlay/ReplayOverlay";

import type {
  Replay,
} from "../types";

import {
  ReplayVideoPlayer,
} from "./ReplayVideoPlayer";

import {
  replayViewerStyles as styles,
} from "./ReplayViewerScreen.styles";

import {
  useReplayFeed,
  type ReplayViewerNavigation,
} from "./hooks/useReplayFeed";

type ReplayViewerScreenBaseProps = {
  requestedReplayId?: string | null;

  onOpenUser?: (
    userId: string,
  ) => void;

  onNavigationReady?: (
    navigation:
      ReplayViewerNavigation,
  ) => void;

  renderLoading: () => ReactNode;

  showNavigation?: boolean;
};

export function ReplayViewerScreenBase({
  requestedReplayId = null,
  onOpenUser,
  onNavigationReady,
  renderLoading,
  showNavigation = true,
}: ReplayViewerScreenBaseProps) {
  const {
    identity,
    token,
  } = useAuth();

  const {
    activeReplay,
    currentIndex,
    goToNextReplay,
    goToPreviousReplay,
    loading,
    replays,
  } = useReplayFeed({
    requestedReplayId,
  });

  useEffect(() => {
    onNavigationReady?.({
      previous:
        goToPreviousReplay,

      next:
        goToNextReplay,
    });
  }, [
    goToNextReplay,
    goToPreviousReplay,
    onNavigationReady,
  ]);

  if (
    loading &&
    !activeReplay
  ) {
    return (
      <>
        {renderLoading()}
      </>
    );
  }

  if (!activeReplay) {
    return (
      <View
        style={
          styles.container
        }
      >
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
            No hay replays disponibles
          </Text>

          <Text
            style={
              styles.emptySubtitle
            }
          >
            Los directos recientes aparecerÃ¡n aquÃ­.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ReplayContent
      replay={
        activeReplay
      }
      currentIndex={
        currentIndex
      }
      totalReplays={
        replays.length
      }
      viewerIdentity={
        identity
      }
      authToken={
        token
      }
      onPrevious={
        goToPreviousReplay
      }
      onNext={
        goToNextReplay
      }
      onOpenUser={
        onOpenUser
      }
      showNavigation={
        showNavigation
      }
    />
  );
}

type ReplayContentProps = {
  replay: Replay;

  currentIndex: number;
  totalReplays: number;

  viewerIdentity:
    ReturnType<
      typeof useAuth
    >["identity"];

  authToken:
    string | null;

  onPrevious:
    () => void;

  onNext:
    () => void;

  onOpenUser?: (
    userId: string,
  ) => void;

  showNavigation: boolean;
};

function ReplayContent({
  replay,

  currentIndex,
  totalReplays,

  viewerIdentity,
  authToken,

  onPrevious,
  onNext,

  onOpenUser,
  showNavigation,
}: ReplayContentProps) {
  const {
    liked,
    likeCount,
    likeLoading,
    toggleLike,
  } = useLiveViewerLikes({
    liveId:
      replay.id,

    viewerIdentity,

    authToken,
  });

  const creatorId =
    replay.creator?.id;

  return (
    <ReplayVideoPlayer
      replay={
        replay
      }
    >
      {(playback) => (
        <ReplayOverlay
          replay={
            replay
          }
          currentIndex={
            currentIndex
          }
          totalReplays={
            totalReplays
          }
          likes={
            likeCount
          }
          liked={
            liked
          }
          likeLoading={
            likeLoading
          }
          onLikePress={
            toggleLike
          }
          onPrevious={
            onPrevious
          }
          onNext={
            onNext
          }
          onOpenCreator={
            creatorId
              ? () => {
                  onOpenUser?.(
                    creatorId,
                  );
                }
              : undefined
          }
          showNavigation={
            showNavigation
          }
          playbackPaused={
            playback.paused
          }
          playbackMuted={
            playback.muted
          }
          currentTime={
            playback.currentTime
          }
          duration={
            playback.duration
          }
          onPlaybackToggle={
            playback.togglePlayback
          }
          onSeek={
            playback.seekTo
          }
          onSkipBackward={
            playback.skipBackward
          }
          onSkipForward={
            playback.skipForward
          }
          onToggleMute={
            playback.toggleMute
          }
        />
      )}
    </ReplayVideoPlayer>
  );
}
