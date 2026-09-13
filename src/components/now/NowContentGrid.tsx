// src/components/now/NowContentGrid.tsx

import {
  ScrollView,
  StyleSheet,
} from "react-native";

import {
  NowContentCard,
} from "./NowContentCard";

import {
  NowEmptyState,
} from "./NowEmptyState";

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

export function NowContentGrid({
  items,
  error = null,
  emptyTitle =
    "No hay contenido",
  emptyDescription =
    "Cuando haya directos o replays aparecerán aquí.",
  onItemPress,
}: NowContentGridProps) {
  if (error) {
    return (
      <NowEmptyState
        title={
          error
        }
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
        styles.grid
      }
      showsVerticalScrollIndicator={
        false
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
            onPress={() => {
              onItemPress(
                item,
              );
            }}
          />
        ),
      )}
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    scroller: {
      flex: 1,
    },

    grid: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",

      justifyContent:
        "space-between",

      paddingHorizontal:
        10,

      paddingTop:
        10,

      paddingBottom:
        28,

      rowGap: 8,
    },
  });