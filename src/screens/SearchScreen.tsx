// src/screens/SearchScreen.tsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import {
  searchAll,
  type SearchLive,
  type SearchResponse,
  type SearchUser,
} from "../api/searchApi";

import {
  subscribeToLiveMetrics,
  type LiveMetricUpdate,
} from "../api/liveRealtimeApi";

import {
  SearchResultCard,
} from "../components/search/result-card/SearchResultCard";

import {
  SearchTabs,
  type SearchTab,
} from "../components/search/SearchTabs";

type GridItem =
  | {
      id: string;
      type: "live";
      live: SearchLive;
    }
  | {
      id: string;
      type: "user";
      user: SearchUser;
    };

type SearchScreenProps = {
  onOpenLive: (
    liveId: string,
  ) => void;
  onOpenUser: (
    userId: string,
  ) => void;
};

const EMPTY_RESPONSE: SearchResponse = {
  query: "",
  lives: [],
  users: [],
};

function getColumnCount(
  width: number,
) {
  if (width >= 1180) {
    return 4;
  }

  if (width >= 760) {
    return 3;
  }

  return 2;
}

function liveItems(
  lives: SearchLive[],
): GridItem[] {
  return lives.map(
    (live) => ({
      id: `live-${live.id}`,
      type: "live",
      live,
    }),
  );
}

function peopleItems(
  users: SearchUser[],
): GridItem[] {
  return users.map(
    (user) => ({
      id: `user-${user.id}`,
      type: "user",
      user,
    }),
  );
}

function applyMetricUpdate(
  response: SearchResponse,
  update: LiveMetricUpdate,
): SearchResponse {
  let changed = false;

  const lives =
    response.lives.map(
      (live) => {
        if (
          live.id !==
          update.liveId
        ) {
          return live;
        }

        changed = true;

return {
  ...live,

  likeCount:
    update.likeCount ??
    live.likeCount,

  viewerCount:
    update.viewerCount ??
    live.viewerCount,

  thumbnailUrl:
    update.thumbnailUrl ??
    live.thumbnailUrl,
};
      },
    );

  if (!changed) {
    return response;
  }

  return {
    ...response,
    lives,
  };
}

