// server/livekit.ts

import { randomUUID } from "node:crypto";
import {
  AccessToken,
  RoomServiceClient,
  WebhookReceiver,
} from "livekit-server-sdk";

export type LiveRole = "broadcaster" | "viewer";

export const LIVEKIT_URL = process.env.LIVEKIT_URL;
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;

if (!LIVEKIT_URL) {
  throw new Error("LIVEKIT_URL no est\u00e1 definida");
}

if (!LIVEKIT_API_KEY) {
  throw new Error("LIVEKIT_API_KEY no est\u00e1 definida");
}

if (!LIVEKIT_API_SECRET) {
  throw new Error("LIVEKIT_API_SECRET no est\u00e1 definida");
}

const LIVEKIT_HTTP_URL = LIVEKIT_URL.replace(/^wss:/, "https:").replace(
  /^ws:/,
  "http:"
);

export const roomService = new RoomServiceClient(
  LIVEKIT_HTTP_URL,
  LIVEKIT_API_KEY,
  LIVEKIT_API_SECRET
);

export const webhookReceiver = new WebhookReceiver(
  LIVEKIT_API_KEY,
  LIVEKIT_API_SECRET
);

export function getParticipantRole(
  metadata?: string,
  identity?: string
): LiveRole | null {
  if (metadata) {
    try {
      const parsed = JSON.parse(metadata);

      if (parsed?.role === "broadcaster" || parsed?.role === "viewer") {
        return parsed.role;
      }
    } catch {
      // Fallback a identity.
    }
  }

  if (identity?.startsWith("broadcaster-")) {
    return "broadcaster";
  }

  if (identity?.startsWith("viewer-")) {
    return "viewer";
  }

  return null;
}

export async function createLiveKitToken(
  roomName: string,
  role: LiveRole,
  identity?: string,
) {
  const participantIdentity =
    identity ?? `${role}-${randomUUID()}`;

  const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: participantIdentity,
    ttl: "2h",

    attributes: {
      role,
    },

    metadata: JSON.stringify({
      role,
    }),
  });

  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: role === "broadcaster",
    canSubscribe: true,
    canPublishData: false,
  });

  return token.toJwt();
}
