// src/components/live/broadcast/header/LiveBroadcastHeader.tsx

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  OverlayPill,
} from "../../../ui";

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
      <OverlayPill
        style={styles.liveStatus}
      >
        <View
          style={styles.liveBadge}
        >
          <LivePulse />

          <Text
            style={styles.liveLabel}
          >
            LIVE
          </Text>
        </View>

        <LiveTimer />
      </OverlayPill>

      <LiveStats
        viewers={viewers}
        likes={likes}
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      position: "absolute",

      top: 14,
      left: 18,
      right: 18,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",

      zIndex: 25,
    },

liveStatus: {
  gap: 8,

  paddingLeft: 0,
  paddingVertical: 0,

  overflow: "hidden",
},

liveBadge: {
  alignSelf: "stretch",

  paddingHorizontal: 8,

  flexDirection: "row",
  alignItems: "center",

  gap: 5,

  borderRadius: 10,

  backgroundColor:
    "#FF3048",

  shadowColor: "#000000",
  shadowOffset: {
    width: 5,
    height: 0,
  },
  shadowOpacity: 0.32,
  shadowRadius: 5,

  zIndex: 2,
},

    liveLabel: {
      color: "#FFFFFF",

      fontSize: 11,
      fontWeight: "700",

      letterSpacing: 0.2,
    },
  });