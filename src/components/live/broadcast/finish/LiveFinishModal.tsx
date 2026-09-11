// src/components/live/broadcast/finish/LiveFinishModal.tsx

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useEffect,
  useRef,
} from "react";

import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  colors,
  spacing,
} from "../../../../styles";

type LiveFinishModalProps = {
  visible: boolean;

  saving?: boolean;
  discarding?: boolean;

  onSave: () => void;
  onDiscard: () => void;
};

export function LiveFinishModal({
  visible,

  saving = false,
  discarding = false,

  onSave,
  onDiscard,
}: LiveFinishModalProps) {
  const opacity =
    useRef(
      new Animated.Value(0),
    ).current;

  const translateY =
    useRef(
      new Animated.Value(14),
    ).current;

  useEffect(() => {
    if (!visible) {
      opacity.setValue(0);
      translateY.setValue(14);

      return;
    }

    opacity.stopAnimation();
    translateY.stopAnimation();

    opacity.setValue(0);
    translateY.setValue(14);

    Animated.parallel([
      Animated.timing(
        opacity,
        {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        },
      ),

      Animated.timing(
        translateY,
        {
          toValue: 0,
          duration: 240,
          useNativeDriver: true,
        },
      ),
    ]).start();
  }, [
    visible,
    opacity,
    translateY,
  ]);

  if (!visible) {
    return null;
  }

  const busy =
    saving ||
    discarding;

  return (
    <View
      style={styles.layer}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.backdrop,
          {
            opacity,
          },
        ]}
      />

      <View
        style={
          styles.centerStage
        }
      >
        <Animated.View
          style={[
            styles.card,
            {
              opacity,

              transform: [
                {
                  translateY,
                },
              ],
            },
          ]}
        >
          <View
            style={
              styles.iconContainer
            }
          >
            <Ionicons
              name="checkmark"
              size={24}
              color="#FFFFFF"
            />
          </View>

          <Text
            style={
              styles.title
            }
          >
            Tu directo ha finalizado
          </Text>

          <Text
            style={
              styles.description
            }
          >
            Si guardas el vídeo, podrás visualizarlo durante las próximas 24 horas y descargarlo.
          </Text>

          <Pressable
            accessibilityRole="button"
            disabled={busy}
            onPress={onSave}
            style={({
              pressed,
            }) => [
              styles.saveButton,

              pressed &&
              !busy
                ? styles.saveButtonPressed
                : null,

              busy
                ? styles.disabled
                : null,
            ]}
          >
            <Ionicons
              name="download-outline"
              size={19}
              color="#FFFFFF"
            />

            <Text
              style={
                styles.saveButtonText
              }
            >
              {saving
                ? "Guardando…"
                : "Guardar vídeo"}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={busy}
            onPress={onDiscard}
            style={({
              pressed,
            }) => [
              styles.discardButton,

              pressed &&
              !busy
                ? styles.discardButtonPressed
                : null,

              busy
                ? styles.disabled
                : null,
            ]}
          >
            <Text
              style={
                styles.discardButtonText
              }
            >
              {discarding
                ? "Descartando…"
                : "Descartar"}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    layer: {
      ...StyleSheet.absoluteFill,

      zIndex: 100,
    },

    backdrop: {
      ...StyleSheet.absoluteFill,

      backgroundColor:
        "rgba(0,0,0,0.18)",
    },

    centerStage: {
      ...StyleSheet.absoluteFill,

      alignItems: "center",
      justifyContent: "center",

      paddingHorizontal: 24,
    },

    card: {
      width: "100%",
      maxWidth: 420,

      alignItems: "center",

      padding: spacing.lg,

      borderRadius: 20,

      backgroundColor:
        "rgba(12,14,17,0.86)",
    },

    iconContainer: {
      width: 48,
      height: 48,

      alignItems: "center",
      justifyContent: "center",

      marginBottom: 16,

      borderRadius: 24,

      backgroundColor:
        colors.accent,
    },

    title: {
      color: "#FFFFFF",

      fontSize: 20,
      fontWeight: "700",

      textAlign: "center",
    },

    description: {
      marginTop: 10,
      marginBottom: 24,

      color:
        "rgba(255,255,255,0.65)",

      fontSize: 14,
      fontWeight: "400",
      lineHeight: 20,

      textAlign: "center",
    },

    saveButton: {
      width: "100%",
      minHeight: 48,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      gap: 8,

      borderRadius: 12,

      backgroundColor:
        colors.accent,
    },

    saveButtonPressed: {
      opacity: 0.86,
    },

    saveButtonText: {
      color: "#FFFFFF",

      fontSize: 15,
      fontWeight: "600",
    },

    discardButton: {
      minHeight: 44,

      alignItems: "center",
      justifyContent: "center",

      marginTop: 6,
      paddingHorizontal: 20,
    },

    discardButtonPressed: {
      opacity: 0.65,
    },

    discardButtonText: {
      color:
        "rgba(255,255,255,0.62)",

      fontSize: 14,
      fontWeight: "500",
    },

    disabled: {
      opacity: 0.55,
    },
  });