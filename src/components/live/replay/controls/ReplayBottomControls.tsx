
// src/components/live/replay/controls/ReplayBottomControls.tsx

import {
  StyleSheet,
  View,
} from "react-native";

import {
  ReplayPlaybackControls,
} from "../player/ReplayPlaybackControls";

type Props = {
  likes: number;
  liked: boolean;
  likeLoading?: boolean;
  onLikePress: () => void;

  playbackPaused: boolean;
  playbackMuted: boolean;

  currentTime: number;
  duration: number;

  onPlaybackToggle?: () => void;
  onSeek?: (time: number) => void;
  onSkipBackward?: () => void;
  onSkipForward?: () => void;
  onToggleMute?: () => void;
};

export function ReplayBottomControls({
  playbackPaused,
  playbackMuted,
  currentTime,
  duration,
  onPlaybackToggle,
  onSeek,
  onSkipBackward,
  onSkipForward,
  onToggleMute,
}: Props) {
  const hasPlaybackControls = Boolean(
    onPlaybackToggle &&
      onSeek &&
      onSkipBackward &&
      onSkipForward &&
      onToggleMute,
  );

  if (!hasPlaybackControls) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ReplayPlaybackControls
        currentTime={currentTime}
        duration={duration}
        paused={playbackPaused}
        muted={playbackMuted}
        onTogglePlayback={onPlaybackToggle!}
        onSeek={onSeek!}
        onSkipBackward={onSkipBackward!}
        onSkipForward={onSkipForward!}
        onToggleMute={onToggleMute!}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
});