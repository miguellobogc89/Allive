// src/components/live/liveRealtime.ts

import type {
  Room,
} from "livekit-client";

import type {
  LiveRealtimeMessage,
} from "./comments/liveCommentTypes";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function publishLiveRealtimeMessage(
  room: Room,
  message: LiveRealtimeMessage,
) {
  await room.localParticipant.publishData(
    encoder.encode(
      JSON.stringify(message),
    ),
    {
      reliable: true,
    },
  );
}

export function parseLiveRealtimeMessage(
  payload: Uint8Array,
): LiveRealtimeMessage | null {
  try {
    const value = JSON.parse(
      decoder.decode(payload),
    );

    if (
      value?.type === "live-comment" &&
      value?.comment?.id &&
      value?.comment?.liveSessionId
    ) {
      return value as LiveRealtimeMessage;
    }

    return null;
  } catch {
    return null;
  }
}
