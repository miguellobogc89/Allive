// src/components/now/NowStatusBadge.styles.ts

import {
  StyleSheet,
} from "react-native";

import {
  tokens,
} from "../../styles";

export const nowStatusBadgeStyles =
  StyleSheet.create({
    badge: {
      minHeight:
        tokens.control.now
          .statusBadgeMinHeight,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        tokens.space.now.cardTopInset,

      borderRadius:
        tokens.radius.now
          .statusBadge,
    },

    live: {
      backgroundColor:
        tokens.color.live.now,
    },

    replay: {
      backgroundColor:
        tokens.color.replay.primary,
    },

    text: {
      color:
        tokens.color.text.primary,

      fontSize:
        tokens.type.now
          .statusBadge.fontSize,
      fontWeight:
        tokens.type.now
          .statusBadge.fontWeight,

      letterSpacing:
        tokens.type.now
          .statusBadge
          .letterSpacing,
    },
  });
