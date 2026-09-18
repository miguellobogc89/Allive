// src/components/navigation/BottomNav/bottomNav.styles.ts

import {
  StyleSheet,
} from "react-native";

import {
  colors,
  radius,
  spacing,
} from "../../../styles";

export const styles =
  StyleSheet.create({
    container: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: "center",
      justifyContent:
        "flex-end",
      paddingHorizontal:
        spacing.lg,
      zIndex: 100,
    },

    containerCompact: {
      paddingHorizontal:
        spacing.xxl,
    },

    pill: {
      width: "100%",
      maxWidth: 460,
      height: 58,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      paddingHorizontal:
        spacing.xs,
      borderRadius:
        radius.round,
    },

    pillCompact: {
      maxWidth: 410,
      height: 50,
      paddingHorizontal:
        spacing.sm,
    },

    tab: {
      flex: 1,
      minWidth: 0,
      height: 54,
      alignItems: "center",
      justifyContent:
        "center",
    },

    tabCompact: {
      height: 46,
    },

    tabIcon: {
      width: 52,
      height: 39,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
    },

    tabIconCompact: {
      width: 47,
      height: 35,
      borderRadius: 18,
    },

    tabIconActiveBackground: {
      position: "absolute",
      width: 52,
      height: 39,
      borderRadius: 20,
      backgroundColor:
        "rgba(255,255,255,0.13)",
    },

    tabIconActiveBackgroundCompact: {
      width: 47,
      height: 35,
      borderRadius: 18,
    },

animatedLayer: {
  position: "absolute",

  left: spacing.lg,
  right: spacing.lg,
  bottom: 0,

  alignItems: "center",
  justifyContent: "center",
},

emitLayer: {
  left: "8%",
  right: "8%",

  backgroundColor: "transparent",
},



    emitWrapper: {
      flex: 1,
      minWidth: 0,
      height: 54,
      alignItems: "center",
      justifyContent:
        "center",
    },

    emitWrapperCompact: {
      height: 46,
    },

    emitButton: {
      width: 45,
      height: 39,
      alignItems: "center",
      justifyContent:
        "center",
      borderRadius:
        radius.lg,
      overflow: "hidden",
      backgroundColor:
        "rgba(255,59,48,0.78)",
      shadowColor:
        colors.live,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.22,
      shadowRadius: 8,
      elevation: 4,
    },

    emitButtonStart: {
      backgroundColor:
        "rgba(255,59,48,0.92)",
    },

    emitButtonCompact: {
      width: 41,
      height: 35,
      borderRadius:
        radius.md,
    },

    emitDisabled: {
      opacity: 0.46,
    },

    itemPressed: {
      opacity: 0.68,
      transform: [
        {
          scale: 0.94,
        },
      ],
    },
  });