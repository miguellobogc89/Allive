// src/components/now/NowScreen.styles.ts

import {
  StyleSheet,
} from "react-native";

import {
  tokens,
} from "../../styles";

export const nowScreenStyles =
  StyleSheet.create({
    screen: {
      flex: 1,

      backgroundColor:
        tokens.color.background.now,
    },

    section: {
      flex: 1,
    },
  });
