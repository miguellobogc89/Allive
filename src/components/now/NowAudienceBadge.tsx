// src/components/now/NowAudienceBadge.tsx

import { Ionicons } from "@expo/vector-icons";

import {
  Text,
  View,
} from "react-native";

import {
  tokens,
} from "../../styles";

import {
  nowAudienceBadgeStyles as styles,
} from "./NowAudienceBadge.styles";

type NowAudienceBadgeProps = {
  type:
    | "live"
    | "replay";

  count?: number | null;
};

export function NowAudienceBadge({
  type,
  count,
}: NowAudienceBadgeProps) {
  return (
    <View
      style={
        styles.badge
      }
    >
      <Ionicons
        name={
          type === "live"
            ? "person"
            : "heart"
        }
        size={
          tokens.icon.now.audience
        }
        color={
          tokens.color.text.primary
        }
      />

      <Text
        style={
          styles.text
        }
      >
        {formatCount(
          count,
        )}
      </Text>
    </View>
  );
}

function formatCount(
  value?: number | null,
) {
  if (
    typeof value !==
      "number" ||
    !Number.isFinite(
      value,
    ) ||
    value < 0
  ) {
    return "0";
  }

  if (
    value >=
    1000000
  ) {
    return `${(
      value /
      1000000
    ).toFixed(1)}M`;
  }

  if (
    value >= 1000
  ) {
    return `${(
      value /
      1000
    ).toFixed(1)}K`;
  }

  return String(
    value,
  );
}

