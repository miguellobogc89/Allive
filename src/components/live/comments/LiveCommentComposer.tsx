// src/components/live/comments/LiveCommentComposer.tsx

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import {
  colors,
  iconSizes,
  radius,
  spacing,
} from "../../../styles";

type Props = {
  value: string;
  disabled?: boolean;
  onChangeText: (
    value: string,
  ) => void;
  onSend: () => void;
};

export function LiveCommentComposer({
  value,
  disabled = false,
  onChangeText,
  onSend,
}: Props) {
  const hasText =
    value.trim().length > 0;

  const canSend =
    !disabled && hasText;

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Escribe un comentario…"
        placeholderTextColor={
          colors.textOnOverlayPlaceholder
        }
        editable={!disabled}
        maxLength={280}
        returnKeyType={
          hasText
            ? "send"
            : "default"
        }
        onSubmitEditing={() => {
          if (canSend) {
            onSend();
          }
        }}
        style={styles.input}
      />

      {hasText ? (
        <Pressable
          style={[
            styles.sendButton,
            disabled
              ? styles.disabled
              : null,
          ]}
          disabled={!canSend}
          onPress={onSend}
        >
          <Ionicons
            name="arrow-up"
            size={iconSizes.md}
            color="#FFFFFF"
          />
        </Pressable>
      ) : (
        <Pressable
          style={styles.reactionButton}
          disabled={disabled}
        >
          <Ionicons
            name="happy-outline"
            size={24}
            color="#FFFFFF"
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,

    flexDirection: "row",
    alignItems: "center",

    gap: spacing.xs,

    paddingLeft: spacing.md,
    paddingRight: spacing.xs,

    borderRadius: radius.round,

    backgroundColor:
      "rgba(0,0,0,0.38)",

    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.38)",
  },

  input: {
    flex: 1,

    color: colors.text,
    fontSize: 13,

    borderWidth: 0,
    outlineWidth: 0,
  },

  sendButton: {
    width: 36,
    height: 36,

    borderRadius: radius.round,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      colors.accent,
  },

  reactionButton: {
    width: 36,
    height: 36,

    alignItems: "center",
    justifyContent: "center",
  },

  disabled: {
    opacity: 0.45,
  },
});