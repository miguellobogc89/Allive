// src/components/navigation/BottomNav/BottomNavEmit.tsx

import {
  CircleDot,
  LoaderCircle,
  Video,
} from "lucide-react-native";

import {
  Pressable,
  View,
} from "react-native";

import {
  colors,
} from "../../../styles";

import {
  styles,
} from "./bottomNav.styles";

import {
  BottomNavEmitBorder,
} from "./BottomNavEmitBorder";

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
    startMode &&
    (!canStart ||
      isConnecting);

  const accessibilityLabel =
    startMode
      ? isConnecting
        ? "Iniciando directo"
        : canStart
          ? "Iniciar directo"
          : "Preparando directo"
      : "Emitir";

  const EmitIcon =
    isConnecting
      ? LoaderCircle
      : startMode
        ? CircleDot
        : Video;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel
      }
      accessibilityState={{
        disabled,
      }}
      disabled={disabled}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [
        styles.emitWrapper,
        compact &&
          styles.emitWrapperCompact,
        disabled &&
          styles.emitDisabled,
        pressed &&
          !disabled &&
          styles.itemPressed,
      ]}
    >
      <View
        style={[
          styles.emitButton,
          startMode &&
            styles.emitButtonStart,
          compact &&
            styles.emitButtonCompact,
        ]}
      >
        <BottomNavEmitBorder />

        <EmitIcon
          size={
            compact
              ? 21
              : 23
          }
          color={colors.text}
          strokeWidth={2.4}
        />
      </View>
    </Pressable>
  );
}