// src/components/ui/LiquidSurface.tsx

import type {
  ReactNode,
  RefObject,
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
  blurTarget?: RefObject<View | null>;
};

export function LiquidSurface({
  children,
  style,
  variant = "dark",
  blurTarget,
}: LiquidSurfaceProps) {
  const isDark =
    variant === "dark";

  return (
    <BlurView
      blurTarget={blurTarget}
      blurMethod="dimezisBlurView"
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