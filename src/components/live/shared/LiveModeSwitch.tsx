// src/components/live/shared/LiveModeSwitch.tsx

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  OverlayPill,
} from "../../ui";

type LiveMode =
  | "live"
  | "replay";

type LiveModeSwitchProps = {
  mode: LiveMode;
  onLivePress?: () => void;
  onReplayPress?: () => void;
};

export function LiveModeSwitch({
  mode,
  onLivePress,
  onReplayPress,
}: LiveModeSwitchProps) {
  return (
    <OverlayPill
      style={styles.container}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ver directos"
        onPress={onLivePress}
        style={[
          styles.option,
          mode === "live"
            ? styles.liveActive
            : null,
        ]}
      >
        <View
          style={[
            styles.liveDot,
            mode === "live"
              ? styles.liveDotActive
              : null,
          ]}
        />

        <Text
          style={[
            styles.text,
            mode === "live"
              ? styles.activeText
              : styles.inactiveText,
          ]}
        >
          LIVE
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ver replays"
        onPress={onReplayPress}
        style={[
          styles.option,
          mode === "replay"
            ? styles.replayActive
            : null,
        ]}
      >
        <Text
          style={[
            styles.text,
            mode === "replay"
              ? styles.activeText
              : styles.inactiveText,
          ]}
        >
          REPLAY
        </Text>
      </Pressable>
    </OverlayPill>
  );
}

const styles =
  StyleSheet.create({
    container: {
      paddingHorizontal: 0,
      paddingVertical: 0,

      gap: 0,

      overflow: "hidden",
    },

    option: {
      minHeight: 32,

      paddingHorizontal: 10,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      gap: 5,

      borderRadius: 10,
    },

    liveActive: {
      backgroundColor:
        "#FF3048",
    },

    replayActive: {
      backgroundColor:
        "#3978F6",
    },

    liveDot: {
      display: "none",

      width: 7,
      height: 7,

      borderRadius: 999,

      backgroundColor:
        "#FFFFFF",
    },

    liveDotActive: {
      display: "flex",
    },

    text: {
      fontSize: 11,
      fontWeight: "700",

      letterSpacing: 0.2,
    },

    activeText: {
      color: "#FFFFFF",
    },

    inactiveText: {
      color:
        "rgba(255,255,255,0.72)",
    },
  });