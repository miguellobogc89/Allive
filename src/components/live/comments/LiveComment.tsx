// src/components/live/comments/LiveComment.tsx

import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  colors,
  radius,
  spacing,
  typography,
} from "../../../styles";

import type {
  LiveCommentModel,
} from "./liveCommentTypes";

type Props = {
  comment: LiveCommentModel;
  onPressActor?: (
    userId: string,
  ) => void;
};

export function LiveComment({
  comment,
  onPressActor,
}: Props) {
  const canOpenActor =
    comment.actorType === "user" &&
    Boolean(onPressActor);

  const avatar = comment.avatarUrl ? (
    <Image
      source={{
        uri: comment.avatarUrl,
      }}
      style={styles.avatar}
    />
  ) : (
    <View style={styles.avatarFallback}>
      <Text style={styles.avatarLetter}>
        {comment.username
          .slice(0, 1)
          .toUpperCase()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {canOpenActor ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Abrir perfil"
          onPress={() => {
            onPressActor?.(
              comment.actorId,
            );
          }}
          style={({ pressed }) => [
            styles.avatarButton,
            pressed && styles.pressed,
          ]}
        >
          {avatar}
        </Pressable>
      ) : (
        avatar
      )}

      <Text style={styles.text}>
        <Text style={styles.username}>
          @{comment.username}{" "}
        </Text>
        {comment.body}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.overlaySoft,
  },

  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.overlaySoft,
  },

  avatarButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },

  pressed: {
    opacity: 0.7,
  },

  avatarFallback: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.overlayChrome,
  },

  avatarLetter: {
    color: colors.text,
    fontSize: 10,
    fontWeight: "800",
  },

  text: {
    flexShrink: 1,
    color: colors.text,
    ...typography.label,
    fontWeight: "400",
  },

  username: {
    fontWeight: "800",
  },
});
