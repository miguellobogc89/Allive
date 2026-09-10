// server/services/liveComments.ts

import {
  randomUUID,
} from "node:crypto";

import {
  prisma,
} from "../db";

export type CommentActor =
  | {
      type: "user";
      id: string;
      username: string;
      avatarUrl: string | null;
    }
  | {
      type: "guest";
      id: string;
      username: string;
    };

export function parseGuestCommentActor(
  guestId: unknown,
  username: unknown,
): CommentActor | null {
  if (
    typeof guestId !== "string" ||
    !guestId.startsWith("guest_") ||
    guestId.length > 100 ||
    typeof username !== "string"
  ) {
    return null;
  }

  const normalizedUsername =
    username.trim().slice(0, 32);

  if (!normalizedUsername) {
    return null;
  }

  return {
    type: "guest",
    id: guestId,
    username: normalizedUsername,
  };
}

export async function listLiveComments(
  liveSessionId: string,
) {
  const comments =
    await prisma.live_comments.findMany({
      where: {
        live_session_id:
          liveSessionId,
      },

      include: {
        users: {
          select: {
            avatarUrl: true,
          },
        },
      },

      orderBy: {
        created_at: "asc",
      },

      take: 100,
    });

  return comments.map(
    (comment) => ({
      id: comment.id,

      liveSessionId:
        comment.live_session_id,

      actorType:
        comment.user_id
          ? ("user" as const)
          : ("guest" as const),

      actorId:
        comment.user_id ??
        comment.guest_id!,

      username:
        comment.username,

      avatarUrl:
        comment.users?.avatarUrl ??
        null,

      body: comment.body,

      createdAt:
        comment.created_at.toISOString(),
    }),
  );
}

export async function createLiveComment(
  liveSessionId: string,
  actor: CommentActor,
  body: string,
) {
  const normalizedBody =
    body.trim();

  if (
    !normalizedBody ||
    normalizedBody.length > 280
  ) {
    throw new Error(
      "INVALID_COMMENT",
    );
  }

  const comment =
    await prisma.live_comments.create({
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

        username:
          actor.username,

        body:
          normalizedBody,
      },
    });

  return {
    id: comment.id,

    liveSessionId:
      comment.live_session_id,

    actorType:
      actor.type,

    actorId:
      actor.id,

    username:
      comment.username,

    avatarUrl:
      actor.type === "user"
        ? actor.avatarUrl
        : null,

    body:
      comment.body,

    createdAt:
      comment.created_at.toISOString(),
  };
}
