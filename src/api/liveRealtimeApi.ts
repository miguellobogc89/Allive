// src/api/liveRealtimeApi.ts

import {
  API_URL,
} from "./apiConfig";

export type LiveMetricUpdate = {
  type: "live-metrics";
  liveId: string;
  likeCount?: number;
  viewerCount?: number;
  thumbnailUrl?: string;
};

type LiveRealtimeMessage =
  | LiveMetricUpdate
  | {
      type: "connected";
    };

export function subscribeToLiveMetrics(
  onUpdate: (
    update: LiveMetricUpdate,
  ) => void,
) {
  if (
    typeof EventSource ===
    "undefined"
  ) {
    return () => {};
  }

  const source =
    new EventSource(
      `${API_URL}/api/live/realtime`,
    );

  source.onmessage = (
    event,
  ) => {
    try {
      const message =
        JSON.parse(
          event.data,
        ) as LiveRealtimeMessage;

      if (
        message.type !==
        "live-metrics"
      ) {
        return;
      }

      onUpdate(message);
    } catch (error) {
      console.error(
        "Allive realtime parse error:",
        error,
      );
    }
  };

  return () => {
    source.close();
  };
}

export async function refreshLiveViewerCount(
  liveId: string,
) {
  try {
    await fetch(
      `${API_URL}/api/live/realtime/${liveId}/viewers/refresh`,
      {
        method: "POST",
      },
    );
  } catch (error) {
    console.error(
      "Allive viewer refresh error:",
      error,
    );
  }
}