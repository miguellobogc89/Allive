// src/screens/SearchScreen.tsx

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import {
  searchAll,
  type SearchContent,
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
  BackButton,
} from "../components/navigation/BackButton";

import {
  SearchResultCard,
} from "../components/search/result-card/SearchResultCard";

import {
  SearchTabs,
  type SearchTab,
} from "../components/search/SearchTabs";

type SearchScreenProps = {
  onOpenLive: (
    liveId: string,
  ) => void;

  onOpenReplay: (
    replayId: string,
  ) => void;

  onOpenUser: (
    userId: string,
  ) => void;

  onBack?: () => void;
};

const EMPTY_RESPONSE:
  SearchResponse = {
    query: "",
    contents: [],
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

  const contents =
    response.contents.map(
      (content) => {
        if (
          content.id !==
            update.liveId ||
          content.contentType !==
            "live"
        ) {
          return content;
        }

        changed = true;

        return {
          ...content,

          likeCount:
            update.likeCount ??
            content.likeCount,

          viewerCount:
            update.viewerCount ??
            content.viewerCount,

          thumbnailUrl:
            update.thumbnailUrl ??
            content.thumbnailUrl,
        };
      },
    );

  if (!changed) {
    return response;
  }

  return {
    ...response,
    contents,
  };
}

export function SearchScreen({
  onOpenLive,
  onOpenReplay,
  onOpenUser,
  onBack,
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
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const columns =
    getColumnCount(width);

  const loadSearch =
    useCallback(
      async (
        signal?: AbortSignal,
      ) => {
        if (!token) {
          setResponse(
            EMPTY_RESPONSE,
          );

          return;
        }

        const result =
          await searchAll(
            query,
            token,
            signal,
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
      },
      [
        query,
        token,
        user?.id,
      ],
    );

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

            await loadSearch(
              controller.signal,
            );
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
    loadSearch,
    token,
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

  const handleRefresh =
    useCallback(
      async () => {
        if (
          !token ||
          refreshing
        ) {
          return;
        }

        try {
          setRefreshing(true);
          setError(null);

          await loadSearch();
        } catch (
          caughtError
        ) {
          console.error(
            "Error refrescando Search:",
            caughtError,
          );

          setError(
            "No se pudo actualizar la búsqueda.",
          );
        } finally {
          setRefreshing(false);
        }
      },
      [
        loadSearch,
        refreshing,
        token,
      ],
    );

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

  const contents =
    useMemo(() => {
      if (
        activeTab ===
        "live"
      ) {
        return response
          .contents
          .filter(
            (content) =>
              content
                .contentType ===
              "live",
          );
      }

      if (
        activeTab ===
        "nearby"
      ) {
        return response
          .contents
          .filter(
            (content) =>
              content.latitude !==
                null &&
              content.longitude !==
                null,
          );
      }

      return response.contents;
    }, [
      activeTab,
      response.contents,
    ]);

  const showPeople =
    activeTab ===
    "people";

  const refreshControl =
    Platform.OS !== "web"
      ? (
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              handleRefresh
            }
          />
        )
      : undefined;

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
              numberOfLines={1}
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

  function openContent(
    content:
      SearchContent,
  ) {
    if (
      content.contentType ===
      "live"
    ) {
      onOpenLive(
        content.id,
      );

      return;
    }

    onOpenReplay(
      content.id,
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
        {onBack ? (
          <View
            style={
              styles.backRow
            }
          >
            <BackButton
              onPress={
                onBack
              }
            />
          </View>
        ) : null}

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
          refreshControl={
            refreshControl
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
          key={`content-${columns}-${activeTab}`}
          data={contents}
          renderItem={({
            item,
          }) => (
            <View
              style={[
                styles.gridCell,
                {
                  width:
                    `${100 / columns}%`,
                },
              ]}
            >
              <SearchResultCard
                type="live"
                live={item}
                onPress={() => {
                  openContent(
                    item,
                  );
                }}
              />
            </View>
          )}
          keyExtractor={(
            item,
          ) =>
            `${item.contentType}-${item.id}`}
          numColumns={
            columns
          }
          showsVerticalScrollIndicator={
            false
          }
          refreshControl={
            refreshControl
          }
          contentContainerStyle={
            contents.length ===
            0
              ? styles.emptyList
              : styles.list
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
      paddingTop: 8,

      backgroundColor:
        "#F7F7F5",
    },

    backRow: {
      height: 44,

      paddingHorizontal: 6,

      justifyContent:
        "center",
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

      paddingVertical: 8,

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

    gridCell: {
      minWidth: 0,

      borderRightWidth: 1,

      borderBottomWidth: 1,

      borderColor:
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