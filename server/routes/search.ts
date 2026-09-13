// server/routes/search.ts

import type {
  Express,
} from "express";

import {
  requireAuth,
  type AuthenticatedRequest,
} from "../auth";

import {
  prisma,
} from "../db";

import {
  getParticipantRole,
  roomService,
} from "../livekit";

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 50;

const DEV_ROOM_PREFIX =
  "allive_dev_";

function getQueryValue(
  value: unknown,
) {
  if (
    typeof value !==
    "string"
  ) {
    return "";
  }

  return value
    .trim()
    .slice(0, 100);
}

function getLimit(
  value: unknown,
) {
  if (
    typeof value !==
    "string"
  ) {
    return DEFAULT_LIMIT;
  }

  const parsed =
    Number.parseInt(
      value,
      10,
    );

  if (
    !Number.isFinite(
      parsed,
    ) ||
    parsed < 1
  ) {
    return DEFAULT_LIMIT;
  }

  return Math.min(
    parsed,
    MAX_LIMIT,
  );
}

const userSelect = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
} as const;

const contentSelect = {
  id: true,
  roomName: true,
  status: true,

  title: true,
  description: true,
  eventName: true,

  placeName: true,
  latitude: true,
  longitude: true,

  thumbnailUrl: true,

  startedAt: true,
  endedAt: true,

  recording_url: true,
  replay_saved_at: true,
  replay_visible_until: true,

  creator: {
    select: userSelect,
  },

  _count: {
    select: {
      live_likes: true,
    },
  },
} as const;

type SelectedContent =
  Awaited<
    ReturnType<
      typeof prisma.liveSession.findFirst<{
        select: typeof contentSelect;
      }>
    >
  >;

type ExistingContent =
  NonNullable<SelectedContent>;

async function getViewerCount(
  roomName: string,
) {
  try {
    const participants =
      await roomService
        .listParticipants(
          roomName,
        );

    let viewers = 0;

    for (
      const participant
      of participants
    ) {
      const role =
        getParticipantRole(
          participant.metadata,
          participant.identity,
        );

      if (
        role ===
        "viewer"
      ) {
        viewers += 1;
      }
    }

    return viewers;
  } catch {
    return 0;
  }
}

async function mapContent(
  content: ExistingContent,
) {
  const isLive =
    content.status ===
    "LIVE";

  const viewerCount =
    isLive
      ? await getViewerCount(
          content.roomName,
        )
      : 0;

  return {
    id: content.id,

    contentType:
      isLive
        ? "live"
        : "replay",

    title:
      content.title,

    description:
      content.description,

    eventName:
      content.eventName,

    placeName:
      content.placeName,

    latitude:
      content.latitude,

    longitude:
      content.longitude,

    thumbnailUrl:
      content.thumbnailUrl,

    startedAt:
      content.startedAt,

    endedAt:
      content.endedAt,

    recordingUrl:
      content.recording_url,

    replaySavedAt:
      content.replay_saved_at,

    replayVisibleUntil:
      content.replay_visible_until,

    likeCount:
      content._count
        .live_likes,

    viewerCount,

    creator:
      content.creator,
  };
}

async function mapContents(
  contents:
    ExistingContent[],
) {
  return Promise.all(
    contents.map(
      mapContent,
    ),
  );
}

export function registerSearchRoutes(
  app: Express,
) {
  app.get(
    "/api/search",
    requireAuth,

    async (
      req:
        AuthenticatedRequest,
      res,
    ) => {
      try {
        const currentUserId =
          req.authUser!.id;

        const query =
          getQueryValue(
            req.query.q,
          );

        const limit =
          getLimit(
            req.query.limit,
          );

        const now =
          new Date();

        const contentVisibilityWhere =
          {
            AND: [
              {
                NOT: {
                  roomName: {
                    startsWith:
                      DEV_ROOM_PREFIX,
                  },
                },
              },

              {
                OR: [
                  {
                    status:
                      "LIVE" as const,
                  },

                  {
                    status:
                      "ENDED" as const,

                    recording_url: {
                      not: null,
                    },

                    replay_saved_at: {
                      not: null,
                    },

                    replay_visible_until:
                      {
                        gt: now,
                      },
                  },
                ],
              },
            ],
          };

        const queryWhere =
          query
            ? {
                OR: [
                  {
                    title: {
                      contains:
                        query,
                      mode:
                        "insensitive" as const,
                    },
                  },

                  {
                    description: {
                      contains:
                        query,
                      mode:
                        "insensitive" as const,
                    },
                  },

                  {
                    eventName: {
                      contains:
                        query,
                      mode:
                        "insensitive" as const,
                    },
                  },

                  {
                    placeName: {
                      contains:
                        query,
                      mode:
                        "insensitive" as const,
                    },
                  },

                  {
                    creator: {
                      is: {
                        username: {
                          contains:
                            query,
                          mode:
                            "insensitive" as const,
                        },
                      },
                    },
                  },

                  {
                    creator: {
                      is: {
                        displayName: {
                          contains:
                            query,
                          mode:
                            "insensitive" as const,
                        },
                      },
                    },
                  },
                ],
              }
            : {};

        const [
          contents,
          users,
        ] =
          await Promise.all([
            prisma.liveSession
              .findMany({
                where: {
                  ...contentVisibilityWhere,
                  ...queryWhere,
                },

                orderBy: [
                  {
                    status:
                      "desc",
                  },
                  {
                    startedAt:
                      "desc",
                  },
                ],

                take: limit,

                select:
                  contentSelect,
              }),

            prisma.user
              .findMany({
                where: query
                  ? {
                      id: {
                        not:
                          currentUserId,
                      },

                      OR: [
                        {
                          username: {
                            contains:
                              query,
                            mode:
                              "insensitive",
                          },
                        },

                        {
                          displayName: {
                            contains:
                              query,
                            mode:
                              "insensitive",
                          },
                        },
                      ],
                    }
                  : {
                      id: {
                        not:
                          currentUserId,
                      },
                    },

                orderBy: query
                  ? {
                      username:
                        "asc",
                    }
                  : {
                      createdAt:
                        "desc",
                    },

                take:
                  query
                    ? limit
                    : 12,

                select:
                  userSelect,
              }),
          ]);

        const mappedContents =
          await mapContents(
            contents,
          );

        return res.json({
          query,

          contents:
            mappedContents,

          users,
        });
      } catch (error) {
        console.error(
          "Error buscando:",
          error,
        );

        return res
          .status(500)
          .json({
            error:
              "No se pudo realizar la búsqueda",
          });
      }
    },
  );
}