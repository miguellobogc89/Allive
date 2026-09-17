// src/navigation/navigation.types.ts

export type AppTab =
  | "now"
  | "hot"
  | "emit"
  | "search"
  | "profile";

export type NavigationState = {
  activeTab: AppTab;
  selectedUserId: string | null;
  notificationsVisible: boolean;
  requestedLiveId: string | null;
  requestedReplayId: string | null;
};