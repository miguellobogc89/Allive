// src/components/live/LiveViewerOverlay.tsx

import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { layout } from "../../styles";
import { LiveActions } from "./LiveActions";
import { LiveCommentInput } from "./LiveCommentInput";
import { LiveComments } from "./LiveComments";
import { LiveHeader } from "./LiveHeader";
import { LiveMetadata } from "./LiveMetadata";
import { LiveNavigation } from "./LiveNavigation";
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
      <LiveHeader viewerCount={viewerCount} />
      <LiveNavigation currentIndex={currentIndex} total={totalLives} onPrevious={onPreviousLive} onNext={onNextLive} />
      <LiveActions saved={saved} onSavePress={() => setSaved((value) => !value)} />

      <View style={styles.bottomLeft} pointerEvents="box-none">
        <LiveMetadata
          title={live.title}
          eventName={live.eventName}
          placeName={live.placeName}
          creatorName={creatorName}
        />
        <LiveComments comments={comments} onLikeComment={toggleCommentLike} />
        <LiveCommentInput value={commentValue} onChangeText={setCommentValue} onSend={sendComment} />
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
