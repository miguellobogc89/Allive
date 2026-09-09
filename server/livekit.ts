// server/livekit.ts

import { randomUUID } from "node:crypto";
import {
  AccessToken,
  RoomServiceClient,
  WebhookReceiver,
} from "livekit-server-sdk";

export type LiveRole = "broadcaster" | "viewer";

export type LiveParticipantMetadata = {
  role: LiveRole;
  actorType?: "user" | "guest";
  actorId?: string;
  username?: string;
};

export const LIVEKIT_URL = process.env.LIVEKIT_URL;

const LIVEKIT_API_KEY =
  process.env.LIVEKIT_API_KEY;

const LIVEKIT_API_SECRET =
  process.env.LIVEKIT_API_SECRET;

if (!LIVEKIT_URL) {
  throw new Error(
    "LIVEKIT_URL no está definida",
  );
}

if (!LIVEKIT_API_KEY) {
  throw new Error(
    "LIVEKIT_API_KEY no está definida",
  );
}

if (!LIVEKIT_API_SECRET) {
  throw new Error(
    "LIVEKIT_API_SECRET no está definida",
  );
}

const LIVEKIT_HTTP_URL =
  LIVEKIT_URL
    .replace(/^wss:/, "https:")
    .replace(/^ws:/, "http:");

export const roomService =
  new RoomServiceClient(
    LIVEKIT_HTTP_URL,
    LIVEKIT_API_KEY,
    LIVEKIT_API_SECRET,
  );

export const webhookReceiver =
  new WebhookReceiver(
    LIVEKIT_API_KEY,
    LIVEKIT_API_SECRET,
  );

export function getParticipantRole(
  metadata?: string,
  identity?: string,
): LiveRole | null {
  if (metadata) {
    try {
      const parsed = JSON.parse(metadata);

      if (
        parsed?.role === "broadcaster" ||
        parsed?.role === "viewer"
      ) {
        return parsed.role;
      }
    } catch {
      // Fallback a identity.
    }
  }

  if (
    identity?.startsWith(
      "broadcaster-",
    )
  ) {
    return "broadcaster";
  }

  if (
    identity?.startsWith(
      "viewer-",
    )
  ) {
    return "viewer";
  }

  return null;
}

export async function createLiveKitToken(
  roomName: string,
  role: LiveRole,
  identity?: string,
  metadata?: Omit<
    LiveParticipantMetadata,
    "role"
  >,
) {
  const participantIdentity =
    identity ??
    `${role}-${randomUUID()}`;

  const participantMetadata:
    LiveParticipantMetadata = {
    role,
    ...metadata,
  };

  const attributes:
    Record<string, string> = {
    role,
  };

  if (
    participantMetadata.actorType
  ) {
    attributes.actorType =
      participantMetadata.actorType;
  }

  if (participantMetadata.actorId) {
    attributes.actorId =
      participantMetadata.actorId;
  }

  if (
    participantMetadata.username
  ) {
    attributes.username =
      participantMetadata.username;
  }

  const token = new AccessToken(
    LIVEKIT_API_KEY,
    LIVEKIT_API_SECRET,
    {
      identity:
        participantIdentity,

      ttl: "2h",

      attributes,

      metadata:
        JSON.stringify(
          participantMetadata,
        ),
    },
  );

  token.addGrant({
    roomJoin: true,
    room: roomName,

    canPublish:
      role === "broadcaster",

    canSubscribe: true,
    canPublishData: false,
  });

  return token.toJwt();
}