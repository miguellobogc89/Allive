// src/components/ui/LiquidSurface.tsx

import type {
  ReactNode,
} from "react";

import {
  StyleSheet,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";

import {
  BlurView,
} from "expo-blur";

import {
  surfaces,
} from "../../styles";

import {
  LiquidBorder,
} from "./LiquidBorder";

type LiquidSurfaceProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: "dark" | "light";
};

export function LiquidSurface({
  children,
  style,
  variant = "dark",
}: LiquidSurfaceProps) {
  const isDark =
    variant === "dark";

  return (
    <BlurView
      intensity={
        isDark
          ? 55
          : 60
      }
      tint={
        isDark
          ? "dark"
          : "light"
      }
      experimentalBlurMethod="dimezisBlurView"
      style={[
        isDark
          ? surfaces.liquidDark
          : surfaces.liquidLight,
        style,
      ]}
    >
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          isDark
            ? styles.darkOverlay
            : styles.lightOverlay,
        ]}
      />

      <LiquidBorder
        strength={
          isDark
            ? 1
            : 0.75
        }
      />

      {children}
    </BlurView>
  );
}

const styles =
  StyleSheet.create({
    darkOverlay: {
      backgroundColor:
        "rgba(8,10,14,0.52)",
    },

    lightOverlay: {
      backgroundColor:
        "rgba(255,255,255,0.2)",
    },
  });