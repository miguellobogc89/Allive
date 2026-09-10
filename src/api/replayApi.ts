// src/api/replayApi.ts

import {
  API_URL,
} from "./apiConfig";

export type ReplayCreator = {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
};

export type ReplayItem = {
  id: string;
  roomName: string;

  title: string | null;
  description: string | null;
  eventName: string | null;

  placeName: string | null;
  latitude: number | null;
  longitude: number | null;

  startedAt: string;
  endedAt: string;

  thumbnailUrl: string | null;

  likeCount: number;
  commentCount: number;

  creator: ReplayCreator;
};

export async function getReplays(
  signal?: AbortSignal,
): Promise<ReplayItem[]> {
  const response = await fetch(
    `${API_URL}/api/lives/replays`,
    {
      method: "GET",
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(
      `Replay request failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<
    ReplayItem[]
  >;
}