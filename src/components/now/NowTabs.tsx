// src/components/now/NowTabs.tsx

import {
  Pressable,
  Text,
  View,
} from "react-native";

import {
  nowTabsStyles as styles,
} from "./NowTabs.styles";

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

