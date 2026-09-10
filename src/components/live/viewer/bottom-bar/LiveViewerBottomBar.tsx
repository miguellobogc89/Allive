// src/components/live/viewer/bottom-bar/LiveViewerBottomBar.tsx

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import {
  colors,
  layout,
} from "../../../../styles";

import {
  LiveCommentComposer,
} from "../../comments";

type Props = {
  commentValue: string;
  commentDisabled?: boolean;

  liked: boolean;
  likeDisabled?: boolean;

  onCommentChange: (
    value: string,
  ) => void;

  onCommentSend: () => void;
  onLikePress: () => void;
};

export function LiveViewerBottomBar({
  commentValue,
  commentDisabled = false,
  liked,
  likeDisabled = false,
  onCommentChange,
  onCommentSend,
  onLikePress,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.composer}>
        <LiveCommentComposer
          value={commentValue}
          disabled={commentDisabled}
          onChangeText={onCommentChange}
          onSend={onCommentSend}
        />
      </View>

      <Pressable
        style={[
          styles.likeButton,
          likeDisabled
            ? styles.likeDisabled
            : null,
        ]}
        disabled={likeDisabled}
        onPress={onLikePress}
      >
        <Ionicons
          name={
            liked
              ? "heart"
              : "heart-outline"
          }
          size={32}
          color={
            liked
              ? colors.accent
              : "#FFFFFF"
          }
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    left:
      layout.screenHorizontalPadding,
    right:
      layout.screenHorizontalPadding,
    bottom: 18,

    flexDirection: "row",
    alignItems: "center",

    gap: 12,

    zIndex: 25,
  },

  composer: {
    flex: 1,
  },

  likeButton: {
    width: 44,
    height: 44,

    alignItems: "center",
    justifyContent: "center",
  },

  likeDisabled: {
    opacity: 0.5,
  },
});