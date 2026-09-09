// src/components/live/broadcastTypes.ts

export type BroadcastLocation = {
  latitude: number;
  longitude: number;
  placeName: string;
};

export type LocationStatus = "loading" | "ready" | "unavailable";
