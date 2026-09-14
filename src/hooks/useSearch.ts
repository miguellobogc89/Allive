// src/hooks/useSearch.ts

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  searchAll,
  type SearchResponse,
} from "../api/searchApi";

import {
  subscribeToLiveMetrics,
  type LiveMetricUpdate,
} from "../api/liveRealtimeApi";

type UseSearchOptions = {
  query: string;
  token: string | null;
  currentUserId?: string | null;
};

const EMPTY_RESPONSE:
  SearchResponse = {
    query: "",
    contents: [],
    users: [],
  };

function applyMetricUpdate(
  response: SearchResponse,
  update: LiveMetricUpdate,
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

export function useSearch({
  query,
  token,
  currentUserId,
}: UseSearchOptions) {
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
              (resultUser) =>
                resultUser.id !==
                currentUserId,
            ),
        });
      },
      [
        currentUserId,
        query,
        token,
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

  const refresh =
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

  return {
    response,
    loading,
    refreshing,
    error,
    refresh,
  };
}