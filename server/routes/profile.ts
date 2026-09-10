import type { Express } from "express";
import express from "express";
import { requireAuth, type AuthenticatedRequest } from "../auth";
import { prisma } from "../db";
import { uploadProfileAvatarToR2 } from "../profileAvatar/r2";

const MAX_AVATAR_SIZE = 4_000_000;
const AVATAR_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export function registerProfileRoutes(app: Express) {
  app.get("/api/profile/me/stats", requireAuth, async (req: AuthenticatedRequest, res) => {
    const userId = req.authUser!.id;
    const [followers, following, emissions] = await Promise.all([
      prisma.user_follows.count({ where: { following_id: userId } }),
      prisma.user_follows.count({ where: { follower_id: userId } }),
      prisma.liveSession.count({ where: { creatorId: userId, status: "ENDED" } }),
    ]);
    res.json({ followers, following, emissions });
  });

  app.patch("/api/profile/me", requireAuth, async (req: AuthenticatedRequest, res) => {
    const userId = req.authUser!.id;
    const displayName = typeof req.body.displayName === "string"
      ? req.body.displayName.trim().slice(0, 60) || null : undefined;
    const avatarUrl = typeof req.body.avatarUrl === "string"
      ? req.body.avatarUrl.trim() || null
      : req.body.avatarUrl === null ? null : undefined;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { displayName, avatarUrl },
      select: { id:true, username:true, email:true, displayName:true, avatarUrl:true },
    });
    res.json({ user });
  });

  app.put(
    "/api/profile/me/avatar",
    requireAuth,
    express.raw({
      type: AVATAR_CONTENT_TYPES,
      limit: MAX_AVATAR_SIZE,
    }),
    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      try {
        const contentType =
          req.headers["content-type"];

        if (
          typeof contentType !==
            "string" ||
          !AVATAR_CONTENT_TYPES.includes(
            contentType,
          )
        ) {
          return res.status(415).json({
            error:
              "Formato de imagen no soportado",
          });
        }

        if (
          !Buffer.isBuffer(req.body) ||
          req.body.length === 0
        ) {
          return res.status(400).json({
            error: "Imagen invalida",
          });
        }

        const avatarUrl =
          await uploadProfileAvatarToR2({
            userId: req.authUser!.id,
            image: req.body,
            contentType,
          });

        const user =
          await prisma.user.update({
            where: {
              id: req.authUser!.id,
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

        return res.status(500).json({
          error:
            "No se pudo subir la foto de perfil",
        });
      }
    },
  );
}
