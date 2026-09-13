// src/components/now/NowContentGrid.styles.ts

import {
  StyleSheet,
} from "react-native";

import {
  tokens,
} from "../../styles";

export const nowContentGridStyles =
  StyleSheet.create({
    scroller: {
      flex: 1,

      backgroundColor:
        tokens.color.background.now,
    },

    content: {
      paddingHorizontal:
        tokens.space.now
          .gridHorizontal,

      paddingTop:
        tokens.space.now.gridTop,
      paddingBottom:
        tokens.space.now.gridBottom,
    },

    grid: {
      width: "100%",

      flexDirection:
        "row",

      flexWrap:
        "wrap",

      gap:
        tokens.space.now
          .gridColumnGap,
    },
  });
