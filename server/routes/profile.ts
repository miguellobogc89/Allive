// server/routes/profile.ts

import type {
  Express,
} from "express";

import express from "express";

import {
  requireAuth,
  type AuthenticatedRequest,
} from "../auth";

import {
  prisma,
} from "../db";

import {
  uploadProfileAvatarToR2,
} from "../profileAvatar/r2";

import {
  getProfileStats,
} from "../services/profile/profile-stats.service";

const MAX_AVATAR_SIZE =
  4_000_000;

const AVATAR_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export function registerProfileRoutes(
  app: Express,
) {
  app.get(
    "/api/profile/me/stats",
    requireAuth,
    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      try {
        const stats =
          await getProfileStats(
            req.authUser!.id,
          );

        return res.json(
          stats,
        );
      } catch (error) {
        console.error(
          "Error obteniendo estadísticas de perfil:",
          error,
        );

        return res
          .status(500)
          .json({
            error:
              "No se pudieron obtener las estadísticas del perfil",
          });
      }
    },
  );

  app.get(
    "/api/profile/me/lives",
    requireAuth,
    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      try {
        const lives =
          await prisma.liveSession.findMany({
            where: {
              creatorId:
                req.authUser!.id,

              endedAt: {
                not: null,
              },
            },

            orderBy: {
              endedAt:
                "desc",
            },

            select: {
              id: true,
              title: true,
              placeName: true,
              startedAt: true,
              endedAt: true,
              thumbnailUrl: true,
            },
          });

        return res.json(
          lives,
        );
      } catch (error) {
        console.error(
          "Error obteniendo emisiones del perfil:",
          error,
        );

        return res
          .status(500)
          .json({
            error:
              "No se pudieron obtener las emisiones del perfil",
          });
      }
    },
  );

  app.patch(
    "/api/profile/me",
    requireAuth,
    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      const userId =
        req.authUser!.id;

      let displayName:
        | string
        | null
        | undefined;

      if (
        typeof req.body
          .displayName ===
        "string"
      ) {
        const normalized =
          req.body.displayName
            .trim()
            .slice(
              0,
              60,
            );

        if (normalized) {
          displayName =
            normalized;
        } else {
          displayName =
            null;
        }
      }

      let avatarUrl:
        | string
        | null
        | undefined;

      if (
        typeof req.body
          .avatarUrl ===
        "string"
      ) {
        const normalized =
          req.body.avatarUrl.trim();

        if (normalized) {
          avatarUrl =
            normalized;
        } else {
          avatarUrl =
            null;
        }
      } else if (
        req.body.avatarUrl ===
        null
      ) {
        avatarUrl = null;
      }

      const user =
        await prisma.user.update({
          where: {
            id: userId,
          },

          data: {
            displayName,
            avatarUrl,
          },

          select: {
            id: true,
            username: true,
            email: true,
            displayName: true,
            avatarUrl: true,
          },
        });

      return res.json({
        user,
      });
    },
  );

  app.put(
    "/api/profile/me/avatar",

    requireAuth,

    express.raw({
      type:
        AVATAR_CONTENT_TYPES,

      limit:
        MAX_AVATAR_SIZE,
    }),

    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      try {
        const contentType =
          req.headers[
            "content-type"
          ];

        if (
          typeof contentType !==
            "string" ||
          !AVATAR_CONTENT_TYPES.includes(
            contentType,
          )
        ) {
          return res
            .status(415)
            .json({
              error:
                "Formato de imagen no soportado",
            });
        }

        if (
          !Buffer.isBuffer(
            req.body,
          ) ||
          req.body.length ===
            0
        ) {
          return res
            .status(400)
            .json({
              error:
                "Imagen invalida",
            });
        }

        const avatarUrl =
          await uploadProfileAvatarToR2(
            {
              userId:
                req.authUser!.id,

              image:
                req.body,

              contentType,
            },
          );

        const user =
          await prisma.user.update({
            where: {
              id:
                req.authUser!.id,
            },

            data: {
              avatarUrl,
            },

            select: {
              id: true,
              username: true,
              email: true,
              displayName: true,
              avatarUrl: true,
            },
          });

        return res.json({
          user,
        });
      } catch (error) {
        console.error(
          "Error subiendo avatar:",
          error,
        );

        return res
          .status(500)
          .json({
            error:
              "No se pudo subir la foto de perfil",
          });
      }
    },
  );
}