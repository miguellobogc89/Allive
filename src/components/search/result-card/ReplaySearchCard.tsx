// src/components/search/result-card/ReplaySearchCard.tsx

import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import type {
  SearchContent,
} from "../../../api/searchApi";

import { LiveThumbnail } from "./LiveThumbnail";
import { styles } from "./searchResultCard.styles";

type Props = {
  content: SearchContent;
  onPress?: () => void;
};

function getTitle(
  content: SearchContent,
) {
  if (content.title) {
    return content.title;
  }

  if (content.eventName) {
    return content.eventName;
  }

  return "Replay";
}

export function ReplaySearchCard({
  content,
  onPress,
}: Props) {
  return (
    <Pressable
      style={styles.liveCard}
      onPress={onPress}
    >
      <LiveThumbnail
        thumbnailUrl={
          content.thumbnailUrl
        }
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

      <View style={styles.liveInfo}>
        {content.placeName && (
          <Text
            style={styles.location}
            numberOfLines={1}
          >
            {content.placeName}
          </Text>
        )}

        <Text
          style={styles.liveTitle}
          numberOfLines={2}
        >
          {getTitle(content)}
        </Text>

        <View style={styles.creator}>
          {content.creator.avatarUrl ? (
            <Image
              source={{
                uri:
                  content.creator
                    .avatarUrl,
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
                style={
                  styles.avatarLetter
                }
              >
                {content.creator.username
                  .slice(0, 1)
                  .toUpperCase()}
              </Text>
            </View>
          )}

          <Text
            style={styles.username}
            numberOfLines={1}
          >
            @{content.creator.username}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}