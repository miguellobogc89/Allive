// src/components/live/LiveViewerHeader.tsx

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  colors,
  controls,
  spacing,
  typography,
} from "../../styles";

import {
  LiveViewerAudience,
} from "./LiveViewerAudience";

import type {
  LiveAudience,
} from "./liveAudience";

type Props = {
  audience: LiveAudience;
  audienceOpen: boolean;
  onAudienceToggle: () => void;
};

export function LiveViewerHeader({
  audience,
  audienceOpen,
  onAudienceToggle,
}: Props) {
  return (
    <View style={styles.container}>
      <View
        style={styles.liveBadge}
        pointerEvents="none"
      >
        <View
          style={styles.liveDot}
        />

        <Text
          style={styles.liveText}
        >
          LIVE
        </Text>
      </View>

      <LiveViewerAudience
        audience={audience}
        open={audienceOpen}
        onToggle={
          onAudienceToggle
        }
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      position: "absolute",

      top: 18,

      left: spacing.md,

      flexDirection: "row",

      alignItems: "center",

      gap: spacing.xs,

      zIndex: 30,
    },

    liveBadge: {
      height:
        controls.compactBadgeHeight,

      paddingHorizontal: 10,

      borderRadius: 9,

      flexDirection: "row",

      alignItems: "center",

      gap: 6,

      backgroundColor:
        colors.live,
    },

    liveDot: {
      width:
        controls.badgeDotSize,

      height:
        controls.badgeDotSize,

      borderRadius: 4,

      backgroundColor:
        colors.text,
    },

    liveText: {
      color: colors.text,

      fontSize:
        typography.caption
          .fontSize,

      fontWeight: "900",

      letterSpacing: 0.4,
    },
  });