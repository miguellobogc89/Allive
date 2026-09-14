// src/components/search/SearchTabs.tsx

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  colors,
} from "../../styles";

export type SearchTab =
  | "for-you"
  | "live"
  | "people"
  | "nearby";

type Props = {
  activeTab: SearchTab;

  onChange: (
    tab: SearchTab,
  ) => void;
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
}: Props) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        {tabs.map((tab) => {
          const active =
            activeTab === tab.id;

          return (
            <Pressable
              key={tab.id}
              style={styles.tab}
              onPress={() =>
                onChange(tab.id)
              }
            >
              <Text
                style={[
                  styles.label,

                  active &&
                    styles.labelActive,
                ]}
              >
                {tab.label}
              </Text>

              <View
                style={[
                  styles.indicator,

                  active &&
                    styles.indicatorActive,
                ]}
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      backgroundColor:
        colors.background,

      borderBottomWidth:
        StyleSheet.hairlineWidth,

      borderBottomColor:
        colors.border,
    },

    content: {
      paddingHorizontal: 18,

      gap: 28,
    },

    tab: {
      minHeight: 43,

      justifyContent:
        "flex-end",

      alignItems:
        "center",
    },

    label: {
      paddingBottom: 11,

      color:
        colors.textSecondary,

      fontSize: 14,

      fontWeight:
        "400",
    },

    labelActive: {
      color:
        colors.text,

      fontWeight:
        "500",
    },

    indicator: {
      width: "100%",
      height: 2,

      backgroundColor:
        "transparent",
    },

    indicatorActive: {
      backgroundColor:
        colors.accent,
    },
  });