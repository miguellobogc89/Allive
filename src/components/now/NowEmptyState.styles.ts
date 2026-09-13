// src/components/now/NowEmptyState.styles.ts

import {
  StyleSheet,
} from "react-native";

import {
  tokens,
} from "../../styles";

export const nowEmptyStateStyles =
  StyleSheet.create({
    container: {
      flex: 1,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        tokens.space.now
          .emptyHorizontal,
    },

    title: {
      color:
        tokens.color.text.primary,

      fontSize:
        tokens.type.now
          .emptyTitle.fontSize,
      fontWeight:
        tokens.type.now
          .emptyTitle.fontWeight,

      textAlign:
        "center",
    },

    description: {
      maxWidth: 340,

      marginTop:
        tokens.space.now
          .emptyDescriptionTop,

      color:
        tokens.color.text
          .nowEmptyDescription,

      fontSize:
        tokens.type.now
          .emptyDescription
          .fontSize,
      lineHeight:
        tokens.type.now
          .emptyDescription
          .lineHeight,

      textAlign:
        "center",
    },
  });
