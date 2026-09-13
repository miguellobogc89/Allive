// src/components/now/NowTabs.styles.ts

import {
  StyleSheet,
} from "react-native";

import {
  tokens,
} from "../../styles";

export const nowTabsStyles =
  StyleSheet.create({
    tabs: {
      height:
        tokens.control.now.tabsHeight,

      flexDirection:
        "row",

      alignItems:
        "flex-end",

      justifyContent:
        "space-around",

      paddingHorizontal:
        tokens.space.now
          .tabsHorizontal,
    },

    tab: {
      minWidth:
        tokens.control.now.tabMinWidth,
      height:
        tokens.control.now.tabHeight,

      alignItems:
        "center",

      justifyContent:
        "flex-start",
    },

    text: {
      color:
        tokens.color.text
          .nowTabInactive,

      fontSize:
        tokens.type.now.tab.fontSize,
      fontWeight:
        tokens.type.now.tab
          .fontWeight,
    },

    activeText: {
      color:
        tokens.color.text.primary,
    },

    indicator: {
      width:
        tokens.control.now
          .tabIndicatorWidth,
      height:
        tokens.control.now
          .tabIndicatorHeight,

      marginTop:
        tokens.space.now
          .tabIndicatorTop,

      borderRadius:
        tokens.radius.now
          .tabIndicator,

      backgroundColor:
        tokens.color.accent.nowTab,
    },
  });
