
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppOverlaySlot } from "../../../layout";
import { ReplayBottomControls } from "../controls/ReplayBottomControls";
import { VideoViewerHeader } from "../../../video/viewer/VideoViewerHeader";
import { LiveViewerNavigation } from "../../viewer/navigation/LiveViewerNavigation";
import { ReplayCreatorMetadata } from "./ReplayCreatorMetadata";

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

function formatCount(count: number) {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }

  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }

  return String(count);
}

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
  const creator = replay.creator;

  const creatorName =
    creator?.username ||
    creator?.displayName ||
    "Allive";

  const creatorInitial =
    creatorName.trim().charAt(0).toUpperCase() || "A";

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
              name="play-back"
              size={26}
              color="#FFFFFF"
            />
            <Text style={styles.skipText}>15 s</Text>
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
              name="play-forward"
              size={26}
              color="#FFFFFF"
            />
            <Text style={styles.skipText}>15 s</Text>
          </Pressable>
        </View>
      ) : null}


<AppOverlaySlot name="header">
  <View
    style={styles.headerSlot}
    pointerEvents="box-none"
  >
    <View
      style={styles.headerButtons}
      pointerEvents="box-none"
    >
      <VideoViewerHeader
        mode="replay"
        viewers={replay.peakViewerCount ?? 0}
        onClose={onClose}
      />
    </View>

    {replay.eventName?.trim() ? (
      <View
        style={styles.headerEventContainer}
        pointerEvents="none"
      >
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={styles.headerEventName}
        >
          {replay.eventName.trim()}
        </Text>
      </View>
    ) : null}
  </View>
</AppOverlaySlot>

      {/* METADATA: NUEVO COMPONENTE REUTILIZABLE */}
      <AppOverlaySlot name="metadata">
        <View
          style={styles.metadataSlot}
          pointerEvents="box-none"
        >
          <ReplayCreatorMetadata
            username={creatorName}
            avatarUrl={creator?.avatarUrl}
            location={replay.placeName}
            title={replay.title}
            isFollowing={isFollowing}
            followLoading={followLoading}
            onOpenCreator={onOpenCreator}
            onFollowPress={onFollowPress}
          />
        </View>
      </AppOverlaySlot>

      <AppOverlaySlot name="sideActions">
        <View
          style={styles.sideActions}
          pointerEvents="box-none"
        >
          {/* ME GUSTA */}
          <Pressable
            style={[
              styles.sideAction,
              likeLoading && styles.disabled,
            ]}
            accessibilityRole="button"
            accessibilityLabel={
              liked
                ? "Quitar me gusta"
                : "Me gusta"
            }
            disabled={likeLoading}
            onPress={onLikePress}
          >
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={30}
              color={liked ? "#FF3048" : "#FFFFFF"}
            />
            <Text style={styles.actionCount}>
              {formatCount(likes)}
            </Text>
          </Pressable>

          {/* COMENTARIOS */}
          <Pressable
            style={styles.sideAction}
            accessibilityRole="button"
            accessibilityLabel="Comentarios"
          >
            <Ionicons
              name="chatbubble-outline"
              size={28}
              color="#FFFFFF"
            />
          </Pressable>

          {/* ENVIAR */}
          <Pressable
            style={styles.sideAction}
            accessibilityRole="button"
            accessibilityLabel="Enviar replay"
          >
            <Ionicons
              name="send-outline"
              size={28}
              color="#FFFFFF"
            />
          </Pressable>

          {/* SONIDO */}
          <Pressable
            style={styles.sideAction}
            accessibilityRole="button"
            accessibilityLabel={
              playbackMuted
                ? "Activar sonido"
                : "Silenciar"
            }
            disabled={!onToggleMute}
            onPress={onToggleMute}
          >
            <Ionicons
              name={
                playbackMuted
                  ? "volume-mute-outline"
                  : "volume-high-outline"
              }
              size={28}
              color="#FFFFFF"
            />
          </Pressable>
        </View>
      </AppOverlaySlot>

      {/* CAJÓN INFERIOR: SIN CAMBIOS */}
      <AppOverlaySlot name="bottomControls">
        <View
          style={styles.bottomSlot}
          pointerEvents="box-none"
        >
          <View
            style={styles.bottomCreatorRow}
            pointerEvents="box-none"
          >
            <Pressable
              style={styles.bottomCreatorIdentity}
              accessibilityRole="button"
              accessibilityLabel="Abrir perfil del creador"
              disabled={!onOpenCreator}
              onPress={onOpenCreator}
            >
              <View style={styles.bottomAvatar}>
                {creator?.avatarUrl ? (
                  <Image
                    source={{ uri: creator.avatarUrl }}
                    style={styles.bottomAvatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.bottomAvatarFallback}>
                    {creatorInitial}
                  </Text>
                )}
              </View>

              <Text
                numberOfLines={1}
                style={styles.bottomCreatorName}
              >
                @{creatorName}
              </Text>
            </Pressable>

            {onFollowPress ? (
              <Pressable
                style={[
                  styles.bottomFollowButton,
                  isFollowing && styles.bottomFollowingButton,
                  followLoading && styles.disabled,
                ]}
                accessibilityRole="button"
                accessibilityLabel={
                  isFollowing
                    ? "Dejar de seguir al creador"
                    : "Seguir al creador"
                }
                disabled={followLoading}
                onPress={onFollowPress}
              >
                <Text style={styles.bottomFollowText}>
                  {followLoading
                    ? "..."
                    : isFollowing
                      ? "Siguiendo"
                      : "Seguir"}
                </Text>
              </Pressable>
            ) : null}
          </View>

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
        </View>
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
  position: "relative",
},

headerButtons: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1,
},

headerEventContainer: {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 2,
  justifyContent: "flex-end",
},

headerEventName: {
  width: "100%",
  color: "#FFFFFF",
  fontSize: 24,
  lineHeight: 28,
  fontWeight: "800",
  letterSpacing: -0.5,
  textAlign: "left",
  textShadowColor: "rgba(0,0,0,0.85)",
  textShadowOffset: {
    width: 0,
    height: 2,
  },
  textShadowRadius: 5,
},

  metadataSlot: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  sideActions: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 20,
    paddingBottom: 12,
  },

  sideAction: {
    minWidth: 44,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  actionCount: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.75)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },

  disabled: {
    opacity: 0.5,
  },

  bottomSlot: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },

  bottomCreatorRow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  bottomCreatorIdentity: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    minWidth: 0,
  },

  bottomAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(35,35,40,0.85)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
  },

  bottomAvatarImage: {
    width: "100%",
    height: "100%",
  },

  bottomAvatarFallback: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  bottomCreatorName: {
    marginLeft: 9,
    flexShrink: 1,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },

  bottomFollowButton: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  bottomFollowingButton: {
    backgroundColor: "rgba(255,255,255,0.14)",
  },

  bottomFollowText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
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
    bottom: 5,
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "600",
  },

  controlPressed: {
    transform: [{ scale: 0.92 }],
  },
});