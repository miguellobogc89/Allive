// src/components/now/NowHeader.tsx

import { Ionicons } from "@expo/vector-icons";

import {
  Image,
  Pressable,
  View,
} from "react-native";

import {
  NotificationButton,
} from "../notifications/NotificationButton";

import {
  tokens,
} from "../../styles";

import {
  nowHeaderStyles as styles,
} from "./NowHeader.styles";

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
          borderColor={
            tokens.color.background.now
          }
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
            size={
              tokens.icon.now.search
            }
            color={
              tokens.color.text.primary
            }
          />
        </Pressable>
      </View>
    </View>
  );
}

