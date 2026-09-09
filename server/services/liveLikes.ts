// server/services/liveLikes.ts

import { randomUUID } from "node:crypto";

import { prisma } from "../db";

const GUEST_ID_PATTERN =
  /^guest_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type LiveLikeActor =
  | {
      type: "user";
      id: string;
    }
  | {
      type: "guest";
      id: string;
    };

export function parseGuestActor(
  value: unknown,
): LiveLikeActor | null {
  if (
    typeof value !== "string" ||
    !GUEST_ID_PATTERN.test(value)
  ) {
    return null;
  }

  return {
    type: "guest",
    id: value,
  };
}

function actorWhere(
  liveSessionId: string,
  actor: LiveLikeActor,
) {
  return actor.type === "user"
    ? {
        live_session_id: liveSessionId,
        user_id: actor.id,
      }
    : {
        live_session_id: liveSessionId,
        guest_id: actor.id,
      };
}

export async function getLiveLikeState(
  liveSessionId: string,
  actor: LiveLikeActor | null,
) {
  const [count, existingLike] = await Promise.all([
    prisma.live_likes.count({
      where: {
        live_session_id: liveSessionId,
      },
    }),

    actor
      ? prisma.live_likes.findFirst({
          where: actorWhere(
            liveSessionId,
            actor,
          ),
          select: {
            id: true,
          },
        })
      : Promise.resolve(null),
  ]);

  return {
    count,
    liked: Boolean(existingLike),
  };
}

export async function toggleLiveLike(
  liveSessionId: string,
  actor: LiveLikeActor,
) {
  return prisma.$transaction(async (tx) => {
    const existingLike =
      await tx.live_likes.findFirst({
        where: actorWhere(
          liveSessionId,
          actor,
        ),
        select: {
          id: true,
        },
      });

    if (existingLike) {
      await tx.live_likes.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await tx.live_likes.create({
        data: {
          id: randomUUID(),
          live_session_id:
            liveSessionId,
          user_id:
            actor.type === "user"
              ? actor.id
              : null,
          guest_id:
            actor.type === "guest"
              ? actor.id
              : null,
        },
      });
    }

    const count =
      await tx.live_likes.count({
        where: {
          live_session_id:
            liveSessionId,
        },
      });

    return {
      count,
      liked: !existingLike,
    };
  });
}
