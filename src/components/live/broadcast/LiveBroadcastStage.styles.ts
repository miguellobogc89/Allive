import {
  StyleSheet,
} from "react-native";

import {
  tokens,
} from "../../../styles";

export const liveBroadcastStageStyles =
  StyleSheet.create({
    container: {
      flex: 1,
      position:
        "relative",
      backgroundColor:
        tokens.color.background
          .camera,
    },
  });
