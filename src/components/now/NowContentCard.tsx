// src/components/now/NowContentCard.tsx

import {
  LinearGradient,
} from "expo-linear-gradient";

import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  NowAudienceBadge,
} from "./NowAudienceBadge";

import {
  NowStatusBadge,
} from "./NowStatusBadge";

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
          source={{
            uri:
              thumbnailUrl!,
          }}
          style={
            styles.image
          }
          resizeMode="cover"
        />
      ) : (
        <LinearGradient
          colors={[
            "#334A5C",
            "#16232D",
            "#070B0E",
          ]}
          style={
            styles.absolute
          }
        />
      )}

      <LinearGradient
        colors={[
          "rgba(0,0,0,0.00)",
          "rgba(0,0,0,0.04)",
          "rgba(0,0,0,0.32)",
          "rgba(0,0,0,0.92)",
        ]}
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

const styles =
  StyleSheet.create({
    card: {
      position:
        "relative",

      overflow:
        "hidden",

      borderRadius: 15,

      backgroundColor:
        "#111820",
    },

    absolute: {
      position:
        "absolute",

      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },

    image: {
      position:
        "absolute",

      top: 0,
      right: 0,
      bottom: 0,
      left: 0,

      width: "100%",
      height: "100%",
    },

    pressed: {
      opacity: 0.88,
    },

    top: {
      position:
        "absolute",

      top: 9,
      left: 9,
      right: 9,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },

    bottom: {
      position:
        "absolute",

      left: 11,
      right: 11,
      bottom: 11,
    },

    place: {
      color:
        "#FFFFFF",

      fontSize: 13,
      lineHeight: 17,

      fontWeight:
        "800",

      textShadowColor:
        "rgba(0,0,0,0.7)",

      textShadowOffset: {
        width: 0,
        height: 1,
      },

      textShadowRadius:
        2,
    },

    title: {
      marginTop: 2,

      color:
        "rgba(255,255,255,0.90)",

      fontSize: 13,
      lineHeight: 17,

      fontWeight:
        "600",

      textShadowColor:
        "rgba(0,0,0,0.7)",

      textShadowOffset: {
        width: 0,
        height: 1,
      },

      textShadowRadius:
        2,
    },
  });