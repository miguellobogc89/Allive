import {
  StyleSheet,
} from "react-native";

import {
  tokens,
} from "../styles";

export const liveBroadcastScreenStyles =
  StyleSheet.create({
    media: {
      ...StyleSheet.absoluteFill,
    },

    cameraWaiting: {
      ...StyleSheet.absoluteFill,

      alignItems:
        "center",
      justifyContent:
        "center",

      gap: 10,

      backgroundColor:
        tokens.color.background
          .camera,
    },

    cameraWaitingText: {
      color:
        tokens.color.text
          .secondary,

      fontSize: 12,
    },

    centered: {
      flex: 1,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal: 32,

      backgroundColor:
        tokens.color.background
          .app,
    },

    connectingText: {
      marginTop: 12,

      color:
        tokens.color.text
          .secondary,

      fontSize: 13,
    },

    errorTitle: {
      marginTop: 14,

      color:
        tokens.color.text
          .primary,

      fontSize: 18,

      fontWeight: "900",

      textAlign:
        "center",
    },

    errorText: {
      marginTop: 8,

      color:
        tokens.color.text
          .secondary,

      fontSize: 12,

      lineHeight: 18,

      textAlign:
        "center",
    },

    backButton: {
      height: 46,

      marginTop: 22,

      paddingHorizontal: 22,

      alignItems:
        "center",

      justifyContent:
        "center",

      borderRadius: 14,

      backgroundColor:
        tokens.color.surface
          .elevated,
    },

    backButtonText: {
      color:
        tokens.color.text
          .primary,

      fontSize: 12,

      fontWeight: "900",
    },

    finishingOverlay: {
      ...StyleSheet.absoluteFill,

      zIndex: 100,

      alignItems:
        "center",

      justifyContent:
        "center",

      gap: 10,

      backgroundColor:
        tokens.color.overlay
          .strong,
    },

    finishingText: {
      color:
        tokens.color.text
          .primary,

      fontSize: 12,

      fontWeight: "700",
    },
  });
