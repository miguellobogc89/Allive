// src/components/live/viewer/header/LiveViewerHeader.tsx

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

type Props = {
  viewers: number;
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

export function LiveViewerHeader({
  viewers,
  onClose,
}: Props) {
  return (
    <View
      style={styles.container}
      pointerEvents="box-none"
    >
      <View
        style={styles.liveBadge}
      >
        <Text
          style={styles.liveText}
        >
          LIVE
        </Text>
      </View>

      <View style={styles.spacer} />

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
          {formatViewers(viewers)}
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

    liveBadge: {
      minHeight: 28,

      paddingHorizontal: 10,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 7,

      backgroundColor:
        "#FF304A",
    },

    liveText: {
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