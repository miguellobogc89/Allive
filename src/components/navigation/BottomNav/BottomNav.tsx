// src/components/navigation/BottomNav/BottomNav.tsx

import type {
  RefObject,
} from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import {
  BottomNavEmit,
} from "./BottomNavEmit";

import {
  type AppTab,
} from "../../../navigation/navigation.types";

import {
  spacing,
} from "../../../styles";

import {
  LiquidSurface,
} from "../../ui/LiquidSurface";

import {
  BottomNavLive,
} from "./BottomNavLive";

import {
  BottomNavMain,
} from "./BottomNavMain";

import {
  BottomNavReplay,
} from "./BottomNavReplay";

import {
  styles,
} from "./bottomNav.styles";

export type BottomNavMode =
  | "main"
  | "live"
  | "replay"
  | "emit";

type BottomNavProps = {
  mode?: BottomNavMode;

  activeTab: AppTab;

  onTabPress: (
    tab: AppTab,
  ) => void;

  emitCanStart?: boolean;

  emitIsConnecting?: boolean;

  emitIsLive?: boolean;

  onEmitFinish?: () => void;

  onEmitStart?: () => void;

  compact?: boolean;

  blurTarget?:
    RefObject<View | null>;
};

export function BottomNav({
  mode = "main",
  activeTab,
  onTabPress,
  emitCanStart = true,
  emitIsConnecting = false,
  emitIsLive = false,
  onEmitStart,
  onEmitFinish,
  compact = false,
  blurTarget,
}: BottomNavProps) {
  const insets =
    useSafeAreaInsets();

  const pillHeight =
    compact
      ? 50
      : 58;

  function renderContent() {
    if (mode === "live") {
      return (
        <BottomNavLive />
      );
    }

    if (
      mode === "replay"
    ) {
      return (
        <BottomNavReplay />
      );
    }

if (mode === "emit") {
  return (
    <BottomNavEmit
      isLive={
        emitIsLive
      }
      canStart={
        emitCanStart
      }
      isConnecting={
        emitIsConnecting
      }
      compact={
        compact
      }
      onStart={
        onEmitStart
      }
      onFinish={
        onEmitFinish
      }
    />
  );
}

    return (
      <BottomNavMain
        activeTab={
          activeTab
        }
        onTabPress={
          onTabPress
        }
        emitCanStart={
          emitCanStart
        }
        emitIsConnecting={
          emitIsConnecting
        }
        onEmitStart={
          onEmitStart
        }
        compact={
          compact
        }
      />
    );
  }

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        compact &&
          styles.containerCompact,
        {
          height:
            pillHeight +
            insets.bottom +
            spacing.md,
          paddingBottom:
            insets.bottom +
            spacing.xs,
        },
      ]}
    >
      <View
        pointerEvents="none"
        style={
          localStyles.debugLabel
        }
      >
        <Text
          style={
            localStyles.debugText
          }
        >
          BOTTOMNAV ·{" "}
          {mode.toUpperCase()}
        </Text>
      </View>

      <LiquidSurface
        variant="dark"
        blurTarget={
          blurTarget
        }
        style={[
          styles.pill,
          compact &&
            styles.pillCompact,
        ]}
      >
        {renderContent()}
      </LiquidSurface>
    </View>
  );
}

const localStyles =
  StyleSheet.create({
    debugLabel: {
      position: "absolute",
      bottom: "100%",
      alignSelf: "center",

      paddingHorizontal: 9,
      paddingVertical: 4,

      marginBottom: 3,

      borderRadius: 6,

      backgroundColor:
        "rgba(255,255,255,0.92)",

      zIndex: 100,
    },

    debugText: {
      color: "#000000",
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 0.5,
    },
  });