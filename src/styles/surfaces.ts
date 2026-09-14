// src/styles/surfaces.ts

import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const surfaces = StyleSheet.create({
  liquidDark: {
    backgroundColor: "rgba(12,14,17,0.88)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    shadowColor: colors.pureBlack,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 12,
  },

  liquidLight: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.72)",
    shadowColor: colors.pureBlack,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
});