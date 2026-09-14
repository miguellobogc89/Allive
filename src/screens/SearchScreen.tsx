// src/screens/SearchScreen.tsx

import {
  useMemo,
  useState,
} from "react";

import {
  FlatList,
  Platform,
  RefreshControl,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import type {
  SearchContent,
} from "../api/searchApi";

import {
  useAuth,
} from "../auth/AuthContext";

import {
  filterSearchContents,
} from "../components/search/filterSearchContents";

import {
  SearchResultCard,
} from "../components/search/result-card/SearchResultCard";

import {
  searchScreenStyles as styles,
} from "../components/search/searchScreen.styles";

import {
  SearchState,
} from "../components/search/SearchState";

import {
  SearchTabs,
  type SearchTab,
} from "../components/search/SearchTabs";

import {
  SearchUserRow,
} from "../components/search/SearchUserRow";

import {
  useSearch,
} from "../hooks/useSearch";

import {
  colors,
} from "../styles";

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

export function SearchScreen({
  onOpenLive,
  onOpenReplay,
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

  const {
    response,
    loading,
    refreshing,
    error,
    refresh,
  } = useSearch({
    query,
    token,

    currentUserId:
      user?.id,
  });

  const columns =
    getColumnCount(width);

  const contents =
    useMemo(
      () =>
        filterSearchContents(
          response.contents,
          activeTab,
        ),
      [
        activeTab,
        response.contents,
      ],
    );

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
              refresh
            }
            tintColor={
              colors.text
            }
            colors={[
              colors.accent,
            ]}
            progressBackgroundColor={
              colors.surface
            }
          />
        )
      : undefined;

  function openContent(
    content: SearchContent,
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

  const emptyState = (
    <SearchState
      loading={loading}
      error={error}
    />
  );

  return (
    <View
      style={styles.container}
    >
      <View
        style={styles.header}
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
            placeholderTextColor={
              colors.textMuted
            }
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            selectionColor={
              colors.accent
            }
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

      {showPeople ? (
        <FlatList
          key="people-list"
          data={
            response.users
          }
          renderItem={({
            item,
          }) => (
            <SearchUserRow
              user={item}
              onPress={() => {
                onOpenUser(
                  item.id,
                );
              }}
            />
          )}
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
            response.users
              .length === 0
              ? styles.emptyList
              : styles.peopleList
          }
          ListEmptyComponent={
            emptyState
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
                type="content"
                content={item}
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
            contents.length === 0
              ? styles.emptyList
              : styles.list
          }
          ListEmptyComponent={
            emptyState
          }
        />
      )}
    </View>
  );
}