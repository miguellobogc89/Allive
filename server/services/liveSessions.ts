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
    console.error(
      "No se pudieron consultar las salas de LiveKit:",
      error,
    );

    return dbLives;
  }

  const existingRoomNames = new Set(
    liveKitRooms.map((room) => room.name),
  );

  const activeLives = [];

  for (const live of dbLives) {
    /*
     * Una lectura de Now nunca debe cambiar el estado
     * persistente de una emisión.
     *
     * LiveKit puede tardar brevemente en mostrar una sala
     * o un participante durante conexiones/reconexiones.
     */
    if (!existingRoomNames.has(live.roomName)) {
      console.log(
        `LIVE temporalmente no visible en LiveKit: ${live.roomName}`,
      );

      continue;
    }

    try {
      const participants = await roomService.listParticipants(
        live.roomName,
      );

      const hasBroadcaster = participants.some(
        (participant) =>
          getParticipantRole(
            participant.metadata,
            participant.identity,
          ) === "broadcaster",
      );

      if (!hasBroadcaster) {
        console.log(
          `LIVE sin broadcaster visible temporalmente: ${live.roomName}`,
        );

        continue;
      }

      activeLives.push(live);
    } catch (error) {
      console.warn(
        `No se pudo comprobar temporalmente el LIVE ${live.roomName}:`,
        error,
      );
    }
  }

  return activeLives;
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
    console.warn(
      "No se pudieron limpiar las salas LiveKit:",
      error,
    );
  }

  return {
    endedLives: result.count,
    deletedRooms,
  };
}

export async function createLiveSession(
  creatorId: string,
  body: Record<string, unknown>,
) {
  const {
    roomName,
    title,
    eventName,
    description,
    latitude,
    longitude,
    placeName,
  } = body;

  return prisma.liveSession.create({
    data: {
      roomName: roomName as string,

      creatorId,

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
  body: Record<string, unknown>,
) {
  const {
    title,
    eventName,
    latitude,
    longitude,
    placeName,
  } = body;

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
        latitude:
          typeof latitude === "number" ? latitude : null,
      }),

      ...(longitude !== undefined && {
        longitude:
          typeof longitude === "number" ? longitude : null,
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
    console.warn(
      "Sala LiveKit ya cerrada:",
      existingLive.roomName,
    );
  }

  return live;
}