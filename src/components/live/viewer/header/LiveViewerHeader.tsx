// src/components/live/viewer/header/LiveViewerHeader.tsx

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  colors,
  spacing,
} from "../../../../styles";

import {
  LiveViewerAudience,
} from "./LiveViewerAudience";

import {
  LiveViewerIdentity,
} from "./LiveViewerIdentity";

import type {
  LiveAudience,
} from "../../liveAudience";

import type {
  ActiveLive,
} from "../../types";

type Props = {
  live: ActiveLive;
  audience: LiveAudience;
  audienceOpen: boolean;
  followLoading?: boolean;
  isFollowing?: boolean;
  onFollowPress?: () => void;
  onOpenCreator?: () => void;
  onAudienceToggle: () => void;
};

export function LiveViewerHeader({
  live,
  audience,
  followLoading = false,
  isFollowing = false,
  onFollowPress,
  onOpenCreator,
}: Props) {
  return (
    <View
      style={styles.container}
      pointerEvents="box-none"
    >
      <View
        style={styles.topBar}
        pointerEvents="box-none"
      >
        <View style={styles.replaysBadge}>
          <Ionicons
            name="play-back"
            size={14}
            color="#FFFFFF"
          />

          <Text style={styles.replaysText}>
            Replays
          </Text>
        </View>

        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>
            LIVE
          </Text>
        </View>

        <View style={styles.audiencePosition}>
          <LiveViewerAudience
            audience={audience}
          />
        </View>
      </View>

      <LiveViewerIdentity
        live={live}
        followLoading={followLoading}
        isFollowing={isFollowing}
        onFollowPress={onFollowPress}
        onOpenCreator={onOpenCreator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    top: 18,
    left: spacing.md,
    right: spacing.md,

    zIndex: 30,
  },

  topBar: {
    position: "relative",

    width: "100%",
    height: 34,

    marginBottom: 28,

    alignItems: "center",
    justifyContent: "center",
  },

  replaysBadge: {
    position: "absolute",

    left: 0,
    top: 0,

    height: 34,

    paddingHorizontal: 12,

    borderRadius: 17,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 6,

    backgroundColor:
      "rgba(35, 39, 44, 0.92)",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,

    elevation: 4,
  },

  replaysText: {
    color: "#FFFFFF",

    fontSize: 13,
    fontWeight: "600",
  },

  liveBadge: {
    height: 30,

    paddingHorizontal: 13,

    borderRadius: 7,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.live,
  },

  liveText: {
    color: "#FFFFFF",

    fontSize: 13,
    fontWeight: "800",

    letterSpacing: 0.3,
  },

  audiencePosition: {
    position: "absolute",

    right: 0,
    top: 0,
  },
});