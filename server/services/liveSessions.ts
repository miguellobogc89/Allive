// server/services/liveSessions.ts

import { prisma } from "../db";
import {
  getParticipantRole,
  roomService,
} from "../livekit";

export class ActiveLiveExistsError extends Error {
  liveId: string;
  roomName: string;

  constructor(
    liveId: string,
    roomName: string,
  ) {
    super(
      "El usuario ya tiene una emisión activa",
    );

    this.name = "ActiveLiveExistsError";
    this.liveId = liveId;
    this.roomName = roomName;
  }
}

export function cleanOptionalString(
  value: unknown,
  maxLength: number,
) {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value
    .trim()
    .slice(0, maxLength);

  return cleaned || null;
}

async function hasBroadcaster(
  roomName: string,
) {
  try {
    const rooms =
      await roomService.listRooms();

    const roomExists = rooms.some(
      (room) =>
        room.name === roomName,
    );

    if (!roomExists) {
      return false;
    }

    const participants =
      await roomService.listParticipants(
        roomName,
      );

    return participants.some(
      (participant) =>
        getParticipantRole(
          participant.metadata,
          participant.identity,
        ) === "broadcaster",
    );
  } catch (error) {
    console.warn(
      `No se pudo reconciliar ${roomName}:`,
      error,
    );

    return null;
  }
}

export async function reconcileActiveLives() {
  const dbLives =
    await prisma.liveSession.findMany({
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

  const activeLives = [];

  for (const live of dbLives) {
    const broadcasterActive =
      await hasBroadcaster(
        live.roomName,
      );

    if (broadcasterActive === true) {
      activeLives.push(live);
      continue;
    }

    if (broadcasterActive === null) {
      continue;
    }

    console.log(
      `LIVE sin broadcaster activo: ${live.roomName}`,
    );
  }

  return activeLives;
}

export async function cleanupDevLives() {
  const result =
    await prisma.liveSession.updateMany({
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
    const rooms =
      await roomService.listRooms();

    for (const room of rooms) {
      try {
        await roomService.deleteRoom(
          room.name,
        );

        deletedRooms += 1;
      } catch {
        console.warn(
          "No se pudo eliminar sala:",
          room.name,
        );
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

async function resolveExistingLive(
  creatorId: string,
) {
  const existingLives =
    await prisma.liveSession.findMany({
      where: {
        creatorId,
        status: "LIVE",
      },

      orderBy: {
        startedAt: "desc",
      },
    });

  if (existingLives.length === 0) {
    return null;
  }

  for (const live of existingLives) {
    const broadcasterActive =
      await hasBroadcaster(
        live.roomName,
      );

    if (broadcasterActive === true) {
      return live;
    }

    if (broadcasterActive === null) {
      throw new ActiveLiveExistsError(
        live.id,
        live.roomName,
      );
    }

    await prisma.liveSession.update({
      where: {
        id: live.id,
      },

      data: {
        status: "ENDED",
        endedAt: new Date(),
      },
    });

    console.log(
      `LIVE huérfano finalizado: ${live.roomName}`,
    );
  }

  return null;
}

export async function createLiveSession(
  creatorId: string,
  body: Record<string, unknown>,
) {
  const existingLive =
    await resolveExistingLive(
      creatorId,
    );

  if (existingLive) {
    throw new ActiveLiveExistsError(
      existingLive.id,
      existingLive.roomName,
    );
  }

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

      title: cleanOptionalString(
        title,
        120,
      ),

      eventName: cleanOptionalString(
        eventName,
        120,
      ),

      description: cleanOptionalString(
        description,
        500,
      ),

      latitude:
        typeof latitude === "number"
          ? latitude
          : null,

      longitude:
        typeof longitude === "number"
          ? longitude
          : null,

      placeName: cleanOptionalString(
        placeName,
        160,
      ),
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
        title: cleanOptionalString(
          title,
          120,
        ),
      }),

      ...(eventName !== undefined && {
        eventName: cleanOptionalString(
          eventName,
          120,
        ),
      }),

      ...(latitude !== undefined && {
        latitude:
          typeof latitude === "number"
            ? latitude
            : null,
      }),

      ...(longitude !== undefined && {
        longitude:
          typeof longitude === "number"
            ? longitude
            : null,
      }),

      ...(placeName !== undefined && {
        placeName:
          cleanOptionalString(
            placeName,
            160,
          ),
      }),
    },

    include: {
      creator: true,
    },
  });
}

export async function endLiveSession(
  id: string,
) {
  const existingLive =
    await prisma.liveSession.findUnique({
      where: {
        id,
      },
    });

  if (!existingLive) {
    return null;
  }

  const live =
    await prisma.liveSession.update({
      where: {
        id,
      },

      data: {
        status: "ENDED",
        endedAt: new Date(),
      },
    });

  try {
    await roomService.deleteRoom(
      existingLive.roomName,
    );
  } catch {
    console.warn(
      "Sala LiveKit ya cerrada:",
      existingLive.roomName,
    );
  }

  return live;
}