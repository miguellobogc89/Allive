// src/components/live/comments/LiveCommentList.tsx

import {
  useRef,
} from "react";

import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import {
  spacing,
} from "../../../styles";

import {
  LiveComment,
} from "./LiveComment";

import type {
  LiveCommentModel,
} from "./liveCommentTypes";

type Props = {
  comments: LiveCommentModel[];
};

export function LiveCommentList({
  comments,
}: Props) {
  const scrollRef =
    useRef<ScrollView | null>(null);

  if (comments.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({
            animated: true,
          })
        }
      >
        {comments.map((comment) => (
          <LiveComment
            key={comment.id}
            comment={comment}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 190,
    maxWidth: "78%",
  },

  scroll: {
    flexGrow: 0,
  },

  content: {
    gap: spacing.xs,
    paddingVertical: spacing.xxs,
  },
});
