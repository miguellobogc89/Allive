// src/api/searchApi.ts

import {
  API_URL,
} from "./apiConfig";

export type SearchUser = {
  id: string;
  username: string;

  displayName:
    | string
    | null;

  avatarUrl:
    | string
    | null;
};

export type SearchContentType =
  | "live"
  | "replay";

export type SearchContent = {
  id: string;

  contentType:
    SearchContentType;

  title:
    | string
    | null;

  description:
    | string
    | null;

  eventName:
    | string
    | null;

  placeName:
    | string
    | null;

  latitude:
    | number
    | null;

  longitude:
    | number
    | null;

  thumbnailUrl:
    | string
    | null;

  startedAt: string;

  endedAt:
    | string
    | null;

  recordingUrl:
    | string
    | null;

  replaySavedAt:
    | string
    | null;

  replayVisibleUntil:
    | string
    | null;

  likeCount: number;
  viewerCount: number;

  creator: SearchUser;
};

export type SearchResponse = {
  query: string;

  contents:
    SearchContent[];

  users:
    SearchUser[];
};

export async function searchAll(
  query: string,
  token: string | null,
  signal?: AbortSignal,
): Promise<SearchResponse> {
  const params =
    new URLSearchParams();

  const cleanQuery =
    query.trim();

  if (
    cleanQuery.length >
    0
  ) {
    params.set(
      "q",
      cleanQuery,
    );
  }

  const suffix =
    params.toString();

  let url =
    `${API_URL}/api/search`;

  if (
    suffix.length > 0
  ) {
    url += `?${suffix}`;
  }

  const response =
    await fetch(
      url,
      {
        method: "GET",

        headers: token
          ? {
              Authorization:
                `Bearer ${token}`,
            }
          : undefined,

        signal,
      },
    );

  if (
    !response.ok
  ) {
    throw new Error(
      `Search request failed with status ${response.status}`,
    );
  }

  return response.json() as
    Promise<SearchResponse>;
}