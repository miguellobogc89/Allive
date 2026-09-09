// src/components/live/types.ts

export type LiveCreator = {
  id?: string;
  username?: string;
  displayName?: string | null;
  avatarUrl?: string | null;
};

export type ActiveLive = {
  id: string;
  roomName: string;
  title?: string | null;
  eventName?: string | null;
  placeName?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  creator?: LiveCreator | null;
};

export type LiveComment = {
  id: string;
  username: string;
  text: string;
  likes: number;
  liked?: boolean;
};