export function SearchScreen({
  onOpenLive,
  onOpenUser,
}: SearchScreenProps) {
  const { width } =
    useWindowDimensions();

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    activeTab,
    setActiveTab,
  ] =
    useState<SearchTab>(
      "for-you",
    );

  const [
    response,
    setResponse,
  ] =
    useState<SearchResponse>(
      EMPTY_RESPONSE,
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const columns =
    getColumnCount(width);

  useEffect(() => {
    const controller =
      new AbortController();

    const timer =
      setTimeout(
        async () => {
          try {
            setLoading(true);
            setError(null);

            const result =
              await searchAll(
                query,
                controller.signal,
              );

            setResponse(result);
          } catch (
            caughtError
          ) {
            if (
              caughtError instanceof
                Error &&
              caughtError.name ===
                "AbortError"
            ) {
              return;
            }

            console.error(
              "Error cargando Search:",
              caughtError,
            );

            setError(
              "No se pudo cargar la búsqueda.",
            );
          } finally {
            if (
              !controller
                .signal.aborted
            ) {
              setLoading(
                false,
              );
            }
          }
        },
        250,
      );

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    return subscribeToLiveMetrics(
      (update) => {
        setResponse(
          (current) =>
            applyMetricUpdate(
              current,
              update,
            ),
        );
      },
    );
  }, []);

  const items =
    useMemo(() => {
      if (
        activeTab ===
        "people"
      ) {
        return peopleItems(
          response.users,
        );
      }

      if (
        activeTab ===
        "live"
      ) {
        return liveItems(
          response.lives,
        );
      }

      if (
        activeTab ===
        "nearby"
      ) {
        return liveItems(
          response.lives.filter(
            (live) =>
              live.latitude !==
                null &&
              live.longitude !==
                null,
          ),
        );
      }

      if (
        query.trim().length > 0
      ) {
        return [
          ...peopleItems(
            response.users,
          ),
          ...liveItems(
            response.lives,
          ),
        ];
      }

      return liveItems(response.lives);
    }, [
      activeTab,
      query,
      response,
    ]);

  function renderItem({
    item,
  }: {
    item: GridItem;
  }) {
    return (
      <View
        style={
          styles.gridCell
        }
      >
        {item.type ===
        "live" ? (
          <SearchResultCard
            type="live"
            live={item.live}
            onPress={() => {
              if (
                item.live
                  .isSimulated
              ) {
                return;
              }

              onOpenLive(
                item.live.id,
              );
            }}
          />
        ) : (
          <SearchResultCard
            type="user"
            user={item.user}
            onPress={() => {
              onOpenUser(
                item.user.id,
              );
            }}
          />
        )}
      </View>
    );
  }

  function renderEmpty() {
    if (loading) {
      return (
        <View
          style={styles.state}
        >
          <ActivityIndicator
            color="#FF6B5F"
          />

          <Text
            style={
              styles.stateText
            }
          >
            Buscando…
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View
          style={styles.state}
        >
          <Text
            style={
              styles.stateTitle
            }
          >
            No se pudo cargar
          </Text>

          <Text
            style={
              styles.stateText
            }
          >
            {error}
          </Text>
        </View>
      );
    }

    return (
      <View
        style={styles.state}
      >
        <Text
          style={
            styles.stateTitle
          }
        >
          Sin resultados
        </Text>

        <Text
          style={
            styles.stateText
          }
        >
          Prueba con otra
          búsqueda.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={
        styles.container
      }
    >
      <View
        style={
          styles.header
        }
      >
        <View
          style={
            styles.searchBox
          }
        >
          <Text
            style={
              styles.searchIcon
            }
          >
            ⌕
          </Text>

          <TextInput
            value={query}
            onChangeText={
              setQuery
            }
            placeholder="Directos, personas, lugares..."
            placeholderTextColor="#969691"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            style={styles.input}
          />
        </View>

        <SearchTabs
          activeTab={
            activeTab
          }
          onChange={
            setActiveTab
          }
        />
      </View>

      <FlatList
        key={`${columns}-${activeTab}`}
        data={items}
        renderItem={
          renderItem
        }
        keyExtractor={(
          item,
        ) => item.id}
        numColumns={columns}
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          items.length === 0
            ? styles.emptyList
            : styles.list
        }
        columnWrapperStyle={
          columns > 1
            ? styles.row
            : undefined
        }
        ListEmptyComponent={
          renderEmpty
        }
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#F7F7F5",
    },

    header: {
      paddingTop: 16,
      backgroundColor:
        "#F7F7F5",
    },

    searchBox: {
      height: 46,
      marginHorizontal: 16,
      marginBottom: 8,
      paddingHorizontal: 13,

      flexDirection: "row",
      alignItems: "center",

      borderWidth: 1,
      borderColor:
        "#DEDEDA",

      borderRadius: 13,

      backgroundColor:
        "#FFFFFF",
    },

    searchIcon: {
      marginRight: 8,
      color: "#898984",
      fontSize: 21,
      fontWeight: "300",
    },

    input: {
      flex: 1,
      height: "100%",
      color: "#292927",
      fontSize: 15,
      fontWeight: "400",
      outlineStyle: "none",
    } as any,

    list: {
      paddingBottom: 140,
    },

    row: {
      gap: 1,
      backgroundColor:
        "#E4E4E0",
    },

    gridCell: {
      flex: 1,
      minWidth: 0,
      borderBottomWidth: 1,
      borderBottomColor:
        "#E4E4E0",
    },

    emptyList: {
      flexGrow: 1,
      paddingBottom: 140,
    },

    state: {
      minHeight: 300,
      flex: 1,
      justifyContent:
        "center",
      alignItems: "center",
      padding: 24,
    },

    stateTitle: {
      color: "#343432",
      fontSize: 16,
      fontWeight: "500",
    },

    stateText: {
      marginTop: 7,
      color: "#8A8A85",
      fontSize: 13,
      fontWeight: "400",
      textAlign: "center",
    },
  });
