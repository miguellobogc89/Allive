import {
  StyleSheet,
} from "react-native";

import {
  tokens,
} from "../../styles";

export const emitScreenStyles =
  StyleSheet.create({
    permissionScreen: {
      flex: 1,

      alignItems:
        "center",
      justifyContent:
        "center",

      paddingHorizontal:
        tokens.space.xxl,

      backgroundColor:
        tokens.color.background
          .app,
    },

    permissionIcon: {
      width: 68,
      height: 68,

      borderRadius: 34,

      alignItems:
        "center",
      justifyContent:
        "center",

      marginBottom: 18,

      backgroundColor:
        tokens.color.surface
          .elevated,
    },

    permissionTitle: {
      color:
        tokens.color.text
          .primary,

      fontSize: 20,
      fontWeight: "900",

      textAlign:
        "center",
    },

    permissionText: {
      marginTop:
        tokens.space.xs,

      color:
        tokens.color.text
          .secondary,

      fontSize: 13,
      lineHeight: 19,

      textAlign:
        "center",
    },

    permissionButton: {
      height: 50,

      marginTop:
        tokens.space.xl,

      paddingHorizontal: 24,

      borderRadius: 16,

      alignItems:
        "center",
      justifyContent:
        "center",

      backgroundColor:
        tokens.color.live
          .primary,
    },

    permissionButtonText: {
      color:
        tokens.color.text
          .primary,

      fontSize: 12,
      fontWeight: "900",
    },

    previewCameraSwitch: {
      position:
        "absolute",

      top: 14,
      right: 18,

      zIndex: 60,
    },
  });
