// src/components/live/replay/overlay/ReplayOverlay.tsx

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppOverlaySlot } from "../../../layout";
import { ReplayBottomControls } from "../controls/ReplayBottomControls";
import { VideoViewerHeader } from "../../../video/viewer/VideoViewerHeader";
import { LiveViewerIdentity } from "../../viewer/header/LiveViewerIdentity";
import { LiveViewerNavigation } from "../../viewer/navigation/LiveViewerNavigation";

import type { Replay } from "../types";

type ReplayOverlayProps = {
  replay: Replay;

  currentIndex: number;
  totalReplays: number;

  likes: number;
  liked: boolean;
  likeLoading?: boolean;
  onLikePress: () => void;

  followLoading?: boolean;
  isFollowing?: boolean;

  onPrevious: () => void;
  onNext: () => void;
  onClose?: () => void;

  onFollowPress?: () => void;
  onOpenCreator?: () => void;
  onOpenLives?: () => void;

  showNavigation?: boolean;

  playbackPaused?: boolean;
  playbackMuted?: boolean;

  currentTime?: number;
  duration?: number;

  onPlaybackToggle?: () => void;
  onSeek?: (time: number) => void;
  onSkipBackward?: () => void;
  onSkipForward?: () => void;
  onToggleMute?: () => void;
};

export function ReplayOverlay({
  replay,

  currentIndex,
  totalReplays,

  likes,
  liked,
  likeLoading = false,
  onLikePress,

  followLoading = false,
  isFollowing = false,

  onPrevious,
  onNext,
  onClose,

  onFollowPress,
  onOpenCreator,

  showNavigation = true,

  playbackPaused = false,
  playbackMuted = false,

  currentTime = 0,
  duration = 0,

  onPlaybackToggle,
  onSeek,
  onSkipBackward,
  onSkipForward,
  onToggleMute,
}: ReplayOverlayProps) {
  return (
    <View
      style={styles.overlay}
      pointerEvents="box-none"
    >
      <LinearGradient
        colors={[
          "rgba(0,0,0,0)",
          "rgba(0,0,0,0.04)",
          "rgba(0,0,0,0.18)",
          "rgba(0,0,0,0.58)",
        ]}
        locations={[0, 0.42, 0.7, 1]}
        style={styles.bottomGradient}
        pointerEvents="none"
      />

      <Pressable
        style={styles.tapSurface}
        onPress={onPlaybackToggle}
        disabled={!onPlaybackToggle}
        accessibilityRole="button"
        accessibilityLabel={
          playbackPaused
            ? "Reproducir replay"
            : "Pausar replay"
        }
      />

      {playbackPaused ? (
        <View
          style={styles.pausedControls}
          pointerEvents="box-none"
        >
          <Pressable
            style={({ pressed }) => [
              styles.skipButton,
              pressed && styles.controlPressed,
            ]}
            onPress={onSkipBackward}
            disabled={!onSkipBackward}
            accessibilityRole="button"
            accessibilityLabel="Retroceder 15 segundos"
          >
            <Ionicons
              name="arrow-undo-outline"
              size={24}
              color="#FFFFFF"
            />

            <Text style={styles.skipText}>
              15
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.playButton,
              pressed && styles.controlPressed,
            ]}
            onPress={onPlaybackToggle}
            disabled={!onPlaybackToggle}
            accessibilityRole="button"
            accessibilityLabel="Reproducir"
          >
            <Ionicons
              name="play"
              size={38}
              color="#FFFFFF"
              style={styles.playIcon}
            />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.skipButton,
              pressed && styles.controlPressed,
            ]}
            onPress={onSkipForward}
            disabled={!onSkipForward}
            accessibilityRole="button"
            accessibilityLabel="Avanzar 15 segundos"
          >
            <Ionicons
              name="arrow-redo-outline"
              size={24}
              color="#FFFFFF"
            />

            <Text style={styles.skipText}>
              15
            </Text>
          </Pressable>
        </View>
      ) : null}

      <AppOverlaySlot name="header">
        <View
          style={styles.headerSlot}
          pointerEvents="box-none"
        >
          <VideoViewerHeader
            mode="replay"
            viewers={replay.peakViewerCount ?? 0}
            onClose={onClose}
          />
        </View>
      </AppOverlaySlot>

      <AppOverlaySlot name="metadata">
        <View
          style={styles.metadataSlot}
          pointerEvents="box-none"
        >
          <LiveViewerIdentity
            live={replay}
            followLoading={followLoading}
            isFollowing={isFollowing}
            onFollowPress={onFollowPress}
            onOpenCreator={onOpenCreator}
          />
        </View>
      </AppOverlaySlot>

      <AppOverlaySlot name="bottomControls">
        <ReplayBottomControls
          likes={likes}
          liked={liked}
          likeLoading={likeLoading}
          onLikePress={onLikePress}
          playbackPaused={playbackPaused}
          playbackMuted={playbackMuted}
          currentTime={currentTime}
          duration={duration}
          onPlaybackToggle={onPlaybackToggle}
          onSeek={onSeek}
          onSkipBackward={onSkipBackward}
          onSkipForward={onSkipForward}
          onToggleMute={onToggleMute}
        />
      </AppOverlaySlot>

      {showNavigation ? (
        <LiveViewerNavigation
          currentIndex={currentIndex}
          total={totalReplays}
          onPrevious={onPrevious}
          onNext={onNext}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
  },

  tapSurface: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },

  bottomGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 300,
  },

  headerSlot: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },

  metadataSlot: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    justifyContent: "flex-end",
  },

  pausedControls: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    marginTop: -36,
    zIndex: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 22,
  },

  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.48)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  playIcon: {
    marginLeft: 4,
  },

  skipButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.42)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  skipText: {
    position: "absolute",
    bottom: 6,
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "400",
  },

  controlPressed: {
    transform: [{ scale: 0.92 }],
  },
});