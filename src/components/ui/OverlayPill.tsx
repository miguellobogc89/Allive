// src/components/ui/OverlayPill.tsx

import type {
  PropsWithChildren,
} from "react";

import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type OverlayPillProps =
  PropsWithChildren<{
    style?: StyleProp<ViewStyle>;
  }>;

export function OverlayPill({
  children,
  style,
}: OverlayPillProps) {
  return (
    <View
      style={[
        styles.root,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles =
  StyleSheet.create({
    root: {
      minHeight: 32,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      paddingHorizontal: 10,
      paddingVertical: 5,

      borderRadius: 10,

      backgroundColor:
        "rgba(10,12,15,0.48)",
    },
  });