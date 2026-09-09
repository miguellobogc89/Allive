// src/components/search/result-card/searchResultCard.styles.ts

import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    liveCard: {
      width: "100%",
      aspectRatio: 9 / 14,
      overflow: "hidden",
      backgroundColor: "#E8E8E5",
    },

    placeholder: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },

    metrics: {
      position: "absolute",
      top: 9,
      left: 9,
      right: 9,

      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    metric: {
      minHeight: 25,

      flexDirection: "row",
      alignItems: "center",

      paddingHorizontal: 8,
      paddingVertical: 4,

      borderRadius: 13,

      backgroundColor:
        "rgba(20,20,20,0.58)",
    },

    likeIcon: {
      marginRight: 5,

      color: "#FFFFFF",

      fontSize: 11,
      lineHeight: 14,
    },

    viewerIcon: {
      marginRight: 5,

      color: "#FFFFFF",

      fontSize: 10,
      lineHeight: 14,
    },

    metricText: {
      color: "#FFFFFF",

      fontSize: 11,
      lineHeight: 14,

      fontWeight: "500",
    },

    liveInfo: {
      position: "absolute",
      left: 11,
      right: 11,
      bottom: 12,
    },

    location: {
      marginBottom: 4,

      color:
        "rgba(255,255,255,0.72)",

      fontSize: 10,
      lineHeight: 13,

      fontWeight: "500",

      textTransform: "uppercase",

      letterSpacing: 0.45,
    },

    liveTitle: {
      color: "#FFFFFF",

      fontSize: 15,
      lineHeight: 19,

      fontWeight: "600",
    },

    creator: {
      marginTop: 9,

      flexDirection: "row",
      alignItems: "center",
    },

    avatar: {
      width: 22,
      height: 22,

      borderRadius: 11,
    },

    avatarFallback: {
      justifyContent: "center",
      alignItems: "center",

      backgroundColor:
        "rgba(255,255,255,0.18)",
    },

    avatarLetter: {
      color: "#FFFFFF",

      fontSize: 10,

      fontWeight: "600",
    },

    username: {
      marginLeft: 7,

      flexShrink: 1,

      color:
        "rgba(255,255,255,0.92)",

      fontSize: 11,
      lineHeight: 14,

      fontWeight: "500",
    },

    personCard: {
      minHeight: 82,

      flexDirection: "row",
      alignItems: "center",

      paddingHorizontal: 14,
      paddingVertical: 12,

      backgroundColor: "#FFFFFF",

      borderRightWidth:
        StyleSheet.hairlineWidth,

      borderBottomWidth:
        StyleSheet.hairlineWidth,

      borderColor: "#E3E3E0",
    },

    personAvatar: {
      width: 48,
      height: 48,

      borderRadius: 24,
    },

    personAvatarFallback: {
      justifyContent: "center",
      alignItems: "center",

      backgroundColor: "#EEEDEA",
    },

    personInitial: {
      color: "#5B5B58",

      fontSize: 16,

      fontWeight: "500",
    },

    personInfo: {
      flex: 1,

      marginLeft: 11,
    },

    personName: {
      color: "#252523",

      fontSize: 14,

      fontWeight: "500",
    },

    personUsername: {
      marginTop: 3,

      color: "#8A8985",

      fontSize: 12,

      fontWeight: "400",
    },
  });