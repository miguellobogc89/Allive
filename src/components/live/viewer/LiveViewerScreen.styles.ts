// src/components/live/viewer/LiveViewerScreen.styles.ts

import {
  StyleSheet,
} from "react-native";

import {
  tokens,
} from "../../../styles";

export const liveViewerScreenStyles =
  StyleSheet.create({
    container: {
      flex: 1,

      position:
        "relative",

      backgroundColor:
        tokens.color.background.app,
    },

    loading: {
      ...StyleSheet.absoluteFill,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        tokens.color.background.app,
    },

    emptyState: {
      flex: 1,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        tokens.space.liveViewer
          .emptyHorizontal,
    },

    emptyTitle: {
      color:
        tokens.color.text.primary,

      fontSize:
        tokens.type.liveViewer
          .emptyTitle.fontSize,
      fontWeight:
        tokens.type.liveViewer
          .emptyTitle.fontWeight,

      textAlign:
        "center",
    },

    emptySubtitle: {
      marginTop:
        tokens.space.liveViewer
          .emptyDescriptionTop,

      color:
        tokens.color.text
          .liveViewerEmptyDescription,

      fontSize:
        tokens.type.liveViewer
          .emptyDescription.fontSize,
      fontWeight:
        tokens.type.liveViewer
          .emptyDescription.fontWeight,

      textAlign:
        "center",
    },
  });
