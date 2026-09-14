// profile-stats.service.ts
import { prisma } from "../../db";

export type ProfileStatsResult = {
  hoursLive: number;
  community: number;
  totalViews: null;
  liveScore: null;
};

export async function getProfileStats(
  userId: string,
): Promise<ProfileStatsResult> {
  const [followers, endedLives] =
    await Promise.all([
      prisma.user_follows.count({
        where: {
          following_id: userId,
        },
      }),

      prisma.liveSession.findMany({
        where: {
          creatorId: userId,
          status: "ENDED",
          endedAt: {
            not: null,
          },
        },

        select: {
          startedAt: true,
          endedAt: true,
        },
      }),
    ]);

  const totalMilliseconds =
    endedLives.reduce(
      (total, live) => {
        if (!live.endedAt) {
          return total;
        }

        const duration =
          live.endedAt.getTime() -
          live.startedAt.getTime();

        return (
          total +
          Math.max(duration, 0)
        );
      },
      0,
    );

  return {
    hoursLive:
      totalMilliseconds /
      (1000 * 60 * 60),

    community: followers,

    // Todavía no existe persistencia
    // real para estas métricas.
    totalViews: null,
    liveScore: null,
  };
}