// src/components/now/NowEmptyState.tsx

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

type NowEmptyStateProps = {
  title: string;
  description?: string;
};

export function NowEmptyState({
  title,
  description,
}: NowEmptyStateProps) {
  return (
    <View
      style={
        styles.container
      }
    >
      <Text
        style={
          styles.title
        }
      >
        {title}
      </Text>

      {description ? (
        <Text
          style={
            styles.description
          }
        >
          {description}
        </Text>
      ) : null}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        36,
    },

    title: {
      color:
        "#FFFFFF",

      fontSize: 18,
      fontWeight:
        "800",

      textAlign:
        "center",
    },

    description: {
      maxWidth: 340,

      marginTop: 8,

      color:
        "rgba(255,255,255,0.5)",

      fontSize: 14,
      lineHeight: 20,

      textAlign:
        "center",
    },
  });