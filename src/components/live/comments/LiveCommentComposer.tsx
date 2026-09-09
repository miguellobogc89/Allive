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
  onChangeText: (value: string) => void;
  onSend: () => void;
};

export function LiveCommentComposer({
  value,
  disabled = false,
  onChangeText,
  onSend,
}: Props) {
  const canSend =
    !disabled &&
    value.trim().length > 0;

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Escribe un comentario..."
        placeholderTextColor={
          colors.textOnOverlayPlaceholder
        }
        editable={!disabled}
        maxLength={280}
        returnKeyType="send"
        onSubmitEditing={() => {
          if (canSend) {
            onSend();
          }
        }}
        style={styles.input}
      />

      <Pressable
        style={[
          styles.sendButton,
          !canSend
            ? styles.sendButtonDisabled
            : null,
        ]}
        disabled={!canSend}
        onPress={onSend}
      >
        <Ionicons
          name="arrow-up"
          size={iconSizes.md}
          color={colors.background}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    borderRadius: radius.round,
    backgroundColor:
      colors.overlayRaisedStrong,
    borderWidth: 1,
    borderColor:
      colors.dividerOnOverlay,
  },

  input: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    outlineStyle: "none",
  } as any,

  sendButton: {
    width: 38,
    height: 38,
    borderRadius: radius.round,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
  },

  sendButtonDisabled: {
    opacity: 0.38,
  },
});
