// src/components/now/NowEmptyState.tsx

import {
  Text,
  View,
} from "react-native";

import {
  nowEmptyStateStyles as styles,
} from "./NowEmptyState.styles";

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

