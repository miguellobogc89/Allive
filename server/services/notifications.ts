import { prisma } from "../db";

export type NotificationType =
  | "LIVE_STARTED"
  | "NEW_FOLLOWER";

export type NotificationTargetType =
  | "LIVE"
  | "USER";

type NotificationInput = {
  recipientId: string;
  actorId: string;
  type: NotificationType;
  text: string;
  actionLabel?: string | null;
  targetType: NotificationTargetType;
  targetId: string;
  dedupeKey: string;
};

type PushPayload = {
  to: string;
  sound: "default";
  title: string;
  body: string;
  data: Record<string, string>;
  channelId?: string;
};

const EXPO_PUSH_URL =
  "https://exp.host/--/api/v2/push/send";
const PUSH_CHUNK_SIZE = 100;

function isUniqueConstraintError(
  error: unknown,
) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code ===
      "P2002"
  );
}

function chunk<T>(
  items: T[],
  size: number,
) {
  const chunks: T[][] = [];

  for (
    let index = 0;
    index < items.length;
    index += size
  ) {
    chunks.push(
      items.slice(index, index + size),
    );
  }

  return chunks;
}

function mapNotification(
  notification: Awaited<
    ReturnType<typeof getNotificationById>
  >,
) {
  if (!notification) {
    return null;
  }

  return {
    id: notification.id,
    type: notification.type,
    text: notification.text,
    actionLabel:
      notification.action_label,
    target: {
      type: notification.target_type,
      id: notification.target_id,
    },
    readAt: notification.read_at,
    createdAt:
      notification.created_at,
    actor:
      notification.users_notifications_actor_idTousers,
  };
}

async function getNotificationById(
  id: string,
) {
  return prisma.notifications.findUnique({
    where: {
      id,
    },
    include: {
      users_notifications_actor_idTousers:
        {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
    },
  });
}

async function sendPushNotifications(
  notification: NonNullable<
    Awaited<
      ReturnType<typeof getNotificationById>
    >
  >,
) {
  const tokens =
    await prisma.notification_device_tokens.findMany(
      {
        where: {
          user_id:
            notification.recipient_id,
          enabled: true,
        },
        select: {
          expo_push_token: true,
        },
      },
    );

  if (tokens.length === 0) {
    return;
  }

  const payloads: PushPayload[] =
    tokens.map((token) => ({
      to: token.expo_push_token,
      sound: "default",
      title: "Allive",
      body: notification.text,
      channelId: "allive",
      data: {
        notificationId:
          notification.id,
        type: notification.type,
        targetType:
          notification.target_type,
        targetId:
          notification.target_id,
      },
    }));

  for (const payloadChunk of chunk(
    payloads,
    PUSH_CHUNK_SIZE,
  )) {
    try {
      const response = await fetch(
        EXPO_PUSH_URL,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            payloadChunk,
          ),
        },
      );

      const body =
        (await response
          .json()
          .catch(() => null)) as {
          data?: Array<{
            status?: string;
            message?: string;
            details?: {
              error?: string;
            };
          }>;
        } | null;

      body?.data?.forEach(
        (ticket, index) => {
          if (
            ticket.status === "error" &&
            ticket.details?.error ===
              "DeviceNotRegistered"
          ) {
            const token =
              payloadChunk[index]?.to;

            if (token) {
              void prisma
                .notification_device_tokens.updateMany(
                  {
                    where: {
                      expo_push_token:
                        token,
                    },
                    data: {
                      enabled: false,
                    },
                  },
                )
                .catch(() => undefined);
            }
          }
        },
      );
    } catch (error) {
      console.warn(
        "No se pudo enviar push:",
        error,
      );
    }
  }
}

