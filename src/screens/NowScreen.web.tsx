// src/screens/NowScreen.web.tsx

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  getActiveLives,
} from "../api/liveApi";

import {
  getReplays,
  type ReplayItem,
} from "../api/replayApi";

import type {
  ActiveLive,
} from "../components/live/types";

import {
  AlliveLoadingScreen,
} from "../components/loading/AlliveLoadingScreen";

import {
  NotificationButton,
} from "../components/notifications/NotificationButton";

import {
  MapScreen,
} from "../maps/MapScreen.web";

import {
  colors,
} from "../styles";

import {
  LiveViewerScreen,
} from "./LiveViewerScreen.web";

import {
  ReplayViewerScreen,
} from "./ReplayViewerScreen.web";

type NowSection =
  | "now"
  | "map"
  | "following";

type NowScreenProps = {
  requestedLiveId?: string | null;
  requestedReplayId?: string | null;
  unreadNotifications?: number;
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  onOpenUser?: (
    userId: string,
  ) => void;
};

type GridItem =
  | {
      type: "live";
      live: ActiveLive;
    }
  | {
      type: "replay";
      replay: ReplayItem;
    };

const logoImage =
  require("../../public/logo/logo_allive.png");

const tabs: {
  id: NowSection;
  label: string;
}[] = [
  {
    id: "now",
    label: "Now",
  },
  {
    id: "map",
    label: "Mapa",
  },
  {
    id: "following",
    label: "Siguiendo",
  },
];

