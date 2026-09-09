// server/services/liveSessions.ts

import { prisma } from "../db";
import { getParticipantRole, roomService } from "../livekit";

export function cleanOptionalString(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.trim().slice(0, maxLength);

  return cleaned || null;
}

export async function getDevUser() {
  return prisma.user.upsert({
    where: {
      username: "miguel-dev",
    },
    update: {},
    create: {
      username: "miguel-dev",
      email: "miguel-dev@allive.local",
      password_hash: "DEV_USER_NO_PASSWORD",
      displayName: "Miguel",
    },
  });
}

export async function reconcileActiveLives() {
  const dbLives = await prisma.liveSession.findMany({
    where: {
      status: "LIVE",
    },

    orderBy: {
      startedAt: "desc",
    },

    include: {
      creator: true,
    },
  });

  if (dbLives.length === 0) {
    return [];
  }



  let liveKitRooms;

  try {
    liveKitRooms = await roomService.listRooms();
  } catch (error) {
    console.error("No se pudieron consultar las salas de LiveKit:", error);

    return dbLives;
  }

  console.log(
    "LiveKit tiene estas salas:",
    liveKitRooms.map((room) => room.name)
  );

  const existingRoomNames = new Set(liveKitRooms.map((room) => room.name));

  const staleIds = new Set<string>();

  for (const live of dbLives) {
    if (!existingRoomNames.has(live.roomName)) {
      console.log(`FANTASMA: ${live.roomName} - la sala no existe`);

      staleIds.add(live.id);
      continue;
    }

    try {
      const participants = await roomService.listParticipants(live.roomName);

      console.log(
        `Participantes ${live.roomName}:`,
        participants.map((participant) => ({
          identity: participant.identity,

          metadata: participant.metadata,

          role: getParticipantRole(participant.metadata, participant.identity),
        }))
      );

      const hasBroadcaster = participants.some(
        (participant) =>
          getParticipantRole(participant.metadata, participant.identity) ===
          "broadcaster"
      );

      if (!hasBroadcaster) {
        console.log(`FANTASMA: ${live.roomName} - no tiene broadcaster`);

        staleIds.add(live.id);
      } else {
        console.log(`LIVE REAL: ${live.roomName}`);
      }
    } catch (error) {
      console.log(`FANTASMA: ${live.roomName} - la sala desapareci\u00f3`);

      staleIds.add(live.id);
    }
  }

  if (staleIds.size > 0) {
    const ids = Array.from(staleIds);

    const result = await prisma.liveSession.updateMany({
      where: {
        id: {
          in: ids,
        },

        status: "LIVE",
      },

      data: {
        status: "ENDED",
        endedAt: new Date(),
      },
    });

    console.log(`Allive cerr\u00f3 ${result.count} LIVE fantasma`);
  }

  console.log("===============================");
  console.log("");

  return dbLives.filter((live) => !staleIds.has(live.id));
}

export async function cleanupDevLives() {
  const result = await prisma.liveSession.updateMany({
    where: {
      status: "LIVE",
    },

    data: {
      status: "ENDED",
      endedAt: new Date(),
    },
  });

  let deletedRooms = 0;

  try {
    const rooms = await roomService.listRooms();

    for (const room of rooms) {
      try {
        await roomService.deleteRoom(room.name);

        deletedRooms += 1;
      } catch {
        console.warn("No se pudo eliminar sala:", room.name);
      }
    }
  } catch (error) {
    console.warn("No se pudieron limpiar las salas LiveKit:", error);
  }

  return {
    endedLives: result.count,
    deletedRooms,
  };
}

export async function createLiveSession(body: Record<string, unknown>) {
  const {
    roomName,
    title,
    eventName,
    description,
    latitude,
    longitude,
    placeName,
  } = body;

  const user = await getDevUser();

  return prisma.liveSession.create({
    data: {
      roomName: roomName as string,

      creatorId: user.id,

      status: "LIVE",

      title: cleanOptionalString(title, 120),

      eventName: cleanOptionalString(eventName, 120),

      description: cleanOptionalString(description, 500),

      latitude: typeof latitude === "number" ? latitude : null,

      longitude: typeof longitude === "number" ? longitude : null,

      placeName: cleanOptionalString(placeName, 160),
    },

    include: {
      creator: true,
    },
  });
}

export async function updateLiveSession(
  id: string,
  body: Record<string, unknown>
) {
  const { title, eventName, latitude, longitude, placeName } = body;

  return prisma.liveSession.update({
    where: {
      id,
    },

    data: {
      ...(title !== undefined && {
        title: cleanOptionalString(title, 120),
      }),

      ...(eventName !== undefined && {
        eventName: cleanOptionalString(eventName, 120),
      }),

      ...(latitude !== undefined && {
        latitude: typeof latitude === "number" ? latitude : null,
      }),

      ...(longitude !== undefined && {
        longitude: typeof longitude === "number" ? longitude : null,
      }),

      ...(placeName !== undefined && {
        placeName: cleanOptionalString(placeName, 160),
      }),
    },

    include: {
      creator: true,
    },
  });
}

export async function endLiveSession(id: string) {
  const existingLive = await prisma.liveSession.findUnique({
    where: {
      id,
    },
  });

  if (!existingLive) {
    return null;
  }

  const live = await prisma.liveSession.update({
    where: {
      id,
    },

    data: {
      status: "ENDED",
      endedAt: new Date(),
    },
  });

  try {
    await roomService.deleteRoom(existingLive.roomName);
  } catch {
    console.warn("Sala LiveKit ya cerrada:", existingLive.roomName);
  }

  return live;
}
