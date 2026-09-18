// src/components/navigation/BottomNav/BottomNav.tsx

import type {
  RefObject,
} from "react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Animated,
  View,
} from "react-native";

import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";

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
  BottomNavEmit,
} from "./BottomNavEmit";

import {
  BottomNavLive,
} from "./BottomNavLive";

import {
  BottomNavMain,
} from "./BottomNavMain";

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
  emitMicrophoneEnabled?: boolean;

  onEmitFinish?: () => void;
  onEmitStart?: () => void;
  onEmitToggleMicrophone?: () => void;
  onEmitSwitchCamera?: () => void;
  onEmitOpenFilters?: () => void;
  onEmitOpenMore?: () => void;

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
  emitMicrophoneEnabled = true,
  onEmitStart,
  onEmitFinish,
  onEmitToggleMicrophone,
  onEmitSwitchCamera,
  onEmitOpenFilters,
  onEmitOpenMore,
  compact = false,
  blurTarget,
}: BottomNavProps) {
  const insets =
    useSafeAreaInsets();

  const isEmit =
    mode === "emit";

  const [
    emitLayerMounted,
    setEmitLayerMounted,
  ] = useState(isEmit);

  const mainOpacity =
    useRef(
      new Animated.Value(
        isEmit ? 0 : 1,
      ),
    ).current;

  const mainTranslateY =
    useRef(
      new Animated.Value(
        isEmit ? 24 : 0,
      ),
    ).current;

  const emitOpacity =
    useRef(
      new Animated.Value(
        isEmit ? 1 : 0,
      ),
    ).current;

  useEffect(() => {
    mainOpacity.stopAnimation();
    mainTranslateY.stopAnimation();
    emitOpacity.stopAnimation();

    if (isEmit) {
      setEmitLayerMounted(true);

      /*
       * Primero desaparece la navegación
       * principal hacia abajo.
       */
      Animated.parallel([
        Animated.timing(
          mainOpacity,
          {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          },
        ),

        Animated.timing(
          mainTranslateY,
          {
            toValue: 28,
            duration: 180,
            useNativeDriver: true,
          },
        ),
      ]).start();

      /*
       * Los controles de emisión aparecen
       * ligeramente después.
       */
      emitOpacity.setValue(0);

      Animated.timing(
        emitOpacity,
        {
          toValue: 1,
          duration: 190,
          delay: 100,
          useNativeDriver: true,
        },
      ).start();

      return;
    }

    /*
     * Al salir de Emitir hacemos
     * exactamente la transición inversa.
     */
    Animated.timing(
      emitOpacity,
      {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      },
    ).start(() => {
      setEmitLayerMounted(false);
    });

    mainOpacity.setValue(0);
    mainTranslateY.setValue(28);

    Animated.parallel([
      Animated.timing(
        mainOpacity,
        {
          toValue: 1,
          duration: 190,
          delay: 70,
          useNativeDriver: true,
        },
      ),

      Animated.timing(
        mainTranslateY,
        {
          toValue: 0,
          duration: 210,
          delay: 70,
          useNativeDriver: true,
        },
      ),
    ]).start();
  }, [
    isEmit,
    emitOpacity,
    mainOpacity,
    mainTranslateY,
  ]);

  /*
   * Replay sigue sin utilizar BottomNav.
   */
  if (mode === "replay") {
    return null;
  }

  const pillHeight =
    compact
      ? 50
      : 58;

  /*
   * LIVE viewer mantiene de momento
   * su comportamiento existente.
   */
  if (mode === "live") {
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
          <BottomNavLive />
        </LiquidSurface>
      </View>
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

      {/* NAVEGACIÓN NORMAL */}
      <Animated.View
        pointerEvents={
          isEmit
            ? "none"
            : "auto"
        }
        style={[
          styles.animatedLayer,

          {
            height: pillHeight,
            opacity: mainOpacity,

            transform: [
              {
                translateY:
                  mainTranslateY,
              },
            ],
          },
        ]}
      >
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
        </LiquidSurface>
      </Animated.View>

      {/* CONTROLES DE EMISIÓN */}
      {emitLayerMounted ? (
        <Animated.View
          pointerEvents={
            isEmit
              ? "auto"
              : "none"
          }
          style={[
            styles.animatedLayer,
            styles.emitLayer,

            {
              height: pillHeight,
              opacity: emitOpacity,
            },
          ]}
        >
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
            microphoneEnabled={
              emitMicrophoneEnabled
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
            onToggleMicrophone={
              onEmitToggleMicrophone
            }
            onSwitchCamera={
              onEmitSwitchCamera
            }
            onOpenFilters={
              onEmitOpenFilters
            }
            onOpenMore={
              onEmitOpenMore
            }
          />
        </Animated.View>
      ) : null}

{/* CONTROLES DE EMISIÓN */}
{emitLayerMounted ? (
  <Animated.View
    pointerEvents={
      isEmit
        ? "auto"
        : "none"
    }
    style={[
      styles.animatedLayer,
      styles.emitLayer,

      {
        height: pillHeight,
        opacity: emitOpacity,
      },
    ]}
  >
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
      microphoneEnabled={
        emitMicrophoneEnabled
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
      onToggleMicrophone={
        onEmitToggleMicrophone
      }
      onSwitchCamera={
        onEmitSwitchCamera
      }
      onOpenFilters={
        onEmitOpenFilters
      }
      onOpenMore={
        onEmitOpenMore
      }
    />
  </Animated.View>
) : null}
    </View>
  );
}