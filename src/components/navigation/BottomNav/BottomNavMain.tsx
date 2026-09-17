// src/components/navigation/BottomNav/BottomNavMain.tsx

import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import {
  Video,
} from "lucide-react-native";

import {
  type AppTab,
} from "../../../navigation/navigation.types";

import {
  bottomNavItems,
} from "./bottomNav.config";

import {
  BottomNavTab,
} from "./BottomNavTab";

import {
  BottomNavEmitBorder,
} from "./BottomNavEmitBorder";

type Props = {
  activeTab: AppTab;

  onTabPress: (
    tab: AppTab,
  ) => void;

  emitCanStart: boolean;

  emitIsConnecting: boolean;

  onEmitStart?: () => void;

  compact: boolean;
};

export function BottomNavMain({
  activeTab,
  onTabPress,
  compact,
}: Props) {
  return (
    <>
      {bottomNavItems.map(
        (item) => {
          if (
            item.id === "emit"
          ) {
            return (
              <View
                key={item.id}
                style={
                  styles.emitSlot
                }
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Emitir"
                  onPress={() =>
                    onTabPress(
                      "emit",
                    )
                  }
                  style={({
                    pressed,
                  }) => [
                    styles.emitButton,

                    compact &&
                      styles.emitButtonCompact,

                    pressed &&
                      styles.emitButtonPressed,
                  ]}
                >
                  <BottomNavEmitBorder />

                  <Video
                    size={
                      compact
                        ? 21
                        : 23
                    }
                    color="#FFFFFF"
                    strokeWidth={
                      2.4
                    }
                  />
                </Pressable>
              </View>
            );
          }

          return (
            <BottomNavTab
              key={item.id}
              item={item}
              isActive={
                activeTab ===
                item.id
              }
              compact={
                compact
              }
              onPress={() =>
                onTabPress(
                  item.id,
                )
              }
            />
          );
        },
      )}
    </>
  );
}

const styles =
  StyleSheet.create({
    emitSlot: {
      flex: 1,

      height: "100%",

      alignItems: "center",
      justifyContent:
        "center",
    },

    emitButton: {
      width: 52,
      height: 39,

      borderRadius: 20,

      alignItems: "center",
      justifyContent:
        "center",

      overflow: "hidden",

      backgroundColor:
        "rgba(240, 68, 68, 0.92)",
    },

    emitButtonCompact: {
      width: 47,
      height: 35,

      borderRadius: 18,
    },

    emitButtonPressed: {
      opacity: 0.8,

      transform: [
        {
          scale: 0.94,
        },
      ],
    },
  });