// src/components/search/result-card/LiveMetrics.tsx

import {
  Text,
  View,
} from "react-native";

import { styles } from "./searchResultCard.styles";

type Props = {
  likeCount?: number;
  viewerCount?: number;
};

function normalizeCount(
  value?: number,
) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    return 0;
  }

  return value;
}

function formatCount(
  value: number,
) {
  if (value >= 1_000_000) {
    return `${(
      value / 1_000_000
    ).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${(
      value / 1000
    ).toFixed(1)}K`;
  }

  return String(value);
}

export function LiveMetrics({
  likeCount,
  viewerCount,
}: Props) {
  const likes =
    normalizeCount(likeCount);

  const viewers =
    normalizeCount(viewerCount);

  return (
    <View style={styles.metrics}>
      <View style={styles.metric}>
        <Text style={styles.likeIcon}>
          ♥
        </Text>

        <Text style={styles.metricText}>
          {formatCount(likes)}
        </Text>
      </View>

      <View style={styles.metric}>
        <Text style={styles.viewerIcon}>
          ◉
        </Text>

        <Text style={styles.metricText}>
          {formatCount(viewers)}
        </Text>
      </View>
    </View>
  );
}