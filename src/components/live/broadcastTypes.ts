// src/components/live/broadcastTypes.ts

export type LiveKitTokenResponse = {
  serverUrl: string;
  participantToken: string;
  role: "broadcaster" | "viewer";
};

export type BroadcastLocation = {
  latitude: number;
  longitude: number;
  placeName: string;
};

export type LocationStatus = "loading" | "ready" | "unavailable";
