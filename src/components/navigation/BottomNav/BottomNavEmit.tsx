// src/components/navigation/BottomNav/BottomNavEmit.tsx

import {
  Mic,
  MoreHorizontal,
  RefreshCw,
  Sparkles,
  Video,
} from "lucide-react-native";

import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

type BottomNavEmitProps = {
  canStart: boolean;
  isConnecting: boolean;
  compact: boolean;

  onStart?: () => void;
  onToggleMicrophone?: () => void;
  onOpenFilters?: () => void;
  onSwitchCamera?: () => void;
  onOpenMore?: () => void;
};

export function BottomNavEmit({
  canStart,
  isConnecting,
  compact,
  onStart,
  onToggleMicrophone,
  onOpenFilters,
  onSwitchCamera,
  onOpenMore,
}: BottomNavEmitProps) {
  const iconSize =
    compact
      ? 21
      : 23;

  const startDisabled =
    !canStart ||
    isConnecting;

  return (
    <View style={styles.container}>
      <EmitAction
        label="Micrófono"
        onPress={onToggleMicrophone}
      >
        <Mic
          size={iconSize}
          color="#FFFFFF"
          strokeWidth={2.3}
        />
      </EmitAction>

      <EmitAction
        label="Filtros"
        onPress={onOpenFilters}
      >
        <Sparkles
          size={iconSize}
          color="#FFFFFF"
          strokeWidth={2.3}
        />
      </EmitAction>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          isConnecting
            ? "Iniciando directo"
            : "Iniciar directo"
        }
        accessibilityState={{
          disabled: startDisabled,
        }}
        disabled={startDisabled}
        onPress={onStart}
        style={({ pressed }) => [
          styles.action,
          pressed &&
            !startDisabled &&
            styles.pressed,
        ]}
      >
        <View
          style={[
            styles.startButton,
            compact &&
              styles.startButtonCompact,
            startDisabled &&
              styles.disabled,
          ]}
        >
          <Video
            size={iconSize}
            color="#FFFFFF"
            strokeWidth={2.5}
          />
        </View>
      </Pressable>

      <EmitAction
        label="Cambiar cámara"
        onPress={onSwitchCamera}
      >
        <RefreshCw
          size={iconSize}
          color="#FFFFFF"
          strokeWidth={2.3}
        />
      </EmitAction>

      <EmitAction
        label="Más opciones"
        onPress={onOpenMore}
      >
        <MoreHorizontal
          size={iconSize + 2}
          color="#FFFFFF"
          strokeWidth={2.4}
        />
      </EmitAction>
    </View>
  );
}

type EmitActionProps = {
  label: string;
  onPress?: () => void;
  children: React.ReactNode;
};

function EmitAction({
  label,
  onPress,
  children,
}: EmitActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        pressed &&
          styles.pressed,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      height: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    action: {
      flex: 1,
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },

    startButton: {
      width: 45,
      height: 39,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      backgroundColor:
        "rgba(255,59,48,0.88)",
    },

    startButtonCompact: {
      width: 41,
      height: 35,
      borderRadius: 18,
    },

    disabled: {
      opacity: 0.45,
    },

    pressed: {
      opacity: 0.68,
      transform: [
        {
          scale: 0.92,
        },
      ],
    },
  });