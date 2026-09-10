// src/components/profile/profileTypes.ts

export type ProfileVideoItem = {
  id: string;
  title: string;
  placeName: string;
  startedAt: string;
  endedAt: string | null;
  thumbnailUrl: string | null;
  viewerCount?: number;
  isMock?: boolean;
};
