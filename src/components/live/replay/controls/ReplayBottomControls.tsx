// src/components/live/replay/controls/ReplayBottomControls.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
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

function formatCount(count: number) {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }

  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }

  return String(count);
}

export function ReplayBottomControls({
  likes,
  liked,
  likeLoading = false,
  onLikePress,
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

  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            playbackPaused
              ? "Reproducir"
              : "Pausar"
          }
          disabled={!onPlaybackToggle}
          onPress={onPlaybackToggle}
          style={styles.action}
        >
          <Ionicons
            name={
              playbackPaused
                ? "play-outline"
                : "pause-outline"
            }
            size={27}
            color="#FFFFFF"
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            liked
              ? "Quitar me gusta"
              : "Me gusta"
          }
          disabled={likeLoading}
          onPress={onLikePress}
          style={[
            styles.action,
            likeLoading && styles.disabled,
          ]}
        >
          <Ionicons
            name={
              liked
                ? "heart"
                : "heart-outline"
            }
            size={27}
            color={
              liked
                ? "#FF3048"
                : "#FFFFFF"
            }
          />

          <Text style={styles.count}>
            {formatCount(likes)}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retroceder 15 segundos"
          disabled={!onSkipBackward}
          onPress={onSkipBackward}
          style={styles.action}
        >
          <Ionicons
            name="play-back-outline"
            size={26}
            color="#FFFFFF"
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Avanzar 15 segundos"
          disabled={!onSkipForward}
          onPress={onSkipForward}
          style={styles.action}
        >
          <Ionicons
            name="play-forward-outline"
            size={26}
            color="#FFFFFF"
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            playbackMuted
              ? "Activar sonido"
              : "Silenciar"
          }
          disabled={!onToggleMute}
          onPress={onToggleMute}
          style={styles.action}
        >
          <Ionicons
            name={
              playbackMuted
                ? "volume-mute-outline"
                : "volume-high-outline"
            }
            size={26}
            color="#FFFFFF"
          />
        </Pressable>
      </View>

      {hasPlaybackControls ? (
        <View style={styles.progress}>
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
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },

  actions: {
    flex: 1,
    minHeight: 0,
    flexDirection: "row",
    alignItems: "center",
  },

  action: {
    flex: 1,
    height: "100%",
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },

  count: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },

  disabled: {
    opacity: 0.5,
  },

  progress: {
    width: "100%",
    height: 12,
    justifyContent: "flex-end",
  },
});