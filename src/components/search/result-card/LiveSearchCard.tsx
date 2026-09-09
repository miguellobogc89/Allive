// src/components/search/result-card/LiveSearchCard.tsx

import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import type { SearchLive } from "../../../api/searchApi";

import { LiveMetrics } from "./LiveMetrics";
import { LiveThumbnail } from "./LiveThumbnail";
import { styles } from "./searchResultCard.styles";

type Props = {
  live: SearchLive;
  onPress?: () => void;
};

function getTitle(
  live: SearchLive,
) {
  if (live.title) {
    return live.title;
  }

  if (live.eventName) {
    return live.eventName;
  }

  return "En directo";
}

export function LiveSearchCard({
  live,
  onPress,
}: Props) {
  return (
    <Pressable
        style={styles.liveCard}
        onPress={onPress}
        >
      <LiveThumbnail
        thumbnailUrl={live.thumbnailUrl}
      />

      <LinearGradient
        colors={[
          "rgba(0,0,0,0)",
          "rgba(0,0,0,0.06)",
          "rgba(0,0,0,0.78)",
        ]}
        locations={[
          0,
          0.52,
          1,
        ]}
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
      />

      <LiveMetrics
        likeCount={live.likeCount}
        viewerCount={live.viewerCount}
      />

      <View style={styles.liveInfo}>
        {live.placeName && (
          <Text
            style={styles.location}
            numberOfLines={1}
          >
            {live.placeName}
          </Text>
        )}

        <Text
          style={styles.liveTitle}
          numberOfLines={2}
        >
          {getTitle(live)}
        </Text>

        <View style={styles.creator}>
          {live.creator.avatarUrl ? (
            <Image
              source={{
                uri: live.creator.avatarUrl,
              }}
              style={styles.avatar}
            />
          ) : (
            <View
              style={[
                styles.avatar,
                styles.avatarFallback,
              ]}
            >
              <Text
                style={styles.avatarLetter}
              >
                {live.creator.username
                  .slice(0, 1)
                  .toUpperCase()}
              </Text>
            </View>
          )}

          <Text
            style={styles.username}
            numberOfLines={1}
          >
            @{live.creator.username}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}