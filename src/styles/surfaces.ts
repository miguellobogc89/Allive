// src/styles/surfaces.ts

import {
  StyleSheet,
} from "react-native";

import {
  colors,
} from "./colors";

export const surfaces =
  StyleSheet.create({
    liquidDark: {
      backgroundColor:
        "transparent",
      shadowColor:
        colors.pureBlack,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.24,
      shadowRadius: 18,
      elevation: 10,
      overflow: "hidden",
    },

    liquidLight: {
      backgroundColor:
        "transparent",
      shadowColor:
        colors.pureBlack,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.12,
      shadowRadius: 18,
      elevation: 8,
      overflow: "hidden",
    },
  });   