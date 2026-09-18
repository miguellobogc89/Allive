// src/components/live/broadcast/more-menu/LiveBroadcastMoreMenu.tsx

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  type LayoutChangeEvent,
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
  const [
    containerWidth,
    setContainerWidth,
  ] = useState(0);

  const [
    containerHeight,
    setContainerHeight,
  ] = useState(0);

  const opacity =
    useRef(
      new Animated.Value(
        visible ? 1 : 0,
      ),
    ).current;

  const translateY =
    useRef(
      new Animated.Value(
        visible ? 0 : 12,
      ),
    ).current;

  function handleLayout(
    event: LayoutChangeEvent,
  ) {
    const {
      width,
      height,
    } = event.nativeEvent.layout;

    setContainerWidth(width);
    setContainerHeight(height);
  }

  /*
   * Todos los tamaños salen de la caja.
   * No de la pantalla.
   */
  const availableItemHeight =
    containerHeight > 0
      ? containerHeight / 4
      : 0;

  const actionSize =
    containerWidth > 0 &&
    availableItemHeight > 0
      ? Math.min(
          containerWidth * 0.82,
          availableItemHeight * 0.78,
        )
      : 40;

  const iconSize =
    actionSize * 0.46;

  useEffect(() => {
    opacity.stopAnimation();
    translateY.stopAnimation();

    if (visible) {
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
          toValue: 10,
          duration: 150,
          useNativeDriver: true,
        },
      ),
    ]).start();
  }, [
    visible,
    opacity,
    translateY,
  ]);

  return (
    <Animated.View
      onLayout={
        handleLayout
      }
      pointerEvents={
        visible
          ? "auto"
          : "none"
      }
      style={[
        styles.container,

        {
          opacity,

          transform: [
            {
              translateY,
            },
          ],
        },
      ]}
    >
      <View
        style={
          styles.actionSlot
        }
      >
        <TechnicalAction
          icon="flash-outline"
          size={actionSize}
          iconSize={iconSize}
          onPress={() => {}}
        />
      </View>

      <View
        style={
          styles.actionSlot
        }
      >
        <TechnicalAction
          icon="create-outline"
          size={actionSize}
          iconSize={iconSize}
          onPress={onEdit}
        />
      </View>

      <View
        style={
          styles.actionSlot
        }
      >
        <TechnicalAction
          icon={
            audienceMode === "public"
              ? "globe-outline"
              : "people"
          }
          size={actionSize}
          iconSize={iconSize}
          active={
            audienceMode ===
            "followers"
          }
          onPress={
            onToggleAudience
          }
        />
      </View>

      <View
        style={
          styles.actionSlot
        }
      >
        <TechnicalAction
          icon={
            commentsEnabled
              ? "chatbubble-ellipses-outline"
              : "chatbubble-ellipses"
          }
          size={actionSize}
          iconSize={iconSize}
          active={
            !commentsEnabled
          }
          onPress={
            onToggleComments
          }
        />
      </View>
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
      onPress={
        onPress
      }
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

      <View
        style={[
          styles.statusDot,

          {
            top:
              actionSizeDotOffset(
                size,
              ),

            right:
              actionSizeDotOffset(
                size,
              ),

            width:
              actionStatusDotSize(
                size,
              ),

            height:
              actionStatusDotSize(
                size,
              ),

            borderRadius:
              actionStatusDotSize(
                size,
              ) / 2,
          },

          active
            ? styles.statusDotActive
            : null,
        ]}
      />
    </Pressable>
  );
}

function actionStatusDotSize(
  size: number,
) {
  return Math.max(
    3,
    size * 0.095,
  );
}

function actionSizeDotOffset(
  size: number,
) {
  return Math.max(
    4,
    size * 0.12,
  );
}

const styles =
  StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",

      alignItems: "stretch",
      justifyContent:
        "space-between",
    },

    actionSlot: {
      flex: 1,

      alignItems: "center",
      justifyContent: "center",
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

      backgroundColor:
        "transparent",
    },

    statusDotActive: {
      backgroundColor:
        "#FFFFFF",
    },
  });