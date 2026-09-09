// src/components/live/LiveComments.tsx

import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { LiveComment } from "./types";

type LiveCommentsProps = { comments: LiveComment[]; onLikeComment?: (commentId: string) => void };

export function LiveComments({ comments, onLikeComment }: LiveCommentsProps) {
  if (comments.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {comments.map((comment) => (
          <View key={comment.id} style={styles.comment}>
            <View style={styles.body}>
              <Text style={styles.text}>
                <Text style={styles.username}>@{comment.username} </Text>
                {comment.text}
              </Text>
            </View>
            <Pressable style={styles.likeButton} onPress={() => onLikeComment?.(comment.id)}>
              <Ionicons name={comment.liked ? "heart" : "heart-outline"} size={16} color={comment.liked ? "#FF5A52" : "rgba(255,255,255,0.78)"} />
              {comment.likes > 0 ? <Text style={styles.likeCount}>{comment.likes}</Text> : null}
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { maxHeight: 190, maxWidth: "78%" },
  scroll: { flexGrow: 0 },
  content: { gap: 9, paddingVertical: 2 },
  comment: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  body: { flexShrink: 1, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.36)" },
  text: { color: "#FFFFFF", fontSize: 12, lineHeight: 17 },
  username: { fontWeight: "800" },
  likeButton: { minWidth: 30, minHeight: 30, alignItems: "center", justifyContent: "center", gap: 1 },
  likeCount: { color: "rgba(255,255,255,0.7)", fontSize: 8, fontWeight: "700" },
});
