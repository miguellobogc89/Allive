// src/components/now/NowContentCard.tsx

import {
  LinearGradient,
} from "expo-linear-gradient";

import {
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

import {
  tokens,
} from "../../styles";

import {
  NowAudienceBadge,
} from "./NowAudienceBadge";

import {
  NowStatusBadge,
} from "./NowStatusBadge";

import {
  nowContentCardStyles as styles,
} from "./NowContentCard.styles";

import type {
  NowGridItem,
} from "./now.types";

type NowContentCardProps = {
  item: NowGridItem;

  width: number;

  onPress: () => void;
};

export function NowContentCard({
  item,
  width,
  onPress,
}: NowContentCardProps) {
  const isLive =
    item.type ===
    "live";

  const source =
    isLive
      ? item.live
      : item.replay;

  const thumbnailUrl =
    source.thumbnailUrl;

    if (isLive) {
  console.log(
    "[NOW CARD LIVE]",
    source.id,
    "thumbnail:",
    thumbnailUrl,
  );
}

  const hasThumbnail =
    typeof thumbnailUrl ===
      "string" &&
    thumbnailUrl.length >
      0;

  const place =
    source.placeName ||
    source.creator
      ?.displayName ||
    source.creator
      ?.username ||
    "Allive";

  const title =
    source.title ||
    source.eventName ||
    (isLive
      ? "Directo en vivo"
      : "Replay");

  const audienceCount =
    isLive
      ? item.live
          .viewerCount
      : item.replay
          .likeCount;

  /*
   * La referencia visual es vertical,
   * aproximadamente 3:4.
   */
  const cardHeight =
    Math.round(
      width * 1.34,
    );

  return (
    <Pressable
      onPress={
        onPress
      }
      style={({
        pressed,
      }) => [
        styles.card,
        {
          width,
          height:
            cardHeight,
        },
        pressed
          ? styles.pressed
          : undefined,
      ]}
    >
      {hasThumbnail ? (
<Image
  key={thumbnailUrl}
  source={{
    uri: thumbnailUrl!,
    cache: "reload",
  }}
  style={styles.image}
  resizeMode="cover"
  onError={(event) => {
    console.error(
      "NOW thumbnail error:",
      thumbnailUrl,
      event.nativeEvent.error,
    );
  }}
/>
      ) : (
        <LinearGradient
          colors={
            tokens.color.gradient
              .nowCardFallback
          }
          style={
            styles.absolute
          }
        />
      )}

      <LinearGradient
        colors={
          tokens.color.gradient
            .nowCardOverlay
        }
        locations={[
          0,
          0.48,
          0.72,
          1,
        ]}
        style={
          styles.absolute
        }
        pointerEvents="none"
      />

      <View
        style={
          styles.top
        }
        pointerEvents="none"
      >
        <NowStatusBadge
          type={
            item.type
          }
        />

        <NowAudienceBadge
          type={
            item.type
          }
          count={
            audienceCount
          }
        />
      </View>

      <View
        style={
          styles.bottom
        }
        pointerEvents="none"
      >
        <Text
          style={
            styles.place
          }
          numberOfLines={1}
        >
          {place}
        </Text>

        <Text
          style={
            styles.title
          }
          numberOfLines={2}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

