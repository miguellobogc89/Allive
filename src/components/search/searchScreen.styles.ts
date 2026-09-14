// src/components/search/searchScreen.styles.ts

import {
  StyleSheet,
} from "react-native";

import {
  colors,
} from "../../styles";

export const searchScreenStyles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        colors.background,
    },

    header: {
      paddingTop: 8,

      backgroundColor:
        colors.background,
    },

    backRow: {
      height: 44,

      paddingHorizontal: 6,

      justifyContent:
        "center",
    },

    searchBox: {
      height: 46,

      marginHorizontal: 16,

      marginBottom: 8,

      paddingHorizontal: 13,

      flexDirection:
        "row",

      alignItems:
        "center",

      borderWidth: 1,

      borderColor:
        colors.border,

      borderRadius: 13,

      backgroundColor:
        colors.surface,
    },

    searchIcon: {
      marginRight: 8,

      color:
        colors.textSecondary,

      fontSize: 21,

      fontWeight:
        "300",
    },

    input: {
      flex: 1,

      height: "100%",

      color:
        colors.text,

      fontSize: 15,

      fontWeight:
        "400",

      outlineStyle:
        "none",
    } as any,

    peopleList: {
      paddingVertical: 8,

      paddingBottom: 140,
    },

    userRow: {
      minHeight: 72,

      paddingHorizontal: 16,

      paddingVertical: 8,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        colors.background,
    },

    avatar: {
      width: 52,
      height: 52,

      borderRadius: 26,
    },

    avatarFallback: {
      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        colors.surfaceElevated,
    },

    avatarLetter: {
      color:
        colors.textSecondary,

      fontSize: 19,

      fontWeight:
        "600",
    },

    userIdentity: {
      flex: 1,

      marginLeft: 12,

      justifyContent:
        "center",
    },

    username: {
      color:
        colors.text,

      fontSize: 14,

      fontWeight:
        "600",
    },

    displayName: {
      marginTop: 3,

      color:
        colors.textSecondary,

      fontSize: 14,

      fontWeight:
        "400",
    },

    list: {
      paddingBottom: 140,
    },

    gridCell: {
      minWidth: 0,

      borderRightWidth:
        StyleSheet.hairlineWidth,

      borderBottomWidth:
        StyleSheet.hairlineWidth,

      borderColor:
        colors.border,
    },

    emptyList: {
      flexGrow: 1,

      paddingBottom: 140,
    },

    state: {
      minHeight: 300,

      flex: 1,

      justifyContent:
        "center",

      alignItems:
        "center",

      padding: 24,
    },

    stateTitle: {
      color:
        colors.text,

      fontSize: 16,

      fontWeight:
        "500",
    },

    stateText: {
      marginTop: 7,

      color:
        colors.textSecondary,

      fontSize: 13,

      fontWeight:
        "400",

      textAlign:
        "center",
    },
  });