export function NowScreen({
  requestedLiveId = null,
  requestedReplayId = null,
  unreadNotifications = 0,
  onOpenSearch,
  onOpenNotifications,
  onOpenUser,
}: NowScreenProps) {
  const [
    activeSection,
    setActiveSection,
  ] = useState<NowSection>(
    "now",
  );

  const [
    lives,
    setLives,
  ] = useState<
    ActiveLive[]
  >([]);

  const [
    replays,
    setReplays,
  ] = useState<
    ReplayItem[]
  >([]);

  const [
    selectedLiveId,
    setSelectedLiveId,
  ] = useState<
    string | null
  >(null);

  const [
    selectedReplayId,
    setSelectedReplayId,
  ] = useState<
    string | null
  >(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (
      requestedLiveId ||
      requestedReplayId
    ) {
      setLoading(false);
      return;
    }

    const controller =
      new AbortController();

    async function loadContent() {
      try {
        setError(null);

        const [
          nextLives,
          nextReplays,
        ] = await Promise.all([
          getActiveLives(
            controller.signal,
          ),
          getReplays(
            controller.signal,
          ),
        ]);

        if (
          controller.signal
            .aborted
        ) {
          return;
        }

        setLives(nextLives);
        setReplays(nextReplays);
      } catch (loadError) {
        if (
          !controller.signal
            .aborted
        ) {
          console.error(
            "Allive NOW grid error:",
            loadError,
          );

          setError(
            "No se pudo cargar el contenido.",
          );
        }
      } finally {
        if (
          !controller.signal
            .aborted
        ) {
          setLoading(false);
        }
      }
    }

    void loadContent();

    const interval =
      window.setInterval(
        loadContent,
        5000,
      );

    return () => {
      controller.abort();
      window.clearInterval(
        interval,
      );
    };
  }, [
    requestedLiveId,
    requestedReplayId,
  ]);

  const gridItems =
    useMemo<GridItem[]>(
      () =>
        lives.length > 0
          ? lives.map((live) => ({
              type: "live",
              live,
            }))
          : replays.map((replay) => ({
              type: "replay",
              replay,
            })),
      [
        lives,
        replays,
      ],
    );

  const openItem =
    useCallback(
      (item: GridItem) => {
        if (
          item.type === "live"
        ) {
          setSelectedLiveId(
            item.live.id,
          );
          return;
        }

        setSelectedReplayId(
          item.replay.id,
        );
      },
      [],
    );

  if (
    requestedReplayId ||
    selectedReplayId
  ) {
    return (
      <ReplayViewerScreen
        requestedReplayId={
          requestedReplayId ??
          selectedReplayId
        }
        onOpenUser={
          onOpenUser
        }
      />
    );
  }

  if (
    requestedLiveId ||
    selectedLiveId
  ) {
    return (
      <LiveViewerScreen
        requestedLiveId={
          requestedLiveId ??
          selectedLiveId
        }
        initialLives={
          lives
        }
        onOpenUser={
          onOpenUser
        }
      />
    );
  }

  if (loading) {
    return (
      <AlliveLoadingScreen />
    );
  }

  return (
    <View style={styles.screen}>
      <NowHeader
        unreadNotifications={
          unreadNotifications
        }
        onOpenSearch={
          onOpenSearch
        }
        onOpenNotifications={
          onOpenNotifications
        }
      />

      <View style={styles.tabs}>
        {tabs.map((tab) => {
          const active =
            tab.id ===
            activeSection;

          return (
            <Pressable
              key={tab.id}
              style={styles.tab}
              onPress={() => {
                setActiveSection(
                  tab.id,
                );
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  active
                    ? styles.activeTabText
                    : undefined,
                ]}
              >
                {tab.label}
              </Text>

              {active ? (
                <View
                  style={
                    styles.tabIndicator
                  }
                />
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {activeSection ===
      "now" ? (
        <ContentGrid
          items={gridItems}
          error={error}
          onItemPress={
            openItem
          }
        />
      ) : activeSection ===
        "map" ? (
        <View style={styles.mapSection}>
          <MapScreen />
        </View>
      ) : (
        <FollowingSection />
      )}
    </View>
  );
}

type NowHeaderProps = {
  unreadNotifications: number;
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
};

function NowHeader({
  unreadNotifications,
  onOpenSearch,
  onOpenNotifications,
}: NowHeaderProps) {
  return (
    <View style={styles.header}>
      <Image
        source={logoImage}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.headerActions}>
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
          onPress={onOpenSearch}
          hitSlop={10}
          style={({ pressed }) => [
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

type ContentGridProps = {
  items: GridItem[];
  error: string | null;
  onItemPress: (
    item: GridItem,
  ) => void;
};

function ContentGrid({
  items,
  error,
  onItemPress,
}: ContentGridProps) {
  if (error) {
    return (
      <View style={styles.state}>
        <Text style={styles.stateTitle}>
          {error}
        </Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.state}>
        <Text style={styles.stateTitle}>
          No hay contenido ahora
        </Text>

        <Text style={styles.stateSubtitle}>
          Cuando haya directos o replays apareceran aqui.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.gridScroller}
      contentContainerStyle={
        styles.grid
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      {items.map((item) => (
        <ContentCard
          key={
            item.type === "live"
              ? item.live.id
              : item.replay.id
          }
          item={item}
          onPress={() =>
            onItemPress(item)
          }
        />
      ))}
    </ScrollView>
  );
}

type ContentCardProps = {
  item: GridItem;
  onPress: () => void;
};

function ContentCard({
  item,
  onPress,
}: ContentCardProps) {
  const source =
    item.type === "live"
      ? item.live
      : item.replay;

  const thumbnailUrl =
    source.thumbnailUrl;

  const hasThumbnail =
    typeof thumbnailUrl ===
      "string" &&
    thumbnailUrl.length >
      0;

  const place =
    source.placeName ||
    source.creator?.displayName ||
    source.creator?.username ||
    "Allive";

  const title =
    source.title ||
    source.eventName ||
    (item.type === "live"
      ? "Directo en vivo"
      : "Replay");

  const count =
    item.type === "live"
      ? item.live.viewerCount
      : item.replay.likeCount;

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >
      {hasThumbnail ? (
        <ImageBackground
          source={{
            uri: thumbnailUrl!,
          }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      ) : (
        <LinearGradient
          colors={[
            "#3C5A6F",
            "#1D2833",
            "#0A0D10",
          ]}
          style={
            StyleSheet.absoluteFill
          }
        />
      )}

      <LinearGradient
        colors={[
          "rgba(0,0,0,0.02)",
          "rgba(0,0,0,0.12)",
          "rgba(0,0,0,0.82)",
        ]}
        style={
          StyleSheet.absoluteFill
        }
      />

      <View style={styles.cardTop}>
        <View
          style={[
            styles.liveBadge,
            item.type === "replay"
              ? styles.replayBadge
              : undefined,
          ]}
        >
          <Text style={styles.liveText}>
            {item.type === "live"
              ? "LIVE"
              : "REPLAY"}
          </Text>
        </View>

        <View style={styles.viewerBadge}>
          <Ionicons
            name={
              item.type === "live"
                ? "person"
                : "heart"
            }
            size={12}
            color="#FFFFFF"
          />

          <Text
            style={styles.viewerText}
          >
            {formatCount(count)}
          </Text>
        </View>
      </View>

      <View style={styles.cardText}>
        <Text
          style={styles.cardPlace}
          numberOfLines={1}
        >
          {place}
        </Text>

        <Text
          style={styles.cardTitle}
          numberOfLines={2}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

function FollowingSection() {
  return (
    <View style={styles.state}>
      <Text style={styles.stateTitle}>
        Siguiendo
      </Text>

      <Text style={styles.stateSubtitle}>
        Los directos de las personas que sigues apareceran aqui.
      </Text>
    </View>
  );
}

function formatCount(
  value?: number | null,
) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    return "0";
  }

  if (value >= 1000) {
    return `${(
      value / 1000
    ).toFixed(1)}K`;
  }

  return String(value);
}

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,

      backgroundColor:
        "#020609",
    },

    header: {
      height: 78,

      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent:
        "space-between",

      paddingHorizontal: 22,
      paddingBottom: 12,
    },

    logo: {
      width: 112,
      height: 46,
    },

    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    iconButton: {
      position: "relative",

      width: 36,
      height: 36,

      alignItems: "center",
      justifyContent: "center",
    },

    pressed: {
      opacity: 0.6,
    },

    tabs: {
      height: 48,

      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent:
        "space-around",

      paddingHorizontal: 36,
    },

    tab: {
      minWidth: 82,
      height: 40,

      alignItems: "center",
      justifyContent:
        "flex-start",
    },

    tabText: {
      color:
        "rgba(255,255,255,0.44)",

      fontSize: 15,
      fontWeight: "800",
    },

    activeTabText: {
      color: "#FFFFFF",
    },

    tabIndicator: {
      width: 34,
      height: 3,

      marginTop: 11,

      borderRadius: 2,

      backgroundColor:
        "#22F0DE",
    },

    gridScroller: {
      flex: 1,
    },

    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,

      paddingHorizontal: 22,
      paddingTop: 8,
      paddingBottom: 28,
    },

    card: {
      width: "48%",
      aspectRatio: 0.75,

      overflow: "hidden",

      borderRadius: 10,

      backgroundColor:
        colors.surface,
    },

    cardTop: {
      position: "absolute",

      top: 10,
      left: 9,
      right: 9,

      flexDirection: "row",
      alignItems: "center",

      gap: 6,
    },

    liveBadge: {
      height: 27,

      alignItems: "center",
      justifyContent: "center",

      paddingHorizontal: 8,

      borderRadius: 5,

      backgroundColor:
        "#FF2F68",
    },

    replayBadge: {
      backgroundColor:
        "#6E5CFF",
    },

    liveText: {
      color: "#FFFFFF",

      fontSize: 13,
      fontWeight: "900",
    },

    viewerBadge: {
      height: 27,

      flexDirection: "row",
      alignItems: "center",

      gap: 4,

      paddingHorizontal: 8,

      borderRadius: 9,

      backgroundColor:
        "rgba(94,99,111,0.82)",
    },

    viewerText: {
      color: "#FFFFFF",

      fontSize: 12,
      fontWeight: "800",
    },

    cardText: {
      position: "absolute",

      left: 10,
      right: 10,
      bottom: 12,
    },

    cardPlace: {
      color: "#FFFFFF",

      fontSize: 13,
      fontWeight: "800",
    },

    cardTitle: {
      marginTop: 2,

      color: "#FFFFFF",

      fontSize: 13,
      fontWeight: "600",
      lineHeight: 17,
    },

    mapSection: {
      flex: 1,

      marginTop: 8,
    },

    state: {
      flex: 1,

      alignItems: "center",
      justifyContent: "center",

      paddingHorizontal: 32,
    },

    stateTitle: {
      color: "#FFFFFF",

      fontSize: 18,
      fontWeight: "800",

      textAlign: "center",
    },

    stateSubtitle: {
      maxWidth: 320,

      marginTop: 8,

      color:
        "rgba(255,255,255,0.58)",

      fontSize: 14,
      fontWeight: "500",
      lineHeight: 20,

      textAlign: "center",
    },
  });
