//server/routes/userProfiles.ts

import { randomUUID } from "crypto";
import type { Express } from "express";

import {
  requireAuth,
  type AuthenticatedRequest,
} from "../auth";
import { prisma } from "../db";

function getParam(
  value: string | string[],
): string {
  return Array.isArray(value)
    ? value[0]
    : value;
}

export function registerUserProfileRoutes(
  app: Express,
) {
  app.get(
    "/api/users/:userId/profile",
    requireAuth,
    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      const viewerId =
        req.authUser!.id;

      const userId = getParam(
        req.params.userId,
      );

      const user =
        await prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        });

      if (!user) {
        res.status(404).json({
          error:
            "Usuario no encontrado",
        });

        return;
      }

      const [
        followers,
        following,
        emissions,
        isFollowing,
        lives,
      ] = await Promise.all([
        prisma.user_follows.count({
          where: {
            following_id: userId,
          },
        }),

        prisma.user_follows.count({
          where: {
            follower_id: userId,
          },
        }),

        prisma.liveSession.count({
          where: {
            creatorId: userId,
            status: "ENDED",
          },
        }),

        prisma.user_follows.findUnique({
          where: {
            follower_id_following_id:
              {
                follower_id:
                  viewerId,
                following_id:
                  userId,
              },
          },
        }),

        prisma.liveSession.findMany({
          where: {
            creatorId: userId,
            status: "ENDED",
          },
          orderBy: {
            startedAt: "desc",
          },
          take: 20,
          select: {
            id: true,
            title: true,
            placeName: true,
            startedAt: true,
            endedAt: true,
            thumbnailUrl: true,
          },
        }),
      ]);

      res.json({
        user,
        stats: {
          followers,
          following,
          emissions,
        },
        isFollowing:
          Boolean(isFollowing),
        lives,
      });
    },
  );

  app.post(
    "/api/users/:userId/follow",
    requireAuth,
    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      const followerId =
        req.authUser!.id;

      const followingId =
        getParam(
          req.params.userId,
        );

      if (
        followerId === followingId
      ) {
        res.status(400).json({
          error:
            "No puedes seguirte a ti mismo",
        });

        return;
      }

      const target =
        await prisma.user.findUnique({
          where: {
            id: followingId,
          },
          select: {
            id: true,
          },
        });

      if (!target) {
        res.status(404).json({
          error:
            "Usuario no encontrado",
        });

        return;
      }

      await prisma.user_follows.upsert(
        {
          where: {
            follower_id_following_id:
              {
                follower_id:
                  followerId,
                following_id:
                  followingId,
              },
          },

          update: {},

          create: {
            id: randomUUID(),
            follower_id:
              followerId,
            following_id:
              followingId,
          },
        },
      );

      const followers =
        await prisma.user_follows.count(
          {
            where: {
              following_id:
                followingId,
            },
          },
        );

      res.json({
        isFollowing: true,
        followers,
      });
    },
  );

  app.delete(
    "/api/users/:userId/follow",
    requireAuth,
    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      const followerId =
        req.authUser!.id;

      const followingId =
        getParam(
          req.params.userId,
        );

      await prisma.user_follows.deleteMany(
        {
          where: {
            follower_id:
              followerId,
            following_id:
              followingId,
          },
        },
      );

      const followers =
        await prisma.user_follows.count(
          {
            where: {
              following_id:
                followingId,
            },
          },
        );

      res.json({
        isFollowing: false,
        followers,
      });
    },
  );
}