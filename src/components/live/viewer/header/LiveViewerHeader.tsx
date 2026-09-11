// src/components/live/viewer/header/LiveViewerHeader.tsx

import {
  StyleSheet,
  View,
} from "react-native";

import {
  spacing,
} from "../../../../styles";

import {
  LiveStats,
} from "../../broadcast/header/LiveStats";

type Props = {
  viewers: number;
  likes: number;
};

export function LiveViewerHeader({
  viewers,
  likes,
}: Props) {
  return (
    <View
      style={styles.container}
      pointerEvents="box-none"
    >
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
      width: "100%",

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "flex-end",

      paddingHorizontal:
        spacing.md,
    },
  });