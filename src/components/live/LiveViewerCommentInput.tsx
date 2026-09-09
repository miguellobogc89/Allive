// src/components/live/LiveViewerCommentInput.tsx

import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { colors, iconSizes, radius, spacing } from "../../styles";

type LiveViewerCommentInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
};

export function LiveViewerCommentInput({ value, onChangeText, onSend, placeholder = "Escribe un comentario…", disabled = false }: LiveViewerCommentInputProps) {
  const canSend = !disabled && value.trim().length > 0;

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        editable={!disabled}
        maxLength={280}
        returnKeyType="send"
        onSubmitEditing={() => canSend && onSend()}
        style={styles.input}
      />
      <Pressable style={[styles.sendButton, !canSend && styles.sendButtonDisabled]} disabled={!canSend} onPress={onSend}>
        <Ionicons name="arrow-up" size={iconSizes.md} color={colors.background} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 48, flexDirection: "row", alignItems: "center", gap: spacing.xs, paddingLeft: 15, paddingRight: 6, borderRadius: radius.round, backgroundColor: colors.overlayStrong, borderWidth: 1, borderColor: colors.border },
  input: { flex: 1, color: colors.text, fontSize: 13, outlineStyle: "none" } as any,
  sendButton: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: colors.accent },
  sendButtonDisabled: { opacity: 0.38 },
});
