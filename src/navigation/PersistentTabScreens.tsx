// src/navigation/PersistentTabScreens.tsx

import {
  StyleSheet,
  View,
} from "react-native";

import {
  HotScreen,
} from "../screens/HotScreen";

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
  | "hot"
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

  onCloseRequestedVideo:
    () => void;

  onVideoViewerVisibleChange?: (
    mode:
      | "live"
      | "replay"
      | null,
  ) => void;

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
  onCloseRequestedVideo,
  onVideoViewerVisibleChange,
  onOpenUser,
  onOpenNotifications,
}: Props) {
  return (
    <View style={styles.container}>
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
          onCloseRequestedVideo={
            onCloseRequestedVideo
          }
          onVideoViewerVisibleChange={(
            visible,
          ) => {
            if (!visible) {
              onVideoViewerVisibleChange?.(
                null,
              );

              return;
            }

            if (requestedReplayId) {
              onVideoViewerVisibleChange?.(
                "replay",
              );

              return;
            }

            onVideoViewerVisibleChange?.(
              "live",
            );
          }}
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
          activeTab !== "hot" &&
            styles.hidden,
        ]}
        pointerEvents={
          activeTab === "hot"
            ? "auto"
            : "none"
        }
      >
        <HotScreen />
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
      display: "none",
    },
  });