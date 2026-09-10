// src/components/live/comments/liveCommentTypes.ts

export type LiveCommentModel = {
  id: string;
  liveSessionId: string;
  actorType: "user" | "guest";
  actorId: string;
  username: string;
  avatarUrl: string | null;
  body: string;
  createdAt: string;
};

export type LiveRealtimeMessage = {
  type: "live-comment";
  comment: LiveCommentModel;
};
