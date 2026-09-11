// server/services/liveRealtime.ts

import type {
  Response,
} from "express";

import {
  prisma,
} from "../db";

import {
  getParticipantRole,
  roomService,
} from "../livekit";

export type LiveMetricUpdate = {
  type: "live-metrics";
  liveId: string;
  likeCount?: number;
  viewerCount?: number;
  thumbnailUrl?: string;
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
    `data: ${JSON.stringify(
      update,
    )}\n\n`;

  for (const client of clients) {
    try {
      client.write(payload);
    } catch {
      clients.delete(client);
    }
  }
}

export async function publishViewerCountForLive(
  liveId: string,
) {
  const live =
    await prisma.liveSession.findUnique({
      where: {
        id: liveId,
      },

      select: {
        id: true,
        roomName: true,
        status: true,
      },
    });

  if (
    !live ||
    live.status !== "LIVE"
  ) {
    return;
  }

  await publishViewerCountForRoom(
    live.roomName,
  );
}

export async function publishViewerCountForRoom(
  roomName: string,
) {
  const live =
    await prisma.liveSession.findFirst({
      where: {
        roomName,
        status: "LIVE",
      },

      select: {
        id: true,
      },
    });

  if (!live) {
    return;
  }

  try {
    const participants =
      await roomService.listParticipants(
        roomName,
      );

    let viewerCount = 0;

    for (
      const participant of
      participants
    ) {
      if (
        getParticipantRole(
          participant.metadata,
          participant.identity,
        ) === "viewer"
      ) {
        viewerCount += 1;
      }
    }

    publishLiveMetricUpdate({
      type: "live-metrics",
      liveId: live.id,
      viewerCount,
    });
} catch (error) {
    const livekitError =
      error as {
        status?: number;
        code?: string;
      };

    if (
      livekitError.status === 404 ||
      livekitError.code === "not_found"
    ) {
      publishLiveMetricUpdate({
        type: "live-metrics",
        liveId: live.id,
        viewerCount: 0,
      });

      return;
    }

    console.error(
      "Error calculando viewers realtime:",
      error,
    );
  }
}

export function publishViewerCountZero(
  liveId: string,
) {
  publishLiveMetricUpdate({
    type: "live-metrics",
    liveId,
    viewerCount: 0,
  });
}