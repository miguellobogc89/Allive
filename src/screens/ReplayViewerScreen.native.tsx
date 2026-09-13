// src/screens/ReplayViewerScreen.native.tsx

import {
  ActivityIndicator,
  View,
} from "react-native";

import {
  ReplayViewerScreenBase,
} from "../components/live/replay/viewer/ReplayViewerScreenBase";

import {
  replayViewerStyles as styles,
} from "../components/live/replay/viewer/ReplayViewerScreen.styles";

import type {
  ReplayViewerNavigation,
} from "../components/live/replay/viewer/hooks/useReplayFeed";

import {
  tokens,
} from "../styles";

type ReplayViewerScreenProps = {
  requestedReplayId?:
    | string
    | null;

  onOpenUser?: (
    userId: string,
  ) => void;

  onNavigationReady?: (
    navigation:
      ReplayViewerNavigation,
  ) => void;
};

export function ReplayViewerScreen({
  requestedReplayId = null,
  onOpenUser,
  onNavigationReady,
}: ReplayViewerScreenProps) {
  return (
    <ReplayViewerScreenBase
      requestedReplayId={
        requestedReplayId
      }
      onOpenUser={
        onOpenUser
      }
      onNavigationReady={
        onNavigationReady
      }
      renderLoading={() => (
        <View
          style={
            styles.loading
          }
        >
          <ActivityIndicator
            color={
              tokens.color.accent
                .primary
            }
          />
        </View>
      )}
      showNavigation={
        false
      }
    />
  );
}
