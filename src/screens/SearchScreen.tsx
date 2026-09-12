// src/screens/SearchScreen.tsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
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
  useAuth,
} from "../auth/AuthContext";

import {
  SearchResultCard,
} from "../components/search/result-card/SearchResultCard";

import {
  SearchTabs,
  type SearchTab,
} from "../components/search/SearchTabs";

type LiveItem = {
  id: string;
  live: SearchLive;
};

type SearchScreenProps = {
  onOpenLive: (
    liveId: string,
  ) => void;

  onOpenUser: (
    userId: string,
  ) => void;
};

const EMPTY_RESPONSE:
  SearchResponse = {
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

function applyMetricUpdate(
  response:
    SearchResponse,
  update:
    LiveMetricUpdate,
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
  const {
    width,
  } =
    useWindowDimensions();

  const {
    user,
    token,
  } = useAuth();

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
    useState<
      string | null
    >(null);

  const columns =
    getColumnCount(width);

  useEffect(() => {
    if (!token) {
      setResponse(
        EMPTY_RESPONSE,
      );

      setLoading(false);

      return;
    }

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
                token,
                controller.signal,
              );

            setResponse({
              ...result,

              users:
                result.users.filter(
                  (
                    resultUser,
                  ) =>
                    resultUser.id !==
                    user?.id,
                ),
            });
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
      clearTimeout(
        timer,
      );

      controller.abort();
    };
  }, [
    query,
    token,
    user?.id,
  ]);

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

  const users =
    useMemo(
      () =>
        response.users.filter(
          (
            resultUser,
          ) =>
            resultUser.id !==
            user?.id,
        ),
      [
        response.users,
        user?.id,
      ],
    );

  const lives =
    useMemo(() => {
      if (
        activeTab ===
        "nearby"
      ) {
        return response.lives
          .filter(
            (live) =>
              live.latitude !==
                null &&
              live.longitude !==
                null,
          );
      }

      return response.lives;
    }, [
      activeTab,
      response.lives,
    ]);

  const showPeople =
    activeTab ===
      "people" ||
    (
      activeTab ===
        "for-you" &&
      query.trim().length >
        0 &&
      users.length > 0
    );

  const liveItems:
    LiveItem[] =
      lives.map(
        (live) => ({
          id:
            `live-${live.id}`,
          live,
        }),
      );

  function renderState() {
    if (loading) {
      return (
        <View
          style={
            styles.state
          }
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
          style={
            styles.state
          }
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
        style={
          styles.state
        }
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

  function renderUser({
    item,
  }: {
    item: SearchUser;
  }) {
    const name =
      item.displayName?.trim();

    return (
      <Pressable
        style={
          styles.userRow
        }
        onPress={() => {
          onOpenUser(
            item.id,
          );
        }}
      >
        {item.avatarUrl ? (
          <Image
            source={{
              uri:
                item.avatarUrl,
            }}
            style={
              styles.avatar
            }
          />
        ) : (
          <View
            style={[
              styles.avatar,
              styles.avatarFallback,
            ]}
          >
            <Text
              style={
                styles.avatarLetter
              }
            >
              {item.username
                .charAt(0)
                .toUpperCase()}
            </Text>
          </View>
        )}

        <View
          style={
            styles.userIdentity
          }
        >
          <Text
            numberOfLines={1}
            style={
              styles.username
            }
          >
            {item.username}
          </Text>

          {name ? (
            <Text
              numberOfLines={
                1
              }
              style={
                styles.displayName
              }
            >
              {name}
            </Text>
          ) : null}
        </View>
      </Pressable>
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
            style={
              styles.input
            }
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

      {showPeople ? (
        <FlatList
          key="people-list"
          data={users}
          renderItem={
            renderUser
          }
          keyExtractor={(
            item,
          ) => item.id}
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            users.length ===
            0
              ? styles.emptyList
              : styles.peopleList
          }
          ListEmptyComponent={
            renderState
          }
        />
      ) : (
        <FlatList
          key={`live-${columns}-${activeTab}`}
          data={
            liveItems
          }
          renderItem={({
            item,
          }) => (
            <View
              style={
                styles.gridCell
              }
            >
              <SearchResultCard
                type="live"
                live={
                  item.live
                }
                onPress={() => {
                  onOpenLive(
                    item.live.id,
                  );
                }}
              />
            </View>
          )}
          keyExtractor={(
            item,
          ) => item.id}
          numColumns={
            columns
          }
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            liveItems.length ===
            0
              ? styles.emptyList
              : styles.list
          }
          columnWrapperStyle={
            columns > 1
              ? styles.row
              : undefined
          }
          ListEmptyComponent={
            renderState
          }
        />
      )}
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

      marginHorizontal:
        16,

      marginBottom: 8,

      paddingHorizontal:
        13,

      flexDirection:
        "row",

      alignItems:
        "center",

      borderWidth: 1,

      borderColor:
        "#DEDEDA",

      borderRadius: 13,

      backgroundColor:
        "#FFFFFF",
    },

    searchIcon: {
      marginRight: 8,

      color:
        "#898984",

      fontSize: 21,

      fontWeight:
        "300",
    },

    input: {
      flex: 1,

      height: "100%",

      color:
        "#292927",

      fontSize: 15,

      fontWeight:
        "400",

      outlineStyle:
        "none",
    } as any,

    peopleList: {
      paddingVertical: 8,

      paddingBottom: 140,
    },

    userRow: {
      minHeight: 72,

      paddingHorizontal:
        16,

      paddingVertical:
        8,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        "#F7F7F5",
    },

    avatar: {
      width: 52,
      height: 52,

      borderRadius: 26,
    },

    avatarFallback: {
      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "#E4E4E0",
    },

    avatarLetter: {
      color:
        "#555550",

      fontSize: 19,

      fontWeight:
        "600",
    },

    userIdentity: {
      flex: 1,

      marginLeft: 12,

      justifyContent:
        "center",
    },

    username: {
      color:
        "#292927",

      fontSize: 14,

      fontWeight:
        "600",
    },

    displayName: {
      marginTop: 3,

      color:
        "#858580",

      fontSize: 14,

      fontWeight:
        "400",
    },

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

      borderBottomWidth:
        1,

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

      alignItems:
        "center",

      padding: 24,
    },

    stateTitle: {
      color:
        "#343432",

      fontSize: 16,

      fontWeight:
        "500",
    },

    stateText: {
      marginTop: 7,

      color:
        "#8A8A85",

      fontSize: 13,

      fontWeight:
        "400",

      textAlign:
        "center",
    },
  });