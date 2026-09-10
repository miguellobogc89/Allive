// src/components/live/broadcast/header/LiveBroadcastHeader.tsx

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  LivePulse,
} from "./LivePulse";

import {
  LiveStats,
} from "./LiveStats";

import {
  LiveTimer,
} from "./LiveTimer";

type LiveBroadcastHeaderProps = {
  isLive: boolean;
  viewers: number;
  likes: number;
  onFinishLive: () => void;
};

export function LiveBroadcastHeader({
  isLive,
  viewers,
  likes,
}: LiveBroadcastHeaderProps) {
  if (!isLive) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={styles.container}
    >
      <View style={styles.liveStatus}>
        <View style={styles.liveSection}>
          <LivePulse />

          <Text style={styles.liveLabel}>
            LIVE
          </Text>
        </View>

        <View style={styles.timerSection}>
          <LiveTimer />
        </View>
      </View>

      <LiveStats
        viewers={viewers}
        likes={likes}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    top: 14,
    left: 18,
    right: 18,

    height: 38,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    zIndex: 25,
  },

  liveStatus: {
    height: 36,

    flexDirection: "row",
    alignItems: "stretch",

    borderRadius: 10,
    overflow: "hidden",

    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.18)",
  },

  liveSection: {
    paddingHorizontal: 11,

    flexDirection: "row",
    alignItems: "center",

    gap: 6,

    backgroundColor: "#FF3048",
  },

  liveLabel: {
    color: "#FFFFFF",

    fontSize: 12,
    fontWeight: "900",

    letterSpacing: 0.4,
  },

  timerSection: {
    paddingHorizontal: 11,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(30,30,30,0.68)",
  },
});