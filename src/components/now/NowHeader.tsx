// src/components/now/NowHeader.tsx

import { Ionicons } from "@expo/vector-icons";

import {
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import {
  NotificationButton,
} from "../notifications/NotificationButton";

type NowHeaderProps = {
  unreadNotifications: number;
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
};

const logoImage =
  require("../../../public/logo/logo_allive.png");

export function NowHeader({
  unreadNotifications,
  onOpenSearch,
  onOpenNotifications,
}: NowHeaderProps) {
  return (
    <View
      style={
        styles.header
      }
    >
      <Image
        source={
          logoImage
        }
        style={
          styles.logo
        }
        resizeMode="contain"
      />

      <View
        style={
          styles.actions
        }
      >
        <NotificationButton
          unreadNotifications={
            unreadNotifications
          }
          onPress={
            onOpenNotifications
          }
          borderColor="#020609"
        />

        <Pressable
          onPress={
            onOpenSearch
          }
          hitSlop={10}
          style={({
            pressed,
          }) => [
            styles.iconButton,
            pressed
              ? styles.pressed
              : undefined,
          ]}
        >
          <Ionicons
            name="search"
            size={26}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    header: {
      height: 78,

      flexDirection:
        "row",

      alignItems:
        "flex-end",

      justifyContent:
        "space-between",

      paddingHorizontal:
        22,

      paddingBottom:
        12,
    },

    logo: {
      width: 112,
      height: 46,
    },

    actions: {
      flexDirection:
        "row",

      alignItems:
        "center",

      gap: 8,
    },

    iconButton: {
      width: 36,
      height: 36,

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    pressed: {
      opacity: 0.6,
    },
  });