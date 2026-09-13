import {
  StyleSheet,
} from "react-native";

import {
  tokens,
} from "../../../../styles";

export const replayViewerStyles =
  StyleSheet.create({
    container: {
      flex: 1,

      position:
        "relative",

      backgroundColor:
        tokens.color.background
          .app,
    },

    media: {
      flex: 1,

      position:
        "relative",

      backgroundColor:
        tokens.color.background
          .app,
    },

    video: {
      ...StyleSheet.absoluteFill,

      width: "100%",
      height: "100%",

      backgroundColor:
        tokens.color.background
          .app,
    },

    loading: {
      flex: 1,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        tokens.color.background
          .app,
    },

    emptyState: {
      flex: 1,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        tokens.space.replayViewer
          .emptyHorizontal,
    },

    emptyTitle: {
      color:
        tokens.color.text
          .primary,

      ...tokens.type
        .replayViewer
        .emptyTitle,

      textAlign:
        "center",
    },

    emptySubtitle: {
      marginTop:
        tokens.space.replayViewer
          .emptyDescriptionTop,

      color:
        tokens.color.text
          .replayViewerEmptyDescription,

      ...tokens.type
        .replayViewer
        .emptyDescription,

      textAlign:
        "center",
    },
  });
