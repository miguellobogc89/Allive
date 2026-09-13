// src/components/now/NowContentCard.styles.ts

import {
  StyleSheet,
} from "react-native";

import {
  tokens,
} from "../../styles";

export const nowContentCardStyles =
  StyleSheet.create({
    card: {
      position:
        "relative",

      overflow:
        "hidden",

      borderRadius:
        tokens.radius.now.card,

      backgroundColor:
        tokens.color.surface.nowCard,
    },

    absolute: {
      position:
        "absolute",

      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },

    image: {
      position:
        "absolute",

      top: 0,
      right: 0,
      bottom: 0,
      left: 0,

      width: "100%",
      height: "100%",
    },

    pressed: {
      opacity: 0.88,
    },

    top: {
      position:
        "absolute",

      top:
        tokens.space.now.cardTopInset,
      left:
        tokens.space.now.cardTopInset,
      right:
        tokens.space.now.cardTopInset,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },

    bottom: {
      position:
        "absolute",

      left:
        tokens.space.now.cardInset,
      right:
        tokens.space.now.cardInset,
      bottom:
        tokens.space.now.cardInset,
    },

    place: {
      color:
        tokens.color.text.primary,

      fontSize:
        tokens.type.now
          .cardPlace.fontSize,
      lineHeight:
        tokens.type.now
          .cardPlace.lineHeight,

      fontWeight:
        tokens.type.now
          .cardPlace.fontWeight,

      textShadowColor:
        tokens.shadow.nowCardText
          .color,

      textShadowOffset: {
        width:
          tokens.shadow.nowCardText
            .offset.width,
        height:
          tokens.shadow.nowCardText
            .offset.height,
      },

      textShadowRadius:
        tokens.shadow.nowCardText
          .radius,
    },

    title: {
      marginTop:
        tokens.space.now.cardTitleTop,

      color:
        tokens.color.text.nowCardTitle,

      fontSize:
        tokens.type.now
          .cardTitle.fontSize,
      lineHeight:
        tokens.type.now
          .cardTitle.lineHeight,

      fontWeight:
        tokens.type.now
          .cardTitle.fontWeight,

      textShadowColor:
        tokens.shadow.nowCardText
          .color,

      textShadowOffset: {
        width:
          tokens.shadow.nowCardText
            .offset.width,
        height:
          tokens.shadow.nowCardText
            .offset.height,
      },

      textShadowRadius:
        tokens.shadow.nowCardText
          .radius,
    },
  });
