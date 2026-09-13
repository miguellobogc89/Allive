// src/api/followingApi.ts

import {
  API_URL,
} from "./apiConfig";

import type {
  ActiveLive,
} from "../components/live/types";

import type {
  ReplayItem,
} from "./replayApi";

export type FollowingFeed = {
  lives: ActiveLive[];
  replays: ReplayItem[];
};

export async function getFollowingFeed(
  token: string,
  signal?: AbortSignal,
): Promise<FollowingFeed> {
  const response =
    await fetch(
      `${API_URL}/api/lives/following`,
      {
        method: "GET",

        headers: {
          Authorization:
            `Bearer ${token}`,
        },

        signal,
      },
    );

  if (!response.ok) {
    throw new Error(
      `Following feed request failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<FollowingFeed>;
}