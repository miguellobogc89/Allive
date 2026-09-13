// src/screens/NowScreen.tsx

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
  getFollowingFeed,
} from "../api/followingApi";

import {
  getActiveLives,
} from "../api/liveApi";

import {
  getReplays,
  type ReplayItem,
} from "../api/replayApi";

import {
  useAuth,
} from "../auth/AuthContext";

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
} from "../maps/MapScreen";

import {
  LiveViewerScreen,
} from "./LiveViewerScreen.native";

import {
  ReplayViewerScreen,
} from "./ReplayViewerScreen.native";

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
  const {
    token,
  } = useAuth();

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
    followingLives,
    setFollowingLives,
  ] = useState<
    ActiveLive[]
  >([]);

  const [
    followingReplays,
    setFollowingReplays,
  ] = useState<
    ReplayItem[]
  >([]);

  const [
    followingLoading,
    setFollowingLoading,
  ] = useState(false);

  const [
    followingError,
    setFollowingError,
  ] = useState<
    string | null
  >(null);

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

        console.log(
          "[NOW] cargando contenido",
        );

console.log(
  "[NOW] solicitando lives",
);

const nextLives =
  await getActiveLives(
    controller.signal,
  );

console.log(
  "[NOW] lives OK:",
  nextLives.length,
);

console.log(
  "[NOW] solicitando replays",
);

const nextReplays =
  await getReplays(
    controller.signal,
  );

