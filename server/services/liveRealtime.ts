// server/services/liveRealtime.ts

import type {
  Response,
} from "express";

export type LiveMetricUpdate = {
  type: "live-metrics";
  liveId: string;
  likeCount?: number;
  viewerCount?: number;
};

const clients =
  new Set<Response>();

export function addLiveRealtimeClient(
  response: Response,
) {
  clients.add(response);

  return () => {
    clients.delete(response);
  };
}

export function publishLiveMetricUpdate(
  update: LiveMetricUpdate,
) {
  const payload =
    `data: ${JSON.stringify(update)}\n\n`;

  for (const client of clients) {
    try {
      client.write(payload);
    } catch {
      clients.delete(client);
    }
  }
}

export function getLiveRealtimeClientCount() {
  return clients.size;
}