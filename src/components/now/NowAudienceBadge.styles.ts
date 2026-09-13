// src/components/now/NowAudienceBadge.styles.ts

import {
  StyleSheet,
} from "react-native";

import {
  tokens,
} from "../../styles";

export const nowAudienceBadgeStyles =
  StyleSheet.create({
    badge: {
      minHeight:
        tokens.control.now
          .audienceBadgeMinHeight,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      gap: 4,

      paddingHorizontal:
        tokens.space.xs,

      borderRadius:
        tokens.radius.now
          .audienceBadge,

      backgroundColor:
        tokens.color.overlay
          .nowAudience,
    },

    text: {
      color:
        tokens.color.text.primary,

      fontSize:
        tokens.type.now
          .audienceBadge.fontSize,
      fontWeight:
        tokens.type.now
          .audienceBadge
          .fontWeight,
    },
  });
