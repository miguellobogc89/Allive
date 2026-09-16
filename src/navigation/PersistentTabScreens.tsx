// src/navigation/PersistentTabScreens.tsx

import {
  StyleSheet,
  View,
} from "react-native";

import {
  MapScreen,
} from "../screens/MapScreen";

import {
  NowScreen,
} from "../screens/NowScreen";

import {
  ProfileScreen,
} from "../screens/ProfileScreen";

import {
  SearchScreen,
} from "../screens/SearchScreen";

type PersistentTab =
  | "now"
  | "map"
  | "search"
  | "profile";

type Props = {
  activeTab: string;

  requestedLiveId:
    | string
    | null;

  requestedReplayId:
    | string
    | null;

  unreadNotifications: number;

  onChangeTab: (
    tab: PersistentTab,
  ) => void;

  onOpenLive: (
    liveId: string,
  ) => void;

  onOpenReplay: (
    replayId: string,
  ) => void;

  onOpenUser: (
    userId: string,
  ) => void;

  onOpenNotifications:
    () => void;
};

export function PersistentTabScreens({
  activeTab,
  requestedLiveId,
  requestedReplayId,
  unreadNotifications,
  onChangeTab,
  onOpenLive,
  onOpenReplay,
  onOpenUser,
  onOpenNotifications,
}: Props) {
  return (
    <View
      style={
        styles.container
      }
    >
      <View
        style={[
          styles.screen,
          activeTab !== "now" &&
            styles.hidden,
        ]}
        pointerEvents={
          activeTab === "now"
            ? "auto"
            : "none"
        }
      >
        <NowScreen
          requestedLiveId={
            requestedLiveId
          }
          requestedReplayId={
            requestedReplayId
          }
          unreadNotifications={
            unreadNotifications
          }
          onOpenSearch={() => {
            onChangeTab(
              "search",
            );
          }}
          onOpenNotifications={
            onOpenNotifications
          }
          onOpenUser={
            onOpenUser
          }
        />
      </View>

      <View
        style={[
          styles.screen,
          activeTab !== "map" &&
            styles.hidden,
        ]}
        pointerEvents={
          activeTab === "map"
            ? "auto"
            : "none"
        }
      >
        <MapScreen
          onOpenLive={
            onOpenLive
          }
          onOpenReplay={
            onOpenReplay
          }
        />
      </View>

      <View
        style={[
          styles.screen,
          activeTab !== "search" &&
            styles.hidden,
        ]}
        pointerEvents={
          activeTab === "search"
            ? "auto"
            : "none"
        }
      >
        <SearchScreen
          onOpenLive={
            onOpenLive
          }
          onOpenReplay={
            onOpenReplay
          }
          onOpenUser={
            onOpenUser
          }
        />
      </View>

      <View
        style={[
          styles.screen,
          activeTab !== "profile" &&
            styles.hidden,
        ]}
        pointerEvents={
          activeTab === "profile"
            ? "auto"
            : "none"
        }
      >
        <ProfileScreen
          unreadNotifications={
            unreadNotifications
          }
          onOpenNotifications={
            onOpenNotifications
          }
        />
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      position: "relative",
    },

    screen: {
      ...StyleSheet.absoluteFill,
    },

    hidden: {
      opacity: 0,
    },
  });