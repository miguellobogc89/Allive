// src/components/now/NowTabs.tsx

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  NowSection,
} from "./now.types";

type NowTabsProps = {
  activeSection: NowSection;
  onChange: (
    section: NowSection,
  ) => void;
};

const tabs: {
  id: NowSection;
  label: string;
}[] = [
  {
    id: "now",
    label: "Now",
  },
  {
    id: "map",
    label: "Mapa",
  },
  {
    id: "following",
    label: "Siguiendo",
  },
];

export function NowTabs({
  activeSection,
  onChange,
}: NowTabsProps) {
  return (
    <View
      style={
        styles.tabs
      }
    >
      {tabs.map(
        (tab) => {
          const active =
            tab.id ===
            activeSection;

          return (
            <Pressable
              key={
                tab.id
              }
              style={
                styles.tab
              }
              onPress={() => {
                onChange(
                  tab.id,
                );
              }}
            >
              <Text
                style={[
                  styles.text,
                  active
                    ? styles.activeText
                    : undefined,
                ]}
              >
                {
                  tab.label
                }
              </Text>

              {active ? (
                <View
                  style={
                    styles.indicator
                  }
                />
              ) : null}
            </Pressable>
          );
        },
      )}
    </View>
  );
}

const styles =
  StyleSheet.create({
    tabs: {
      height: 48,

      flexDirection:
        "row",

      alignItems:
        "flex-end",

      justifyContent:
        "space-around",

      paddingHorizontal:
        36,
    },

    tab: {
      minWidth: 82,
      height: 40,

      alignItems:
        "center",

      justifyContent:
        "flex-start",
    },

    text: {
      color:
        "rgba(255,255,255,0.44)",

      fontSize: 15,
      fontWeight:
        "800",
    },

    activeText: {
      color:
        "#FFFFFF",
    },

    indicator: {
      width: 34,
      height: 3,

      marginTop: 11,

      borderRadius: 2,

      backgroundColor:
        "#22F0DE",
    },
  });