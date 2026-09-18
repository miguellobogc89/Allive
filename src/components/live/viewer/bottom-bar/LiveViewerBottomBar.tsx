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
    <View
      style={
        styles.container
      }
    >
      <View
        style={
          styles.composer
        }
      >
        <LiveCommentComposer
          value={
            commentValue
          }
          disabled={
            commentDisabled
          }
          onChangeText={
            onCommentChange
          }
          onSend={
            onCommentSend
          }
        />
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.likeButton,

          likeDisabled
            ? styles.likeDisabled
            : null,

          pressed
            ? styles.pressed
            : null,
        ]}
        disabled={
          likeDisabled
        }
        onPress={
          onLikePress
        }
      >
        <Ionicons
          name={
            liked
              ? "heart"
              : "heart-outline"
          }
          size={28}
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

const styles =
  StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",

      flexDirection: "row",
      alignItems: "center",

      gap: 10,
    },

    composer: {
      flex: 1,

      minWidth: 0,

      justifyContent:
        "center",
    },

    likeButton: {
      height: "100%",
      aspectRatio: 1,

      alignItems: "center",
      justifyContent: "center",
    },

    likeDisabled: {
      opacity: 0.5,
    },

    pressed: {
      opacity: 0.65,
    },
  });