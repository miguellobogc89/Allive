// src/components/live/broadcast/more-menu/LiveBroadcastMoreMenu.tsx

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useEffect,
  useRef,
} from "react";

import {
  Animated,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

type LiveBroadcastMoreMenuProps = {
  visible: boolean;

  audienceMode:
    | "public"
    | "followers";

  commentsEnabled: boolean;

  onEdit: () => void;
  onToggleAudience: () => void;
  onToggleComments: () => void;
};

export function LiveBroadcastMoreMenu({
  visible,
  audienceMode,
  commentsEnabled,
  onEdit,
  onToggleAudience,
  onToggleComments,
}: LiveBroadcastMoreMenuProps) {
  const {
    width,
  } = useWindowDimensions();

  const scale = Math.min(
    1.08,
    Math.max(
      0.90,
      width / 400,
    ),
  );

  /*
   * DEBE coincidir con BottomNav.
   */
  const horizontalInset =
    16 * scale;

  const bottomInset =
    14 * scale;

  const controlAreaHeight =
    64 * scale;

  const availableWidth =
    width -
    horizontalInset * 2;

  const columnWidth =
    availableWidth / 5;

  /*
   * Centro exacto de la quinta columna.
   *
   * Al usar este mismo cálculo que BottomNav,
   * el menú queda matemáticamente alineado
   * con el botón "...".
   */
const actionSize =
  42 * scale;

const actionGap =
  8 * scale;

const menuBottom =
  bottomInset +
  controlAreaHeight +
  8 * scale;

/*
 * El menú ocupa exactamente la quinta
 * columna de BottomNav.
 *
 * No calculamos el centro del botón:
 * reutilizamos físicamente su columna.
 */
const menuLeft =
  horizontalInset +
  columnWidth * 4;

  const opacity =
    useRef(
      new Animated.Value(0),
    ).current;

  const translateY =
    useRef(
      new Animated.Value(12),
    ).current;

  useEffect(() => {
    opacity.stopAnimation();
    translateY.stopAnimation();

    if (visible) {
      opacity.setValue(0);
      translateY.setValue(
        12 * scale,
      );

      Animated.parallel([
        Animated.timing(
          opacity,
          {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          },
        ),

        Animated.timing(
          translateY,
          {
            toValue: 0,
            duration: 210,
            useNativeDriver: true,
          },
        ),
      ]).start();

      return;
    }

    Animated.parallel([
      Animated.timing(
        opacity,
        {
          toValue: 0,
          duration: 140,
          useNativeDriver: true,
        },
      ),

      Animated.timing(
        translateY,
        {
          toValue:
            -8 * scale,

          duration: 150,
          useNativeDriver: true,
        },
      ),
    ]).start();
  }, [
    visible,
    opacity,
    translateY,
    scale,
  ]);

  return (
    <Animated.View
      pointerEvents={
        visible
          ? "auto"
          : "none"
      }
      style={[
        styles.container,

    
{
  left: menuLeft,
  bottom: menuBottom,

  width: columnWidth,

  gap: actionGap,

  opacity,

  transform: [
    {
      translateY,
    },
  ],
},
      ]}
    >
<TechnicalAction
  icon="flash-outline"
  size={actionSize}
  iconSize={20 * scale}
  onPress={() => {}}
/>

<TechnicalAction
  icon="create-outline"
  size={actionSize}
  iconSize={20 * scale}
  onPress={onEdit}
/>

<TechnicalAction
  icon={
    audienceMode === "public"
      ? "globe-outline"
      : "people"
  }
  size={actionSize}
  iconSize={20 * scale}
  active={
    audienceMode === "followers"
  }
  onPress={onToggleAudience}
/>

<TechnicalAction
  icon={
    commentsEnabled
      ? "chatbubble-ellipses-outline"
      : "chatbubble-ellipses"
  }
  size={actionSize}
  iconSize={20 * scale}
  active={!commentsEnabled}
  onPress={onToggleComments}
/>
    </Animated.View>
  );
}

type TechnicalActionProps = {
  icon:
    React.ComponentProps<
      typeof Ionicons
    >["name"];

  size: number;
  iconSize: number;

  active?: boolean;

  onPress: () => void;
};

function TechnicalAction({
  icon,
  size,
  iconSize,
  active = false,
  onPress,
}: TechnicalActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({
        pressed,
      }) => [
        styles.action,

        {
          width: size,
          height: size,
          borderRadius:
            size / 2,
        },

        active
          ? styles.actionActive
          : null,

        pressed
          ? styles.actionPressed
          : null,
      ]}
    >
      <Ionicons
        name={icon}
        size={iconSize}
        color={
          active
            ? "#FFFFFF"
            : "rgba(255,255,255,0.76)"
        }
      />

      <Animated.View
        style={[
          styles.statusDot,

          active
            ? styles.statusDotActive
            : null,
        ]}
      />
    </Pressable>
  );
}

const styles =
  StyleSheet.create({
    container: {
      position: "absolute",

      alignItems: "center",

      zIndex: 35,
    },

    action: {
      alignItems: "center",
      justifyContent: "center",

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.16)",

      backgroundColor:
        "rgba(12,14,17,0.76)",
    },

    actionActive: {
      borderColor:
        "rgba(255,255,255,0.38)",

      backgroundColor:
        "rgba(24,27,32,0.92)",
    },

    actionPressed: {
      opacity: 0.65,

      transform: [
        {
          scale: 0.94,
        },
      ],
    },

    statusDot: {
      position: "absolute",

      top: 5,
      right: 5,

      width: 4,
      height: 4,

      borderRadius: 2,

      backgroundColor:
        "transparent",
    },

    statusDotActive: {
      backgroundColor:
        "#FFFFFF",
    },
  });