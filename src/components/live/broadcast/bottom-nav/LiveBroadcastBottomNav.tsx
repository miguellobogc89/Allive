// src/components/live/broadcast/bottom-nav/LiveBroadcastBottomNav.tsx

import {
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import {
  CameraSwitchControl,
} from "./CameraSwitchControl";

import {
  FiltersControl,
} from "./FiltersControl";

import {
  MicrophoneControl,
} from "./MicrophoneControl";

import {
  MoreControl,
} from "./MoreControl";

import {
  StopLiveControl,
} from "./StopLiveControl";

type LiveBroadcastBottomNavProps = {
  isLive: boolean;
  isConnecting: boolean;
  cameraReady: boolean;
  microphoneEnabled: boolean;
  moreEnabled?: boolean;
  microphoneControlEnabled?: boolean;
  filtersEnabled?: boolean;
  cameraSwitchEnabled?: boolean;

  onOpenMore: () => void;
  onToggleMicrophone: () => void;
  onOpenFilters: () => void;
  onSwitchCamera: () => void;
  onStartLive: () => void;
  onFinishLive: () => void;
};

export function LiveBroadcastBottomNav(
  props: LiveBroadcastBottomNavProps,
) {
  const {
    width,
    height,
  } = useWindowDimensions();

  const landscape = width > height;

  /*
   * Escalado deliberadamente limitado.
   *
   * 320 px -> 0.90
   * 360 px -> 0.90
   * 390 px -> 0.975
   * 400 px -> 1.00
   * 432 px -> 1.08
   *
   * Evitamos que un móvil muy grande produzca
   * controles desproporcionados.
   */
  const scale = Math.min(
    1.08,
    Math.max(
      0.90,
      width / 400,
    ),
  );

  const horizontalInset =
    16 * scale;

  const bottomInset =
    14 * scale;

  const controlAreaHeight =
    64 * scale;

  /*
   * Las cinco acciones viven siempre en
   * cinco columnas idénticas.
   *
   * Esto es importante porque la columna 5
   * será también el eje del menú desplegable.
   */
  const availableWidth =
    width -
    horizontalInset * 2;

  const columnWidth =
    availableWidth / 5;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.root,

        landscape
          ? styles.rootLandscape
          : null,

        {
          paddingHorizontal:
            horizontalInset,

          paddingBottom:
            bottomInset,
        },
      ]}
    >
      <View
        style={[
          styles.controls,

          {
            height:
              controlAreaHeight,
          },
        ]}
      >
        <View
          style={[
            styles.controlSlot,
            {
              width: columnWidth,
            },
          ]}
        >
          <MicrophoneControl
            enabled={
              props.microphoneEnabled
            }
            onPress={
              props.onToggleMicrophone
            }
            disabled={
              props.microphoneControlEnabled ===
              false
            }
          />
        </View>

        <View
          style={[
            styles.controlSlot,
            {
              width: columnWidth,
            },
          ]}
        >
          <FiltersControl
            onPress={
              props.onOpenFilters
            }
            disabled={
              props.filtersEnabled ===
              false
            }
          />
        </View>

        <View
          style={[
            styles.controlSlot,
            {
              width: columnWidth,
            },
          ]}
        >
          <StopLiveControl
            onPress={
              props.onFinishLive
            }
          />
        </View>

        <View
          style={[
            styles.controlSlot,
            {
              width: columnWidth,
            },
          ]}
        >
          <CameraSwitchControl
            onPress={
              props.onSwitchCamera
            }
            disabled={
              props.cameraSwitchEnabled ===
              false
            }
          />
        </View>

        <View
          style={[
            styles.controlSlot,
            {
              width: columnWidth,
            },
          ]}
        >
          <MoreControl
            onPress={
              props.onOpenMore
            }
            disabled={
              props.moreEnabled ===
              false
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    root: {
      position: "absolute",

      left: 0,
      right: 0,
      bottom: 0,

      zIndex: 20,

      justifyContent:
        "flex-end",

      /*
       * IMPORTANTE:
       * ninguna superficie de fondo.
       * El vídeo continúa visualmente
       * hasta el límite inferior.
       */
      backgroundColor:
        "transparent",
    },

    rootLandscape: {
      /*
       * Por ahora no cambiamos la geometría
       * horizontal. La refinaremos cuando
       * trabajemos específicamente landscape.
       */
    },

    controls: {
      width: "100%",

      flexDirection: "row",

      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        "transparent",
    },

    controlSlot: {
      height: "100%",

      alignItems: "center",
      justifyContent: "center",
    },
  });