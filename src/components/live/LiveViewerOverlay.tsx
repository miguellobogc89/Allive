// src/components/live/LiveViewerOverlay.tsx

import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { layout } from "../../styles";
import { LiveViewerActions } from "./LiveViewerActions";
import { LiveViewerCommentInput } from "./LiveViewerCommentInput";
import { LiveViewerComments } from "./LiveViewerComments";
import { LiveViewerHeader } from "./LiveViewerHeader";
import { LiveViewerMetadata } from "./LiveViewerMetadata";
import { LiveViewerNavigation } from "./LiveViewerNavigation";
import type { ActiveLive, LiveComment } from "./types";

type Props = {
  live: ActiveLive;
  viewerCount: number;
  currentIndex: number;
  totalLives: number;
  onPreviousLive: () => void;
  onNextLive: () => void;
};

const INITIAL_COMMENTS: LiveComment[] = [
  { id: "mock-1", username: "lucia", text: "¿Qué está pasando ahora?", likes: 3 },
  { id: "mock-2", username: "dani", text: "Se ve perfecto 👀", likes: 1 },
];

export function LiveViewerOverlay({
  live,
  viewerCount,
  currentIndex,
  totalLives,
  onPreviousLive,
  onNextLive,
}: Props) {
  const [saved, setSaved] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [comments, setComments] = useState<LiveComment[]>(INITIAL_COMMENTS);

  useEffect(() => {
    setSaved(false);
    setCommentValue("");
    setComments(INITIAL_COMMENTS);
  }, [live.id]);

  function sendComment() {
    const text = commentValue.trim();
    if (!text) return;
    setComments((current) => [...current, { id: `local-${Date.now()}`, username: "tú", text, likes: 0 }]);
    setCommentValue("");
  }

  function toggleCommentLike(commentId: string) {
    setComments((current) =>
      current.map((comment) => {
        if (comment.id !== commentId) return comment;
        const liked = !comment.liked;
        return { ...comment, liked, likes: Math.max(0, comment.likes + (liked ? 1 : -1)) };
      })
    );
  }

  const creatorName = live.creator?.username ?? live.creator?.displayName ?? null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <LiveViewerHeader viewerCount={viewerCount} />
      <LiveViewerNavigation currentIndex={currentIndex} total={totalLives} onPrevious={onPreviousLive} onNext={onNextLive} />
      <LiveViewerActions saved={saved} onSavePress={() => setSaved((value) => !value)} />

      <View style={styles.bottomLeft} pointerEvents="box-none">
        <LiveViewerMetadata
          title={live.title}
          eventName={live.eventName}
          placeName={live.placeName}
          creatorName={creatorName}
        />
        <LiveViewerComments comments={comments} onLikeComment={toggleCommentLike} />
        <LiveViewerCommentInput value={commentValue} onChangeText={setCommentValue} onSend={sendComment} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFill, zIndex: 10 },
  bottomLeft: {
    position: "absolute",
    left: layout.screenHorizontalPadding,
    right: layout.liveContentRight,
    bottom: layout.liveContentBottom,
    gap: 11,
  },
});
