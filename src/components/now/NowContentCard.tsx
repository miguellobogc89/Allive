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

  const hasThumbnail =
    typeof thumbnailUrl ===
      "string" &&
    thumbnailUrl.length >
      0;

  /*
   * La primera línea inferior
   * es exclusivamente ubicación.
   *
   * No hacemos fallback al usuario
   * ni a "Allive".
   */
  const place =
    source.placeName?.trim() ??
    "";

  /*
   * La segunda línea es el evento.
   *
   * Si no existe eventName,
   * usamos title si existe.
   * Nunca inventamos "Replay".
   */
  const title =
    source.eventName?.trim() ||
    source.title?.trim() ||
    "";

  /*
   * LIVE:
   * espectadores concurrentes.
   *
   * REPLAY:
   * pico concurrente alcanzado
   * durante aquel LIVE.
   */
  const audienceCount =
    isLive
      ? item.live
          .viewerCount
      : item.replay
          .peakViewerCount;

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
          key={
            thumbnailUrl
          }
          source={{
            uri:
              thumbnailUrl!,
          }}
          style={
            styles.image
          }
          resizeMode="cover"
          onError={(
            event,
          ) => {
            console.error(
              "NOW thumbnail error:",
              thumbnailUrl,
              event.nativeEvent
                .error,
            );
          }}
        />
      ) : (
        <LinearGradient
          colors={
            tokens.color
              .gradient
              .nowCardFallback
          }
          style={
            styles.absolute
          }
        />
      )}

      <LinearGradient
        colors={
          tokens.color
            .gradient
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
        {place ? (
          <Text
            style={
              styles.place
            }
            numberOfLines={
              1
            }
          >
            {place}
          </Text>
        ) : null}

        {title ? (
          <Text
            style={
              styles.title
            }
            numberOfLines={
              2
            }
          >
            {title}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}