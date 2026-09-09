// server/routes/search.ts

import type { Express } from "express";

import { prisma } from "../db";
import {
  getParticipantRole,
  roomService,
} from "../livekit";

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 50;
const DEV_ROOM_PREFIX = "allive_dev_";

function getQueryValue(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, 100);
}

function getLimit(value: unknown) {
  if (typeof value !== "string") {
    return DEFAULT_LIMIT;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) {
    return DEFAULT_LIMIT;
  }

  if (parsed < 1) {
    return DEFAULT_LIMIT;
  }

  return Math.min(parsed, MAX_LIMIT);
}

const userSelect = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
} as const;

const liveSelect = {
  id: true,
  roomName: true,
  title: true,
  description: true,
  eventName: true,
  placeName: true,
  latitude: true,
  longitude: true,
  thumbnailUrl: true,
  startedAt: true,

  creator: {
    select: userSelect,
  },

  _count: {
    select: {
      live_likes: true,
    },
  },
} as const;

type SelectedLive = {
  id: string;
  roomName: string;
  title: string | null;
  description: string | null;
  eventName: string | null;
  placeName: string | null;
  latitude: number | null;
  longitude: number | null;
  thumbnailUrl: string | null;
  startedAt: Date;

  creator: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };

  _count: {
    live_likes: number;
  };
};

async function getViewerCount(
  roomName: string,
  isSimulated: boolean,
) {
  if (isSimulated) {
    return 0;
  }

  try {
    const participants =
      await roomService.listParticipants(
        roomName,
      );

    let viewers = 0;

    for (const participant of participants) {
      const role = getParticipantRole(
        participant.metadata,
        participant.identity,
      );

      if (role === "viewer") {
        viewers += 1;
      }
    }

    return viewers;
  } catch (error) {
    console.warn(
      `No se pudieron consultar viewers de ${roomName}:`,
      error,
    );

    return 0;
  }
}

async function mapLive(
  live: SelectedLive,
) {
  const isSimulated =
    live.roomName.startsWith(
      DEV_ROOM_PREFIX,
    );

  const viewerCount =
    await getViewerCount(
      live.roomName,
      isSimulated,
    );

  return {
    id: live.id,
    title: live.title,
    description: live.description,
    eventName: live.eventName,
    placeName: live.placeName,
    latitude: live.latitude,
    longitude: live.longitude,
    thumbnailUrl: live.thumbnailUrl,
    startedAt: live.startedAt,
    isSimulated,
    likeCount: live._count.live_likes,
    viewerCount,
    creator: live.creator,
  };
}

async function mapLives(
  lives: SelectedLive[],
) {
  return Promise.all(
    lives.map(mapLive),
  );
}

export function registerSearchRoutes(
  app: Express,
) {
  app.get(
    "/api/search",
    async (req, res) => {
      try {
        const query = getQueryValue(
          req.query.q,
        );

        const limit = getLimit(
          req.query.limit,
        );

        if (!query) {
          const [lives, users] =
            await Promise.all([
              prisma.liveSession.findMany({
                where: {
                  status: "LIVE",
                },

                orderBy: {
                  startedAt: "desc",
                },

                take: limit,
                select: liveSelect,
              }),

              prisma.user.findMany({
                orderBy: {
                  createdAt: "desc",
                },

                take: 12,
                select: userSelect,
              }),
            ]);

          const mappedLives =
            await mapLives(lives);

          return res.json({
            query,
            lives: mappedLives,
            users,
          });
        }

        const [lives, users] =
          await Promise.all([
            prisma.liveSession.findMany({
              where: {
                status: "LIVE",

                OR: [
                  {
                    title: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },

                  {
                    description: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },

                  {
                    eventName: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },

                  {
                    placeName: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },

                  {
                    creator: {
                      is: {
                        username: {
                          contains: query,
                          mode: "insensitive",
                        },
                      },
                    },
                  },

                  {
                    creator: {
                      is: {
                        displayName: {
                          contains: query,
                          mode: "insensitive",
                        },
                      },
                    },
                  },
                ],
              },

              orderBy: {
                startedAt: "desc",
              },

              take: limit,
              select: liveSelect,
            }),

            prisma.user.findMany({
              where: {
                OR: [
                  {
                    username: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },

                  {
                    displayName: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },
                ],
              },

              orderBy: {
                username: "asc",
              },

              take: limit,
              select: userSelect,
            }),
          ]);

        const mappedLives =
          await mapLives(lives);

        return res.json({
          query,
          lives: mappedLives,
          users,
        });
      } catch (error) {
        console.error(
          "Error buscando:",
          error,
        );

        return res.status(500).json({
          error:
            "No se pudo realizar la búsqueda",
        });
      }
    },
  );
}