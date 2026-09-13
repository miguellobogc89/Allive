// src/components/now/NowHeader.styles.ts

import {
  StyleSheet,
} from "react-native";

import {
  tokens,
} from "../../styles";

export const nowHeaderStyles =
  StyleSheet.create({
    header: {
      height:
        tokens.control.now.headerHeight,

      flexDirection:
        "row",

      alignItems:
        "flex-end",

      justifyContent:
        "space-between",

      paddingHorizontal:
        tokens.space.now
          .headerHorizontal,

      paddingBottom:
        tokens.space.now.headerBottom,
    },

    logo: {
      width:
        tokens.control.now.logoWidth,
      height:
        tokens.control.now.logoHeight,
    },

    actions: {
      flexDirection:
        "row",

      alignItems:
        "center",

      gap:
        tokens.space.now
          .headerActionsGap,
    },

    iconButton: {
      width:
        tokens.control.now.iconButton,
      height:
        tokens.control.now.iconButton,

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    pressed: {
      opacity: 0.6,
    },
  });
