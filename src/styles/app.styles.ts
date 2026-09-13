// src/styles/app.styles.ts

import {
  StyleSheet,
} from "react-native";

import {
  colors,
} from "../styles";

export const appStyles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        colors.background,
    },

    content: {
      flex: 1,
    },

    loading: {
      flex: 1,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        colors.background,
    },
  });