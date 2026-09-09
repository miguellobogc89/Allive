// src/components/live/LiveViewerOverlay.tsx

import { StyleSheet, View } from "react-native";
import { LiveActions } from "./LiveActions";
import { LiveCommentInput } from "./LiveCommentInput";
import { LiveComments } from "./LiveComments";
import { LiveHeader } from "./LiveHeader";
import { LiveMetadata } from "./LiveMetadata";
import { LiveNavigation } from "./LiveNavigation";
import type { ActiveLive, LiveComment } from "./types";

type LiveViewerOverlayProps = {
  live: ActiveLive;
  viewerCount: number;
  currentIndex: number;
  totalLives: number;
  comments?: LiveComment[];
  commentValue?: string;
  saved?: boolean;
  onCommentChange?: (value: string) => void;
  onSendComment?: () => void;
  onLikeComment?: (commentId: string) => void;
  onProfilePress?: () => void;
  onSavePress?: () => void;
  onSharePress?: () => void;
  onMorePress?: () => void;
  onPreviousLive: () => void;
  onNextLive: () => void;
};

export function LiveViewerOverlay({
  live, viewerCount, currentIndex, totalLives, comments = [], commentValue = "", saved = false,
  onCommentChange, onSendComment, onLikeComment, onProfilePress, onSavePress, onSharePress, onMorePress,
  onPreviousLive, onNextLive,
}: LiveViewerOverlayProps) {
  const creatorName = live.creator?.username ?? live.creator?.displayName ?? null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <LiveHeader viewerCount={viewerCount} />
      <LiveNavigation currentIndex={currentIndex} total={totalLives} onPrevious={onPreviousLive} onNext={onNextLive} />
      <LiveActions saved={saved} onProfilePress={onProfilePress} onSavePress={onSavePress} onSharePress={onSharePress} onMorePress={onMorePress} />

      <View style={styles.bottomLeft} pointerEvents="box-none">
        <LiveMetadata title={live.title} eventName={live.eventName} placeName={live.placeName} creatorName={creatorName} />
        <LiveComments comments={comments} onLikeComment={onLikeComment} />
        <LiveCommentInput
          value={commentValue}
          onChangeText={onCommentChange ?? (() => undefined)}
          onSend={onSendComment ?? (() => undefined)}
          disabled={!onCommentChange || !onSendComment}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFill, zIndex: 10 },
  bottomLeft: { position: "absolute", left: 14, right: 82, bottom: 110, gap: 11 },
});
