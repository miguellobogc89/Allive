// src/components/live/broadcast/header/LiveBroadcastHeader.tsx

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { FinishLiveButton } from "./FinishLiveButton";
import { LivePulse } from "./LivePulse";
import { LiveStats } from "./LiveStats";
import { LiveTimer } from "./LiveTimer";

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
  onFinishLive,
}: LiveBroadcastHeaderProps) {
  if (!isLive) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={styles.container}
    >
      <View style={styles.livePill}>
        <LivePulse />
        <Text style={styles.liveLabel}>
          LIVE
        </Text>
        <LiveTimer />
      </View>

      <View
        pointerEvents="none"
        style={styles.centerStats}
      >
        <LiveStats
          viewers={viewers}
          likes={likes}
        />
      </View>

      <View style={styles.finish}>
        <FinishLiveButton
          onPress={onFinishLive}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 16,
    left: 18,
    right: 18,
    zIndex: 25,

    height: 46,

    flexDirection: "row",
    alignItems: "center",
  },

  livePill: {
    height: 38,
    paddingHorizontal: 13,
    borderRadius: 19,

    flexDirection: "row",
    alignItems: "center",
    gap: 9,

    backgroundColor: "#FF3048",
  },

  liveLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.4,
  },

  centerStats: {
    position: "absolute",
    left: 0,
    right: 0,

    alignItems: "center",
    justifyContent: "center",

  },

  finish: {
    marginLeft: "auto",
  },
});
