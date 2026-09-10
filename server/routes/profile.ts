import type { Express } from "express";
import { requireAuth, type AuthenticatedRequest } from "../auth";
import { prisma } from "../db";

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
}
