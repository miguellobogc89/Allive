import {
  StyleSheet,
} from "react-native";

import {
  tokens,
} from "../../../styles";

export const liveBroadcastSurfaceStyles =
  StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFill,
      backgroundColor:
        tokens.color.background
          .camera,
    },

    status: {
      ...StyleSheet.absoluteFill,
      alignItems:
        "center",
      justifyContent:
        "center",
      paddingHorizontal: 24,
    },

    statusText: {
      color:
        tokens.color.text
          .primary,
      fontSize: 15,
      fontWeight: "600",
    },

    errorText: {
      color:
        tokens.color.text
          .primary,
      fontSize: 15,
      fontWeight: "700",
      textAlign:
        "center",
    },
  });
