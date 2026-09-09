// src/components/live/comments/LiveComment.tsx

import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../../../styles";
import type { LiveCommentModel } from "./liveCommentTypes";

export function LiveComment({ comment }: { comment: LiveCommentModel }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        <Text style={styles.username}>@{comment.username} </Text>
        {comment.body}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    maxWidth: "100%",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.overlaySoft,
  },
  text: {
    color: colors.text,
    ...typography.label,
    fontWeight: "400",
  },
  username: {
    fontWeight: "800",
  },
});
