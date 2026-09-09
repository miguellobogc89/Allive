// server/liveThumbnail/liveThumbnailService.ts

import {
  prisma,
} from "../db";

import {
  publishLiveMetricUpdate,
} from "../services/liveRealtime";

import {
  uploadThumbnailToR2,
} from "./r2";

export async function updateLiveThumbnail(
  liveSessionId: string,
  creatorId: string,
  image: Buffer,
) {
  const live =
    await prisma.liveSession.findUnique({
      where: {
        id: liveSessionId,
      },
    });

  if (!live) {
    throw new Error(
      "LIVE_NOT_FOUND",
    );
  }

  if (
    live.creatorId !== creatorId
  ) {
    throw new Error(
      "LIVE_FORBIDDEN",
    );
  }

  if (
    live.status !== "LIVE"
  ) {
    throw new Error(
      "LIVE_ENDED",
    );
  }

  const thumbnailUrl =
    await uploadThumbnailToR2(
      liveSessionId,
      image,
    );

  await prisma.liveSession.update({
    where: {
      id: liveSessionId,
    },

    data: {
      thumbnailUrl,
    },
  });

  publishLiveMetricUpdate({
    type: "live-metrics",
    liveId: liveSessionId,
    thumbnailUrl,
  });

  return thumbnailUrl;
}