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

  onCommentChange: (value: string) => void;
  onCommentSend: () => void;
  onLikePress: () => void;
  onSharePress?: () => void;
};

export function LiveViewerBottomBar({
  commentValue,
  commentDisabled = false,
  liked,
  likeDisabled = false,
  onCommentChange,
  onCommentSend,
  onLikePress,
  onSharePress,
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

      {onSharePress ? (
        <Pressable
          style={styles.action}
          onPress={onSharePress}
        >
          <Ionicons
            name="arrow-redo-outline"
            size={27}
            color="#FFFFFF"
          />
        </Pressable>
      ) : null}

      <Pressable
        style={styles.action}
        disabled={likeDisabled}
        onPress={onLikePress}
      >
        <Ionicons
          name={
            liked
              ? "heart"
              : "heart-outline"
          }
          size={30}
          color={
            liked
              ? colors.live
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
    left: layout.screenHorizontalPadding,
    right: layout.screenHorizontalPadding,
    bottom: layout.liveContentBottom,

    flexDirection: "row",
    alignItems: "center",
    gap: 12,

    zIndex: 25,
  },

  composer: {
    flex: 1,
  },

  action: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
