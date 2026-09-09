// src/components/live/LiveCommentInput.tsx

import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

type LiveCommentInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
};

export function LiveCommentInput({ value, onChangeText, onSend, placeholder = "Escribe un comentario…", disabled = false }: LiveCommentInputProps) {
  const canSend = !disabled && value.trim().length > 0;

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.55)"
        editable={!disabled}
        maxLength={280}
        returnKeyType="send"
        onSubmitEditing={() => canSend && onSend()}
        style={styles.input}
      />
      <Pressable style={[styles.sendButton, !canSend && styles.sendButtonDisabled]} disabled={!canSend} onPress={onSend}>
        <Ionicons name="arrow-up" size={20} color="#08090A" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 48, flexDirection: "row", alignItems: "center", gap: 8, paddingLeft: 15, paddingRight: 6, borderRadius: 24, backgroundColor: "rgba(15,16,18,0.76)", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)" },
  input: { flex: 1, color: "#FFFFFF", fontSize: 13, outlineStyle: "none" } as any,
  sendButton: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "#7CFF6B" },
  sendButtonDisabled: { opacity: 0.38 },
});
