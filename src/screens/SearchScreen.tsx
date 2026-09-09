// src/screens/SearchScreen.tsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  ScrollView,
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

import { SearchResultCard } from "../components/search/SearchResultCard";
import { SearchTabs } from "../components/search/SearchTabs";

import {
  colors,
  spacing,
} from "../styles";

type SearchTab =
  | "for-you"
  | "live"
  | "people"
  | "nearby";

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

function getForYouItems(
  response: SearchResponse,
) {
  const items: GridItem[] = [];

  for (const live of response.lives) {
    items.push({
      id: `live-${live.id}`,
      type: "live",
      live,
    });
  }

  return items;
}

function getLiveItems(
  lives: SearchLive[],
) {
  return lives.map((live) => ({
    id: `live-${live.id}`,
    type: "live" as const,
    live,
  }));
}

function getPeopleItems(
  users: SearchUser[],
) {
  return users.map((user) => ({
    id: `user-${user.id}`,
    type: "user" as const,
    user,
  }));
}

function getNearbyItems(
  lives: SearchLive[],
) {
  const nearby: SearchLive[] = [];

  for (const live of lives) {
    if (
      live.latitude !== null &&
      live.longitude !== null
    ) {
      nearby.push(live);
    }
  }

  return getLiveItems(nearby);
}

export function SearchScreen() {
  const { width } = useWindowDimensions();

  const [query, setQuery] =
    useState("");

  const [activeTab, setActiveTab] =
    useState<SearchTab>("for-you");

  const [response, setResponse] =
    useState<SearchResponse>(
      EMPTY_RESPONSE,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const columns = getColumnCount(width);

  useEffect(() => {
    const controller =
      new AbortController();

    const timer = setTimeout(
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
        } catch (caughtError) {
          if (
            caughtError instanceof Error &&
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
            !controller.signal.aborted
          ) {
            setLoading(false);
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

  const items = useMemo(() => {
    if (activeTab === "live") {
      return getLiveItems(
        response.lives,
      );
    }

    if (activeTab === "people") {
      return getPeopleItems(
        response.users,
      );
    }

    if (activeTab === "nearby") {
      return getNearbyItems(
        response.lives,
      );
    }

    return getForYouItems(
      response,
    );
  }, [
    activeTab,
    response,
  ]);

  const isPeople =
    activeTab === "people";

  function renderItem({
    item,
  }: {
    item: GridItem;
  }) {
    if (item.type === "live") {
      return (
        <View style={styles.gridCell}>
          <SearchResultCard
            type="live"
            live={item.live}
          />
        </View>
      );
    }

    return (
      <View style={styles.gridCell}>
        <SearchResultCard
          type="user"
          user={item.user}
        />
      </View>
    );
  }

  function renderEmpty() {
    if (loading) {
      return (
        <View style={styles.state}>
          <ActivityIndicator
            size="small"
            color={colors.accent}
          />

          <Text style={styles.stateText}>
            Buscando...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.state}>
          <Text style={styles.stateTitle}>
            No se pudo cargar
          </Text>

          <Text style={styles.stateText}>
            {error}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.state}>
        <Text style={styles.stateTitle}>
          No encontramos nada
        </Text>

        <Text style={styles.stateText}>
          Prueba con otra búsqueda.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>
          Buscar
        </Text>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>
            ⌕
          </Text>

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Directos, personas, lugares..."
            placeholderTextColor={
              colors.textMuted
            }
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            style={styles.input}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.tabsScroll
          }
        >
          <SearchTabs
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </ScrollView>
      </View>

      <FlatList
        key={`${columns}-${activeTab}`}
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingTop: spacing.lg,
    backgroundColor: colors.background,
  },

  screenTitle: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },

  searchBox: {
    height: 48,
    marginHorizontal: spacing.lg,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  searchIcon: {
    color: colors.textMuted,
    fontSize: 22,
    marginRight: 9,
  },

  input: {
    flex: 1,
    height: "100%",
    color: colors.text,
    fontSize: 15,
    outlineStyle: "none",
  } as any,

  tabsScroll: {
    paddingHorizontal: spacing.lg,
  },

list: {
  paddingTop: 0,
  paddingBottom: 140,
},

  row: {
    gap: 0,
  },

  gridCell: {
    flex: 1,
    minWidth: 0,
  },

emptyList: {
  flexGrow: 1,
  paddingBottom: 140,
},

  state: {
    flex: 1,
    minHeight: 280,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },

  stateTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },

  stateText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    textAlign: "center",
  },
});