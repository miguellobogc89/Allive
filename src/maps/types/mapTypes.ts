// src/maps/types/mapTypes.ts

export type MapLiveCreator = {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
};

export type MapLive = {
  id: string;
  roomName: string;
  creatorId: string;
  status: "LIVE" | "ENDED";
  title: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  placeName: string | null;
  startedAt: string;
  eventName: string | null;
  creator: MapLiveCreator;
};

export type MappedLive = MapLive & {
  latitude: number;
  longitude: number;
};

export type MapCoordinate = {
  latitude: number;
  longitude: number;
};
