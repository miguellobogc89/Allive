// src/components/video/viewer/VideoViewerHeader.tsx

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

type VideoViewerMode =
  | "live"
  | "replay";

type VideoViewerHeaderProps = {
  mode: VideoViewerMode;

  viewers?: number | null;

  onClose?: () => void;
};

function formatViewers(
  viewers: number,
) {
  if (viewers >= 1000000) {
    return `${(
      viewers / 1000000
    ).toFixed(1)}M`;
  }

  if (viewers >= 1000) {
    return `${(
      viewers / 1000
    ).toFixed(1)}K`;
  }

  return String(viewers);
}

export function VideoViewerHeader({
  mode,
  viewers = 0,
  onClose,
}: VideoViewerHeaderProps) {
  const safeViewers =
    Math.max(
      0,
      viewers ?? 0,
    );

  return (
    <View
      style={styles.container}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.modeBadge,

          mode === "live"
            ? styles.liveBadge
            : styles.replayBadge,
        ]}
      >
        <Text
          style={styles.modeText}
        >
          {mode === "live"
            ? "LIVE"
            : "REPLAY"}
        </Text>
      </View>

      <View
        style={styles.spacer}
      />

      <View
        style={styles.audienceBadge}
      >
        <Ionicons
          name="eye"
          size={15}
          color="#FFFFFF"
        />

        <Text
          style={styles.audienceText}
        >
          {formatViewers(
            safeViewers,
          )}
        </Text>
      </View>

      {onClose ? (
        <Pressable
          onPress={onClose}
          hitSlop={12}
          style={({ pressed }) => [
            styles.closeButton,

            pressed &&
              styles.closeButtonPressed,
          ]}
        >
          <Ionicons
            name="close"
            size={25}
            color="#FFFFFF"
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      width: "100%",

      flexDirection: "row",
      alignItems: "center",

      paddingHorizontal: 16,
    },

    modeBadge: {
      minHeight: 28,

      paddingHorizontal: 10,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 7,
    },

    liveBadge: {
      backgroundColor:
        "#FF304A",
    },

    replayBadge: {
      backgroundColor:
        "rgba(0, 0, 0, 0.48)",
    },

    modeText: {
      color: "#FFFFFF",

      fontSize: 12,
      fontWeight: "800",

      letterSpacing: 0.2,
    },

    spacer: {
      flex: 1,
    },

    audienceBadge: {
      height: 28,

      flexDirection: "row",
      alignItems: "center",

      gap: 5,

      paddingHorizontal: 9,

      borderRadius: 14,

      backgroundColor:
        "rgba(0, 0, 0, 0.48)",
    },

    audienceText: {
      color: "#FFFFFF",

      fontSize: 12,
      fontWeight: "700",
    },

    closeButton: {
      width: 36,
      height: 36,

      marginLeft: 5,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 18,

      backgroundColor:
        "rgba(0, 0, 0, 0.28)",
    },

    closeButtonPressed: {
      opacity: 0.65,
    },
  });