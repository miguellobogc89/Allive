// src/components/now/NowContentGrid.tsx

import {
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";

import {
  NowContentCard,
} from "./NowContentCard";

import {
  NowEmptyState,
} from "./NowEmptyState";

import {
  nowContentGridStyles as styles,
} from "./NowContentGrid.styles";

import type {
  NowGridItem,
} from "./now.types";

type NowContentGridProps = {
  items: NowGridItem[];

  error?: string | null;

  emptyTitle?: string;
  emptyDescription?: string;

  onItemPress: (
    item: NowGridItem,
  ) => void;
};

const HORIZONTAL_PADDING = 10;
const COLUMN_GAP = 8;

export function NowContentGrid({
  items,
  error = null,
  emptyTitle =
    "No hay contenido",
  emptyDescription =
    "Cuando haya directos o replays aparecerán aquí.",
  onItemPress,
}: NowContentGridProps) {
  const {
    width: screenWidth,
  } = useWindowDimensions();

  const cardWidth =
    Math.floor(
      (
        screenWidth -
        HORIZONTAL_PADDING * 2 -
        COLUMN_GAP
      ) / 2,
    );

  if (error) {
    return (
      <NowEmptyState
        title={error}
      />
    );
  }

  if (
    items.length === 0
  ) {
    return (
      <NowEmptyState
        title={
          emptyTitle
        }
        description={
          emptyDescription
        }
      />
    );
  }

  return (
    <ScrollView
      style={
        styles.scroller
      }
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <View
        style={
          styles.grid
        }
      >
        {items.map(
          (item) => (
            <NowContentCard
              key={
                item.type ===
                "live"
                  ? `live-${item.live.id}`
                  : `replay-${item.replay.id}`
              }
              item={
                item
              }
              width={
                cardWidth
              }
              onPress={() => {
                onItemPress(
                  item,
                );
              }}
            />
          ),
        )}
      </View>
    </ScrollView>
  );
}

