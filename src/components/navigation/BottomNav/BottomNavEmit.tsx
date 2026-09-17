// src/components/navigation/BottomNav/BottomNavEmit.tsx

import {
  Mic,
  MoreHorizontal,
  RefreshCw,
  Sparkles,
  Square,
} from "lucide-react-native";

import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

type BottomNavEmitProps = {
  isLive: boolean;
  canStart: boolean;
  isConnecting: boolean;
  compact: boolean;

  onStart?: () => void;
  onFinish?: () => void;

  onToggleMicrophone?: () => void;
  onOpenFilters?: () => void;
  onSwitchCamera?: () => void;
  onOpenMore?: () => void;
};

export function BottomNavEmit({
  isLive,
  canStart,
  isConnecting,
  compact,
  onStart,
  onFinish,
  onToggleMicrophone,
  onOpenFilters,
  onSwitchCamera,
  onOpenMore,
}: BottomNavEmitProps) {
  const iconSize =
    compact
      ? 21
      : 23;

  const disabled =
    isConnecting ||
    (!isLive && !canStart);

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Micrófono"
        onPress={onToggleMicrophone}
        style={styles.action}
      >
        <Mic
          size={iconSize}
          color="#FFFFFF"
          strokeWidth={2.2}
        />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Filtros"
        onPress={onOpenFilters}
        style={styles.action}
      >
        <Sparkles
          size={iconSize}
          color="#FFFFFF"
          strokeWidth={2.2}
        />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          isLive
            ? "Finalizar directo"
            : "Iniciar directo"
        }
        disabled={disabled}
        onPress={
          isLive
            ? onFinish
            : onStart
        }
        style={({ pressed }) => [
          styles.liveButton,

          compact &&
            styles.liveButtonCompact,

          disabled &&
            styles.liveButtonDisabled,

          pressed &&
            !disabled &&
            styles.liveButtonPressed,
        ]}
      >
        {isLive ? (
          <Square
            size={
              compact
                ? 15
                : 17
            }
            color="#FFFFFF"
            fill="#FFFFFF"
            strokeWidth={2}
          />
        ) : (
          <View
            style={[
              styles.recordDot,
              compact &&
                styles.recordDotCompact,
            ]}
          />
        )}
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cambiar cámara"
        onPress={onSwitchCamera}
        style={styles.action}
      >
        <RefreshCw
          size={iconSize}
          color="#FFFFFF"
          strokeWidth={2.2}
        />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Más opciones"
        onPress={onOpenMore}
        style={styles.action}
      >
        <MoreHorizontal
          size={
            compact
              ? 23
              : 25
          }
          color="#FFFFFF"
          strokeWidth={2.3}
        />
      </Pressable>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-around",
      paddingHorizontal: 8,
    },

    action: {
      flex: 1,
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },

    liveButton: {
      width: 48,
      height: 40,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 20,

      backgroundColor:
        "#F04444",
    },

    liveButtonCompact: {
      width: 44,
      height: 36,
      borderRadius: 18,
    },

    liveButtonDisabled: {
      opacity: 0.45,
    },

    liveButtonPressed: {
      opacity: 0.78,

      transform: [
        {
          scale: 0.94,
        },
      ],
    },

    recordDot: {
      width: 20,
      height: 20,

      borderRadius: 10,

      backgroundColor:
        "#FFFFFF",
    },

    recordDotCompact: {
      width: 18,
      height: 18,
      borderRadius: 9,
    },
  });