// src/components/navigation/BottomNav/BottomNavEmit.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  Text,
  View,
} from "react-native";
import { colors } from "../../../styles";
import { styles } from "./bottomNav.styles";

type BottomNavEmitProps = {
  startMode: boolean;
  canStart: boolean;
  isConnecting: boolean;
  compact: boolean;
  onPress: () => void;
};

export function BottomNavEmit({
  startMode,
  canStart,
  isConnecting,
  compact,
  onPress,
}: BottomNavEmitProps) {
  const disabled =
    startMode && (!canStart || isConnecting);

  const label = startMode
    ? isConnecting
      ? "INICIANDO"
      : canStart
        ? "INICIAR"
        : "PREPARANDO"
    : "EMITIR";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={4}
      onPress={onPress}
      style={({ pressed }) => [
        styles.emitWrapper,
        compact && styles.emitWrapperCompact,
        disabled && styles.emitDisabled,
        pressed && !disabled && styles.itemPressed,
      ]}
    >
      <View
        style={[
          styles.emitButton,
          startMode && styles.emitButtonStart,
          compact && styles.emitButtonCompact,
        ]}
      >
        <Ionicons
          name={
            isConnecting
              ? "ellipsis-horizontal"
              : startMode
                ? "radio"
                : "videocam"
          }
          size={compact ? 24 : 26}
          color={colors.text}
        />
      </View>

      {!compact && (
        <Text
          numberOfLines={1}
          style={[
            styles.emitLabel,
            startMode && styles.emitLabelActive,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}