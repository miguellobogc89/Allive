// src/components/now/NowContentCard.tsx

import { LinearGradient } from "expo-linear-gradient";

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
  onPress: () => void;
};

export function NowContentCard({
  item,
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

  return (
    <Pressable
      style={({
        pressed,
      }) => [
        styles.card,
        pressed
          ? styles.pressed
          : undefined,
      ]}
      onPress={
        onPress
      }
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
            StyleSheet.absoluteFill
          }
        />
      )}

      <LinearGradient
        colors={[
          "rgba(0,0,0,0.05)",
          "rgba(0,0,0,0.05)",
          "rgba(0,0,0,0.32)",
          "rgba(0,0,0,0.92)",
        ]}
        locations={[
          0,
          0.45,
          0.7,
          1,
        ]}
        style={
          StyleSheet.absoluteFill
        }
      />

      <View
        style={
          styles.top
        }
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

      width:
        "48.7%",

      aspectRatio:
        0.74,

      overflow:
        "hidden",

      borderRadius:
        15,

      backgroundColor:
        "#111820",
    },

image: {
  position: "absolute",

  top: 0,
  right: 0,
  bottom: 0,
  left: 0,

  width: "100%",
  height: "100%",
},

    pressed: {
      opacity: 0.88,

      transform: [
        {
          scale: 0.99,
        },
      ],
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
        "rgba(0,0,0,0.65)",

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
        "rgba(0,0,0,0.65)",

      textShadowOffset: {
        width: 0,
        height: 1,
      },

      textShadowRadius:
        2,
    },
  });