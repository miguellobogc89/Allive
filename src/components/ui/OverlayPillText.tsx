// src/components/ui/OverlayPillText.tsx

import type {
  PropsWithChildren,
} from "react";

import {
  StyleSheet,
  Text,
  type StyleProp,
  type TextStyle,
} from "react-native";

type OverlayPillTextProps =
  PropsWithChildren<{
    style?: StyleProp<TextStyle>;
  }>;

export function OverlayPillText({
  children,
  style,
}: OverlayPillTextProps) {
  return (
    <Text
      numberOfLines={1}
      style={[
        styles.text,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles =
  StyleSheet.create({
    text: {
      color: "#FFFFFF",

      fontSize: 12,
      fontWeight: "600",

      lineHeight: 16,

      letterSpacing: 0.1,
    },
  });