export async function registerDevicePushToken(
  userId: string,
  input: {
    expoPushToken: string;
    platform?: string | null;
    deviceId?: string | null;
  },
) {
  const token =
    input.expoPushToken.trim();

  if (
    !token.startsWith(
      "ExponentPushToken[",
    ) &&
    !token.startsWith(
      "ExpoPushToken[",
    )
  ) {
    throw new Error(
      "Token push invalido",
    );
  }

  return prisma.notification_device_tokens.upsert(
    {
      where: {
        expo_push_token: token,
      },
      update: {
        user_id: userId,
        platform:
          input.platform ?? null,
        device_id:
          input.deviceId ?? null,
        enabled: true,
        last_seen_at: new Date(),
      },
      create: {
        user_id: userId,
        expo_push_token: token,
        platform:
          input.platform ?? null,
        device_id:
          input.deviceId ?? null,
      },
    },
  );
}

export async function listNotifications(
  userId: string,
) {
  const notifications =
    await prisma.notifications.findMany({
      where: {
        recipient_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 80,
      include: {
        users_notifications_actor_idTousers:
          {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
      },
    });

  return notifications
    .map(mapNotification)
    .filter(Boolean);
}

export async function getUnreadNotificationCount(
  userId: string,
) {
  return prisma.notifications.count({
    where: {
      recipient_id: userId,
      read_at: null,
    },
  });
}

export async function markNotificationAsRead(
  userId: string,
  notificationId: string,
) {
  const result =
    await prisma.notifications.updateMany(
      {
        where: {
          id: notificationId,
          recipient_id: userId,
          read_at: null,
        },
        data: {
          read_at: new Date(),
        },
      },
    );

  return result.count > 0;
}

export async function markAllNotificationsAsRead(
  userId: string,
) {
  return prisma.notifications.updateMany({
    where: {
      recipient_id: userId,
      read_at: null,
    },
    data: {
      read_at: new Date(),
    },
  });
}

export async function createNotification(
  input: NotificationInput,
) {
  if (
    input.recipientId === input.actorId
  ) {
    return null;
  }

  try {
    const notification =
      await prisma.notifications.create({
        data: {
          recipient_id:
            input.recipientId,
          actor_id: input.actorId,
          type: input.type,
          text: input.text,
          action_label:
            input.actionLabel ?? null,
          target_type:
            input.targetType,
          target_id: input.targetId,
          dedupe_key:
            input.dedupeKey,
        },
      });

    const hydrated =
      await getNotificationById(
        notification.id,
      );

    if (hydrated) {
      void sendPushNotifications(
        hydrated,
      );
    }

    return mapNotification(
      hydrated,
    );
  } catch (error) {
    if (
      isUniqueConstraintError(error)
    ) {
      return null;
    }

    throw error;
  }
}

export async function notifyNewFollower(
  followerId: string,
  followingId: string,
) {
  const follower =
    await prisma.user.findUnique({
      where: {
        id: followerId,
      },
      select: {
        username: true,
        displayName: true,
      },
    });

  if (!follower) {
    return null;
  }

  const actorName =
    follower.displayName ||
    follower.username;

  return createNotification({
    recipientId: followingId,
    actorId: followerId,
    type: "NEW_FOLLOWER",
    text: `${actorName} ha empezado a seguirte`,
    targetType: "USER",
    targetId: followerId,
    dedupeKey: `NEW_FOLLOWER:${followingId}:${followerId}`,
  });
}

export async function notifyLiveStarted(
  liveId: string,
  creatorId: string,
) {
  const live =
    await prisma.liveSession.findUnique({
      where: {
        id: liveId,
      },
      include: {
        creator: {
          select: {
            username: true,
            displayName: true,
          },
        },
      },
    });

  if (!live) {
    return;
  }

  const followers =
    await prisma.user_follows.findMany({
      where: {
        following_id: creatorId,
        follower_id: {
          not: creatorId,
        },
      },
      select: {
        follower_id: true,
      },
    });

  if (followers.length === 0) {
    return;
  }

  const actorName =
    live.creator.displayName ||
    live.creator.username;

  await Promise.all(
    followers.map((follower) =>
      createNotification({
        recipientId:
          follower.follower_id,
        actorId: creatorId,
        type: "LIVE_STARTED",
        text: `${actorName} ha iniciado un directo`,
        actionLabel: "Ver",
        targetType: "LIVE",
        targetId: liveId,
        dedupeKey: `LIVE_STARTED:${follower.follower_id}:${liveId}`,
      }),
    ),
  );
}
