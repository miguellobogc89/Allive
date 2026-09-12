// src/components/BottomNav.tsx

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import {
  colors,
  spacing,
  typography,
} from "../styles";

type BottomNavProps = {
  activeTab: string;

  onTabPress: (
    tab: string,
  ) => void;

  emitCanStart?: boolean;

  emitIsConnecting?: boolean;

  onEmitStart?: () => void;
};

export function BottomNav({
  activeTab,
  onTabPress,
  emitCanStart = true,
  emitIsConnecting = false,
  onEmitStart,
}: BottomNavProps) {
  const insets =
    useSafeAreaInsets();

  const tabs = [
    {
      id: "now",
      label: "NOW",
      icon:
        "play-circle-outline",
    },
    {
      id: "map",
      label: "MAPA",
      icon: "map-outline",
    },
    {
      id: "emit",
      label: "EMITIR",
      icon: "radio-outline",
    },
    {
      id: "search",
      label: "BUSCAR",
      icon: "search-outline",
    },
    {
      id: "profile",
      label: "TÚ",
      icon: "person-outline",
    },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          height:
            66 +
            insets.bottom,

          paddingBottom:
            Math.max(
              insets.bottom,
              8,
            ),
        },
      ]}
    >
      {tabs.map(
        (tab) => {
          const isActive =
            activeTab ===
            tab.id;

          const isEmit =
            tab.id ===
            "emit";

          if (isEmit) {
            const emitStartMode =
              activeTab ===
                "emit" &&
              Boolean(
                onEmitStart,
              );

            return (
              <Pressable
                key={tab.id}
                style={[
                  styles.emitWrapper,

                  emitStartMode &&
                    styles.emitWrapperActive,
                ]}
                disabled={
                  emitStartMode &&
                  (!emitCanStart ||
                    emitIsConnecting)
                }
                onPress={() => {
                  if (
                    emitStartMode
                  ) {
                    onEmitStart?.();

                    return;
                  }

                  onTabPress(
                    tab.id,
                  );
                }}
              >
                <View
                  style={[
                    styles.emitButton,

                    emitStartMode &&
                      styles.emitButtonStart,

                    emitStartMode &&
                      (!emitCanStart ||
                        emitIsConnecting) &&
                      styles.emitButtonDisabled,
                  ]}
                >
                  <View
                    style={
                      styles.emitInner
                    }
                  >
                    <View
                      style={
                        styles.emitDot
                      }
                    />
                  </View>
                </View>

                <Text
                  style={
                    styles.emitLabel
                  }
                >
                  {emitStartMode
                    ? emitIsConnecting
                      ? "INICIANDO"
                      : emitCanStart
                        ? "INICIAR"
                        : "PREPARANDO"
                    : "EMITIR"}
                </Text>
              </Pressable>
            );
          }

          return (
            <Pressable
              key={tab.id}
              style={
                styles.tab
              }
              onPress={() => {
                onTabPress(
                  tab.id,
                );
              }}
            >
              <Ionicons
                name={
                  tab.icon as any
                }
                size={26}
                color={
                  isActive
                    ? colors.text
                    : colors.textOnOverlayMuted
                }
              />

              <Text
                style={[
                  styles.label,

                  isActive
                    ? styles.activeLabel
                    : undefined,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        },
      )}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flexDirection:
        "row",

      alignItems:
        "flex-end",

      justifyContent:
        "space-around",

      paddingHorizontal:
        spacing.xs,

      backgroundColor:
        "#000000",

      zIndex: 100,
    },

    tab: {
      flex: 1,

      height: 58,

      alignItems:
        "center",

      justifyContent:
        "center",

      gap: spacing.xxs,
    },

    label: {
      color:
        colors.textOnOverlayMuted,

      fontSize: 10,

      fontWeight:
        typography.caption
          .fontWeight,
    },

    activeLabel: {
      color:
        colors.text,

      fontWeight:
        "800",
    },

    emitWrapper: {
      flex: 1,

      alignItems:
        "center",

      justifyContent:
        "flex-end",

      transform: [
        {
          translateY: -3,
        },
      ],
    },

    emitWrapperActive: {
      transform: [
        {
          translateY: -7,
        },
      ],
    },

    emitButton: {
      width: 54,
      height: 54,

      borderRadius: 20,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        colors.overlayRaised,

      borderWidth: 2,

      borderColor:
        colors.borderOnOverlay,
    },

    emitButtonStart: {
      backgroundColor:
        colors.live,

      borderColor:
        colors.text,
    },

    emitButtonDisabled: {
      opacity: 0.48,
    },

    emitInner: {
      width: 30,
      height: 30,

      borderRadius: 15,

      alignItems:
        "center",

      justifyContent:
        "center",

      borderWidth: 2,

      borderColor:
        colors.live,
    },

    emitDot: {
      width: 14,
      height: 14,

      borderRadius: 7,

      backgroundColor:
        colors.live,
    },

    emitLabel: {
      marginTop: 3,

      color:
        colors.text,

      fontSize:
        typography.micro
          .fontSize,

      fontWeight:
        "800",
    },
  });