console.log(
  "[NOW] replays OK:",
  nextReplays.length,
);

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
          controller.signal
            .aborted
        ) {
          return;
        }

        console.error(
          "Allive NOW grid error:",
          loadError,
        );

        setError(
          "No se pudo cargar el contenido.",
        );
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
      setInterval(
        loadContent,
        5000,
      );

    return () => {
      controller.abort();

      clearInterval(
        interval,
      );
    };
  }, [
    requestedLiveId,
    requestedReplayId,
  ]);

  useEffect(() => {
    if (
      activeSection !==
      "following"
    ) {
      return;
    }

    if (!token) {
      setFollowingLives([]);
      setFollowingReplays([]);

      setFollowingError(
        "Inicia sesión para ver a las personas que sigues.",
      );

      setFollowingLoading(
        false,
      );

      return;
    }

    const controller =
      new AbortController();

    async function loadFollowing() {
      try {
        setFollowingError(
          null,
        );

        const result =
          await getFollowingFeed(
            token!,
            controller.signal,
          );

        if (
          controller.signal
            .aborted
        ) {
          return;
        }

        setFollowingLives(
          result.lives,
        );

        setFollowingReplays(
          result.replays,
        );
      } catch (loadError) {
        if (
          controller.signal
            .aborted
        ) {
          return;
        }

        console.error(
          "Error cargando Siguiendo:",
          loadError,
        );

        setFollowingError(
          "No se pudo cargar Siguiendo.",
        );
      } finally {
        if (
          !controller.signal
            .aborted
        ) {
          setFollowingLoading(
            false,
          );
        }
      }
    }

    setFollowingLoading(
      true,
    );

    void loadFollowing();

    const interval =
      setInterval(
        loadFollowing,
        5000,
      );

    return () => {
      controller.abort();

      clearInterval(
        interval,
      );
    };
  }, [
    activeSection,
    token,
  ]);

  const gridItems =
    useMemo<GridItem[]>(
      () => [
        ...lives.map(
          (live) => ({
            type:
              "live" as const,
            live,
          }),
        ),

        ...replays.map(
          (replay) => ({
            type:
              "replay" as const,
            replay,
          }),
        ),
      ],
      [
        lives,
        replays,
      ],
    );

  const followingItems =
    useMemo<GridItem[]>(
      () => [
        ...followingLives.map(
          (live) => ({
            type:
              "live" as const,
            live,
          }),
        ),

        ...followingReplays.map(
          (replay) => ({
            type:
              "replay" as const,
            replay,
          }),
        ),
      ],
      [
        followingLives,
        followingReplays,
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

          setSelectedReplayId(
            null,
          );

          return;
        }

        setSelectedReplayId(
          item.replay.id,
        );

        setSelectedLiveId(
          null,
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
        <View
          style={
            styles.mapSection
          }
        >
          <MapScreen />
        </View>
      ) : followingLoading ? (
        <View
          style={
            styles.loadingSection
          }
        >
          <AlliveLoadingScreen />
        </View>
      ) : followingItems.length ===
          0 &&
        !followingError ? (
        <FollowingSection />
      ) : (
        <ContentGrid
          items={
            followingItems
          }
          error={
            followingError
          }
          onItemPress={
            openItem
          }
        />
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

      <View
        style={
          styles.headerActions
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
        <Text
          style={
            styles.stateTitle
          }
        >
          {error}
        </Text>
      </View>
    );
  }

  if (items.length === 0) {
return (
  <ScrollView
    style={{
      flex: 1,
      backgroundColor: "#020609",
    }}
    contentContainerStyle={{
      padding: 16,
    }}
  >
    <Text
      style={{
        color: "#FFFFFF",
        fontSize: 22,
        marginBottom: 20,
      }}
    >
      Replays encontrados: {items.length}
    </Text>

    {items.map((item) => (
      <View
        key={
          item.type === "live"
            ? `live-${item.live.id}`
            : `replay-${item.replay.id}`
        }
        style={{
          height: 100,
          backgroundColor: "#222",
          marginBottom: 10,
          padding: 15,
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
          }}
        >
          {item.type === "live"
            ? item.live.title ?? "LIVE"
            : item.replay.title ?? "REPLAY"}
        </Text>
      </View>
    ))}
  </ScrollView>
);
  }

  return (
    <ScrollView
      style={
        styles.gridScroller
      }
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
              ? `live-${item.live.id}`
              : `replay-${item.replay.id}`
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
    thumbnailUrl.length > 0;

  const place =
    source.placeName ||
    source.creator
      ?.displayName ||
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
          style={
            StyleSheet.absoluteFill
          }
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

      <View
        style={styles.cardTop}
      >
        <View
          style={[
            styles.liveBadge,
            item.type ===
            "replay"
              ? styles.replayBadge
              : undefined,
          ]}
        >
          <Text
            style={
              styles.liveText
            }
          >
            {item.type ===
            "live"
              ? "LIVE"
              : "REPLAY"}
          </Text>
        </View>

        <View
          style={
            styles.viewerBadge
          }
        >
          <Ionicons
            name={
              item.type ===
              "live"
                ? "person"
                : "heart"
            }
            size={12}
            color="#FFFFFF"
          />

          <Text
            style={
              styles.viewerText
            }
          >
            {formatCount(
              count,
            )}
          </Text>
        </View>
      </View>

      <View
        style={
          styles.cardText
        }
      >
        <Text
          style={
            styles.cardPlace
          }
          numberOfLines={1}
        >
          {place}
        </Text>

        <Text
          style={
            styles.cardTitle
          }
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
      <Text
        style={
          styles.stateTitle
        }
      >
        No hay contenido nuevo
      </Text>

      <Text
        style={
          styles.stateSubtitle
        }
      >
        Cuando las personas que
        sigues hagan un directo o
        guarden un replay,
        aparecerá aquí.
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
      justifyContent:
        "center",
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

    loadingSection: {
      flex: 1,
    },

    gridScroller: {
      flex: 1,
    },

    grid: {
      flexDirection: "row",
      flexWrap: "wrap",

      paddingHorizontal: 12,
      paddingTop: 12,
      paddingBottom: 28,

      gap: 8,
    },

    card: {
      position: "relative",

      width: "48.5%",
      aspectRatio: 0.76,

      overflow: "hidden",

      borderRadius: 16,

      backgroundColor:
        "#111820",
    },

    cardTop: {
      position: "absolute",

      top: 10,
      left: 10,
      right: 10,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    liveBadge: {
      minHeight: 23,

      alignItems: "center",
      justifyContent:
        "center",

      paddingHorizontal: 8,

      borderRadius: 6,

      backgroundColor:
        "#FF2147",
    },

    replayBadge: {
      backgroundColor:
        "rgba(0,0,0,0.72)",
    },

    liveText: {
      color: "#FFFFFF",

      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 0.6,
    },

    viewerBadge: {
      minHeight: 23,

      flexDirection: "row",
      alignItems: "center",

      gap: 4,

      paddingHorizontal: 7,

      borderRadius: 999,

      backgroundColor:
        "rgba(0,0,0,0.48)",
    },

    viewerText: {
      color: "#FFFFFF",

      fontSize: 11,
      fontWeight: "800",
    },

    cardText: {
      position: "absolute",

      left: 12,
      right: 12,
      bottom: 12,
    },

    cardPlace: {
      color: "#FFFFFF",

      fontSize: 14,
      fontWeight: "900",
    },

    cardTitle: {
      marginTop: 3,

      color:
        "rgba(255,255,255,0.78)",

      fontSize: 12,
      fontWeight: "600",
      lineHeight: 16,
    },

    state: {
      flex: 1,

      alignItems: "center",
      justifyContent:
        "center",

      paddingHorizontal: 36,
    },

    stateTitle: {
      color: "#FFFFFF",

      fontSize: 18,
      fontWeight: "800",

      textAlign: "center",
    },

    stateSubtitle: {
      maxWidth: 340,

      marginTop: 8,

      color:
        "rgba(255,255,255,0.5)",

      fontSize: 14,
      lineHeight: 20,

      textAlign: "center",
    },

    mapSection: {
      flex: 1,
    },
  });