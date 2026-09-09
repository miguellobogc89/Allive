// src/components/search/SearchTabs.tsx

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, spacing } from "../../styles";

export type SearchTab =
  | "for-you"
  | "live"
  | "people"
  | "nearby";

type SearchTabsProps = {
  activeTab: SearchTab;
  onChange: (tab: SearchTab) => void;
};

const tabs: {
  id: SearchTab;
  label: string;
}[] = [
  {
    id: "for-you",
    label: "Para ti",
  },
  {
    id: "live",
    label: "Directos",
  },
  {
    id: "people",
    label: "Personas",
  },
  {
    id: "nearby",
    label: "Cerca de ti",
  },
];

export function SearchTabs({
  activeTab,
  onChange,
}: SearchTabsProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <Pressable
              key={tab.id}
              style={styles.tab}
              onPress={() => onChange(tab.id)}
            >
              <Text
                style={[
                  styles.text,
                  isActive && styles.textActive,
                ]}
              >
                {tab.label}
              </Text>

              <View
                style={[
                  styles.indicator,
                  isActive && styles.indicatorActive,
                ]}
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  content: {
    paddingHorizontal: spacing.lg,
    gap: 26,
  },

  tab: {
    minHeight: 47,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  text: {
    paddingBottom: 13,

    color: colors.textMuted,

    fontSize: 14,
    fontWeight: "700",
  },

  textActive: {
    color: colors.text,
    fontWeight: "800",
  },

  indicator: {
    width: "100%",
    height: 2,

    borderRadius: 2,

    backgroundColor: "transparent",
  },

  indicatorActive: {
    backgroundColor: colors.accent,
  },
});