// src/components/live/broadcast/more-menu/LiveBroadcastMoreMenu.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  useEffect,
  useRef,
} from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
} from "react-native";

type LiveBroadcastMoreMenuProps = {
  visible: boolean;

  audienceMode: "public" | "followers";
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
      translateY.setValue(12);

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
          toValue: -8,
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
      <TechnicalAction
        icon="create-outline"
        onPress={onEdit}
      />

      <TechnicalAction
        icon={
          audienceMode ===
          "public"
            ? "globe-outline"
            : "people"
        }
        active={
          audienceMode ===
          "followers"
        }
        onPress={
          onToggleAudience
        }
      />

      <TechnicalAction
        icon={
          commentsEnabled
            ? "chatbubble-ellipses-outline"
            : "chatbubble-ellipses"
        }
        active={
          !commentsEnabled
        }
        onPress={
          onToggleComments
        }
      />
    </Animated.View>
  );
}

type TechnicalActionProps = {
  icon:
    React.ComponentProps<
      typeof Ionicons
    >["name"];

  active?: boolean;

  onPress: () => void;
};

function TechnicalAction({
  icon,
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
        size={20}
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

      right: 22,
      bottom: 92,

      gap: 8,

      zIndex: 35,
    },

    action: {
      width: 42,
      height: 42,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 9,

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