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
  StyleSheet,
  View,
} from "react-native";

import {
  type AppTab,
} from "../../../navigation/navigation.types";

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

  if (mode === "replay") {
    return null;
  }

  /*
   * Desde este momento BottomNav NO conoce:
   *
   * - tamaño de pantalla
   * - safe area
   * - posición bottom
   * - márgenes exteriores
   *
   * Solo ocupa el 100% de la zona
   * que AppOverlayLayout le entrega.
   */
  if (mode === "live") {
    return (
      <View
        pointerEvents="box-none"
        style={styles.root}
      >
        <LiquidSurface
          variant="dark"
          blurTarget={
            blurTarget
          }
          style={styles.mainSurface}
        >
          <BottomNavLive />
        </LiquidSurface>
      </View>
    );
  }

  return (
    <View
      pointerEvents="box-none"
      style={styles.root}
    >
      {/* NAVEGACIÓN NORMAL */}
      <Animated.View
        pointerEvents={
          isEmit
            ? "none"
            : "auto"
        }
        style={[
          styles.layer,

          {
            opacity:
              mainOpacity,

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
            styles.mainSurface,

            compact &&
              styles.mainSurfaceCompact,
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
            styles.layer,
            styles.emitLayer,

            {
              opacity:
                emitOpacity,
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

const styles =
  StyleSheet.create({
    root: {
      width: "100%",
      height: "100%",
      position: "relative",
    },

    layer: {
      ...StyleSheet.absoluteFill,

      alignItems: "stretch",
      justifyContent: "center",
    },

    mainSurface: {
      width: "100%",
      height: "100%",

      flexDirection: "row",
      alignItems: "center",

      borderRadius: 999,
    },

    mainSurfaceCompact: {
      width: "100%",
      height: "100%",
    },

    /*
     * Emitir no tiene fondo.
     * El componente ocupa exactamente
     * la misma caja que BottomNavMain.
     */
    emitLayer: {
      backgroundColor:
        "transparent",
    },
  });