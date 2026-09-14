// src/maps/components/MapContentCarousel.tsx

import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  colors,
} from "../../styles";

import {
  mapStyles,
} from "../styles/mapStyles";

import type {
  MapContentGroup,
  MapContentItem,
} from "../types/mapTypes";

type MapContentCarouselProps = {
  group: MapContentGroup;
  onClose: () => void;
  onOpenItem: (
    item: MapContentItem,
  ) => void;
};

function getCreatorLabel(
  item: MapContentItem,
) {
  const displayName =
    item.creator?.displayName?.trim();

  if (displayName) {
    return displayName;
  }

  const username =
    item.creator?.username?.trim();

  return username
    ? `@${username}`
    : null;
}

function getTitle(
  item: MapContentItem,
) {
  return (
    item.eventName?.trim() ||
    item.title?.trim() ||
    (item.kind === "live"
      ? "LIVE"
      : "Replay")
  );
}

function formatReplayAge(
  item: MapContentItem,
) {
  if (
    item.kind !== "replay" ||
    !item.endedAt
  ) {
    return null;
  }

  const endedAt =
    new Date(
      item.endedAt,
    ).getTime();

  if (
    !Number.isFinite(endedAt)
  ) {
    return null;
  }

  const minutes =
    Math.max(
      1,
      Math.floor(
        (Date.now() - endedAt) /
          60000,
      ),
    );

  if (minutes < 60) {
    return `Hace ${minutes} min`;
  }

  const hours =
    Math.floor(
      minutes / 60,
    );

  return `Hace ${hours} h`;
}

export function MapContentCarousel({
  group,
  onClose,
  onOpenItem,
}: MapContentCarouselProps) {
  return (
    <View
      style={
        mapStyles.carouselPanel
      }
    >
      <View
        style={
          mapStyles.carouselHeader
        }
      >
        <Text
          style={
            mapStyles.carouselTitle
          }
        >
          {group.items.length > 1
            ? `${group.items.length} contenidos cerca`
            : "Contenido cercano"}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar detalle"
          onPress={onClose}
          style={mapStyles.closeButton}
        >
          <Ionicons
            name="close"
            size={20}
            color={colors.text}
          />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={
          mapStyles.carouselContent
        }
      >
        {group.items.map((item) => {
          const creator =
            getCreatorLabel(item);

          const age =
            formatReplayAge(item);

          return (
            <Pressable
              key={`${item.kind}:${item.id}`}
              accessibilityRole="button"
              onPress={() =>
                onOpenItem(item)
              }
              style={
                mapStyles.contentCard
              }
            >
              {item.thumbnailUrl ? (
                <Image
                  source={{
                    uri: item.thumbnailUrl,
                  }}
                  style={
                    mapStyles.contentThumbnail
                  }
                />
              ) : (
                <View
                  style={
                    mapStyles.contentThumbnailFallback
                  }
                />
              )}

              <View
                style={
                  mapStyles.contentCardBody
                }
              >
                <View
                  style={
                    mapStyles.contentCardTopRow
                  }
                >
                  <View
                    style={[
                      mapStyles.contentBadge,
                      item.kind ===
                      "live"
                        ? mapStyles.liveContentBadge
                        : mapStyles.replayContentBadge,
                    ]}
                  >
                    <Text
                      style={
                        mapStyles.contentBadgeText
                      }
                    >
                      {item.kind ===
                      "live"
                        ? "LIVE"
                        : "REPLAY"}
                    </Text>
                  </View>

                  {age ? (
                    <Text
                      style={
                        mapStyles.contentMeta
                      }
                    >
                      {age}
                    </Text>
                  ) : null}
                </View>

                <Text
                  numberOfLines={2}
                  style={
                    mapStyles.contentTitle
                  }
                >
                  {getTitle(item)}
                </Text>

                {creator ||
                item.placeName ? (
                  <Text
                    numberOfLines={1}
                    style={
                      mapStyles.contentMeta
                    }
                  >
                    {[
                      creator,
                      item.placeName,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
