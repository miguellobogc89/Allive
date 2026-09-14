// server/services/profile/profile-stats.service.ts

import { prisma } from "../../db";

export type ProfileStatsResult = {
  followers: number;
  emissions: number;
  averageViewers: null;
};

export async function getProfileStats(
  userId: string,
): Promise<ProfileStatsResult> {
  const [
    followers,
    emissions,
  ] = await Promise.all([
    prisma.user_follows.count({
      where: {
        following_id: userId,
      },
    }),

    prisma.liveSession.count({
      where: {
        creatorId: userId,
        endedAt: {
          not: null,
        },
      },
    }),
  ]);

  return {
    followers,
    emissions,
    averageViewers: null,
  };
}