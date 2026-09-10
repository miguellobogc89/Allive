// src/components/live/comments/LiveTimedCommentsLayer.tsx

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import {
  layout,
  spacing,
} from "../../../styles";

import {
  LiveComment,
} from "./LiveComment";
import type {
  LiveCommentModel,
} from "./liveCommentTypes";

type TimedCommentProps = {
  comment: LiveCommentModel;
  onExpired: (id: string) => void;
  onPressActor?: (userId: string) => void;
};

type LiveTimedCommentsLayerProps = {
  comments: LiveCommentModel[];
  visible?: boolean;
  bottom?: number;
  onPressActor?: (userId: string) => void;
};

const DISPLAY_MS = 5000;
const EXIT_MS = 360;

function TimedComment({
  comment,
  onExpired,
  onPressActor,
}: TimedCommentProps) {
  const opacity =
    useRef(new Animated.Value(0)).current;
  const translateY =
    useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: EXIT_MS,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -24,
          duration: EXIT_MS,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onExpired(comment.id);
      });
    }, DISPLAY_MS);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    comment.id,
    onExpired,
    opacity,
    translateY,
  ]);

  return (
    <Animated.View
      style={[
        styles.comment,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <LiveComment
        comment={comment}
        onPressActor={onPressActor}
      />
    </Animated.View>
  );
}

export function LiveTimedCommentsLayer({
  comments,
  visible = true,
  bottom = layout.liveContentBottom + 58,
  onPressActor,
}: LiveTimedCommentsLayerProps) {
  const { height } = useWindowDimensions();

  const [
    activeComments,
    setActiveComments,
  ] = useState<LiveCommentModel[]>([]);

  useEffect(() => {
    if (!visible || comments.length === 0) {
      return;
    }

    const newest =
      comments[comments.length - 1];

    setActiveComments((current) => {
      if (
        current.some(
          (item) => item.id === newest.id,
        )
      ) {
        return current;
      }

      return [...current, newest];
    });
  }, [comments, visible]);

  const removeComment =
    useCallback((id: string) => {
      setActiveComments((current) =>
        current.filter(
          (comment) => comment.id !== id,
        ),
      );
    }, []);

  useEffect(() => {
    if (!visible) {
      setActiveComments([]);
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        {
          bottom,
          height: height * 0.35,
        },
      ]}
    >
      <View style={styles.stack}>
        {activeComments.map((comment) => (
          <TimedComment
            key={comment.id}
            comment={comment}
            onExpired={removeComment}
            onPressActor={onPressActor}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: layout.screenHorizontalPadding,
    right: layout.liveContentRight,
    zIndex: 18,
    overflow: "hidden",
    justifyContent: "flex-end",
  },

  stack: {
    width: "100%",
    justifyContent: "flex-end",
    gap: spacing.xs,
  },

  comment: {
    alignSelf: "flex-start",
    maxWidth: "100%",
  },
});
