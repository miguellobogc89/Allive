// src/components/live/broadcast/metadata/LiveBroadcastTitle.tsx

import {
  StyleSheet,
  Text,
} from "react-native";

type LiveBroadcastTitleProps = {
  title: string;
};

export function LiveBroadcastTitle({
  title,
}: LiveBroadcastTitleProps) {
  const cleanTitle =
    title.trim();

  if (!cleanTitle) {
    return null;
  }

  return (
    <Text
      style={styles.title}
      numberOfLines={2}
    >
      {cleanTitle}
    </Text>
  );
}

const styles = StyleSheet.create({
title: {
  color: "#FFFFFF",

  fontSize: 15,
  lineHeight: 20,

  fontWeight: "600",

  textShadowColor: "rgba(0,0,0,0.9)",
  textShadowOffset: {
    width: 0,
    height: 2,
  },
  textShadowRadius: 4,
},
});