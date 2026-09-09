// src/components/BottomNav.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import {
  colors,
  iconSizes,
} from "../styles";

type BottomNavProps = {
  activeTab: string;
  onTabPress: (tab: string) => void;
  emitState?: "idle" | "ready" | "connecting" | "live";
  onEmitAction?: () => void;
};

const tabs = [
  {
    id: "now",
    icon: "play-circle-outline",
    activeIcon: "play-circle",
  },
  {
    id: "map",
    icon: "map-outline",
    activeIcon: "map",
  },
  {
    id: "emit",
    icon: "radio-outline",
    activeIcon: "radio",
  },
  {
    id: "search",
    icon: "search-outline",
    activeIcon: "search",
  },
  {
    id: "profile",
    icon: "person-circle-outline",
    activeIcon: "person-circle",
  },
] as const;

export function BottomNav({
  activeTab,
  onTabPress,
  emitState = "idle",
  onEmitAction,
}: BottomNavProps) {
  const isEmitScreen =
    activeTab === "emit";

  function handleEmitPress() {
    if (
      isEmitScreen &&
      emitState !== "idle" &&
      onEmitAction
    ) {
      onEmitAction();
      return;
    }

    onTabPress("emit");
  }

  return (
    <View style={styles.container}>
      <View
        pointerEvents="none"
        style={styles.fade}
      />

      <View style={styles.bar}>
        {tabs.map((tab) => {
          const isActive =
            activeTab === tab.id;

          if (tab.id === "emit") {
            const isLive =
              emitState === "live";

            const isConnecting =
              emitState ===
              "connecting";

            return (
              <Pressable
                key={tab.id}
                style={({ pressed }) => [
                  styles.emitSlot,
                  pressed &&
                    styles.pressed,
                ]}
                onPress={
                  handleEmitPress
                }
                disabled={isConnecting}
              >
                <View
                  style={[
                    styles.emitButton,
                    isLive &&
                      styles.emitButtonLive,
                  ]}
                >
                  {isConnecting ? (
                    <ActivityIndicator
                      size="small"
                      color={colors.text}
                    />
                  ) : (
                    <Ionicons
                      name={
                        isLive
                          ? "stop"
                          : isEmitScreen
                            ? "radio"
                            : "radio-outline"
                      }
                      size={24}
                      color={colors.text}
                    />
                  )}
                </View>
              </Pressable>
            );
          }

          return (
            <Pressable
              key={tab.id}
              style={({ pressed }) => [
                styles.tab,
                pressed &&
                  styles.pressed,
              ]}
              onPress={() =>
                onTabPress(tab.id)
              }
            >
              <View
                style={[
                  styles.iconContainer,
                  isActive &&
                    styles.iconContainerActive,
                ]}
              >
                <Ionicons
                  name={
                    isActive
                      ? tab.activeIcon
                      : tab.icon
                  }
                  size={iconSizes.lg}
                  color={
                    isActive
                      ? colors.text
                      : colors.textOnOverlayMuted
                  }
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor:
      "transparent",
  },

  fade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 132,
    backgroundImage:
      "linear-gradient(to top, rgba(5,5,6,0.94), rgba(5,5,6,0.56), rgba(5,5,6,0))",
  } as any,

  bar: {
    height: 78,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 28,
    backgroundColor:
      "rgba(10,10,12,0.78)",
    borderWidth:
      StyleSheet.hairlineWidth,
    borderColor:
      "rgba(255,255,255,0.12)",
  },

  tab: {
    flex: 1,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },

  iconContainerActive: {
    backgroundColor:
      "rgba(255,255,255,0.13)",
  },

  emitSlot: {
    flex: 1,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    transform: [
      {
        translateY: -16,
      },
    ],
  },

  emitButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.live,
    borderWidth: 5,
    borderColor:
      "rgba(5,5,6,0.96)",
    shadowColor: colors.live,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.32,
    shadowRadius: 14,
    elevation: 10,
  },

  emitButtonLive: {
    backgroundColor:
      colors.live,
  },

  pressed: {
    opacity: 0.68,
  },
});
