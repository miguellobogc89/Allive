// server/index.ts

import "dotenv/config";

import cors from "cors";
import express from "express";
import { randomUUID } from "node:crypto";
import {
  AccessToken,
  RoomServiceClient,
  WebhookReceiver,
} from "livekit-server-sdk";

import { prisma } from "./db";

const app = express();
const PORT = 3001;

const LIVEKIT_URL = process.env.LIVEKIT_URL;
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET =
  process.env.LIVEKIT_API_SECRET;

if (!LIVEKIT_URL) {
  throw new Error(
    "LIVEKIT_URL no está definida"
  );
}

if (!LIVEKIT_API_KEY) {
  throw new Error(
    "LIVEKIT_API_KEY no está definida"
  );
}

if (!LIVEKIT_API_SECRET) {
  throw new Error(
    "LIVEKIT_API_SECRET no está definida"
  );
}

const LIVEKIT_HTTP_URL =
  LIVEKIT_URL
    .replace(/^wss:/, "https:")
    .replace(/^ws:/, "http:");

const roomService =
  new RoomServiceClient(
    LIVEKIT_HTTP_URL,
    LIVEKIT_API_KEY,
    LIVEKIT_API_SECRET
  );

const webhookReceiver =
  new WebhookReceiver(
    LIVEKIT_API_KEY,
    LIVEKIT_API_SECRET
  );

type LiveRole =
  | "broadcaster"
  | "viewer";

function getParticipantRole(
  metadata?: string,
  identity?: string
): LiveRole | null {
  if (metadata) {
    try {
      const parsed =
        JSON.parse(metadata);

      if (
        parsed?.role ===
          "broadcaster" ||
        parsed?.role === "viewer"
      ) {
        return parsed.role;
      }
    } catch {
      // Fallback a identity.
    }
  }

  if (
    identity?.startsWith(
      "broadcaster-"
    )
  ) {
    return "broadcaster";
  }

  if (
    identity?.startsWith(
      "viewer-"
    )
  ) {
    return "viewer";
  }

  return null;
}

function cleanOptionalString(
  value: unknown,
  maxLength: number
) {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value
    .trim()
    .slice(0, maxLength);

  return cleaned || null;
}

async function getDevUser() {
  return prisma.user.upsert({
    where: {
      username: "miguel-dev",
    },
    update: {},
    create: {
      username: "miguel-dev",
      displayName: "Miguel",
    },
  });
}

async function createLiveKitToken(
  roomName: string,
  role: LiveRole
) {
  const participantIdentity =
    `${role}-${randomUUID()}`;

  const token =
    new AccessToken(
      LIVEKIT_API_KEY,
      LIVEKIT_API_SECRET,
      {
        identity:
          participantIdentity,
        ttl: "2h",

        attributes: {
          role,
        },

        metadata: JSON.stringify({
          role,
        }),
      }
    );

  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish:
      role === "broadcaster",
    canSubscribe: true,
    canPublishData: false,
  });

  return token.toJwt();
}

async function reconcileActiveLives() {
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

  console.log("");
  console.log(
    "===== ALLIVE RECONCILIATION ====="
  );

  console.log(
    "Neon cree que están LIVE:",
    dbLives.map(
      (live) => live.roomName
    )
  );

  let liveKitRooms;

  try {
    liveKitRooms =
      await roomService.listRooms();
  } catch (error) {
    console.error(
      "No se pudieron consultar las salas de LiveKit:",
      error
    );

    return dbLives;
  }

  console.log(
    "LiveKit tiene estas salas:",
    liveKitRooms.map(
      (room) => room.name
    )
  );

  const existingRoomNames =
    new Set(
      liveKitRooms.map(
        (room) => room.name
      )
    );

  const staleIds =
    new Set<string>();

  for (const live of dbLives) {
    if (
      !existingRoomNames.has(
        live.roomName
      )
    ) {
      console.log(
        `❌ FANTASMA: ${live.roomName} - la sala no existe`
      );

      staleIds.add(live.id);
      continue;
    }

    try {
      const participants =
        await roomService.listParticipants(
          live.roomName
        );

      console.log(
        `Participantes ${live.roomName}:`,
        participants.map(
          (participant) => ({
            identity:
              participant.identity,

            metadata:
              participant.metadata,

            role:
              getParticipantRole(
                participant.metadata,
                participant.identity
              ),
          })
        )
      );

      const hasBroadcaster =
        participants.some(
          (participant) =>
            getParticipantRole(
              participant.metadata,
              participant.identity
            ) === "broadcaster"
        );

      if (!hasBroadcaster) {
        console.log(
          `❌ FANTASMA: ${live.roomName} - no tiene broadcaster`
        );

        staleIds.add(live.id);
      } else {
        console.log(
          `✅ LIVE REAL: ${live.roomName}`
        );
      }
    } catch (error) {
      console.log(
        `❌ FANTASMA: ${live.roomName} - la sala desapareció`
      );

      staleIds.add(live.id);
    }
  }

  if (staleIds.size > 0) {
    const ids =
      Array.from(staleIds);

    const result =
      await prisma.liveSession.updateMany({
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

    console.log(
      `🧹 Allive cerró ${result.count} LIVE fantasma`
    );
  }

  console.log(
    "==============================="
  );
  console.log("");

  return dbLives.filter(
    (live) =>
      !staleIds.has(live.id)
  );
}

/*
 * Webhook.
 *
 * Cuando tengamos el backend público,
 * LiveKit podrá notificarnos directamente.
 */
app.post(
  "/api/livekit/webhook",

  express.raw({
    type:
      "application/webhook+json",
  }),

  async (req, res) => {
    try {
      const rawBody =
        req.body.toString("utf8");

      const event =
        await webhookReceiver.receive(
          rawBody,
          req.get(
            "Authorization"
          ) ?? undefined
        );

      console.log(
        "LiveKit webhook:",
        event.event,
        event.room?.name,
        event.participant?.identity
      );

      if (
        event.event ===
          "participant_left" &&
        event.room?.name &&
        event.participant
      ) {
        const role =
          getParticipantRole(
            event.participant.metadata,
            event.participant.identity
          );

        if (
          role === "broadcaster"
        ) {
          await prisma.liveSession.updateMany({
            where: {
              roomName:
                event.room.name,

              status: "LIVE",
            },

            data: {
              status: "ENDED",
              endedAt: new Date(),
            },
          });

          console.log(
            "Allive LIVE finalizado automáticamente:",
            event.room.name
          );
        }
      }

      if (
        event.event ===
          "room_finished" &&
        event.room?.name
      ) {
        await prisma.liveSession.updateMany({
          where: {
            roomName:
              event.room.name,

            status: "LIVE",
          },

          data: {
            status: "ENDED",
            endedAt: new Date(),
          },
        });
      }

      return res
        .status(200)
        .send("ok");
    } catch (error) {
      console.error(
        "Error procesando webhook LiveKit:",
        error
      );

      return res
        .status(400)
        .send(
          "Invalid webhook"
        );
    }
  }
);

app.use(cors());
app.use(express.json());

app.get(
  "/api/health",
  (_req, res) => {
    res.json({
      ok: true,
      service: "allive-api",
    });
  }
);

/*
 * TEMPORAL DE DESARROLLO.
 */
app.post(
  "/api/dev/lives/cleanup",
  async (_req, res) => {
    try {
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
              room.name
            );

            deletedRooms += 1;
          } catch {
            console.warn(
              "No se pudo eliminar sala:",
              room.name
            );
          }
        }
      } catch (error) {
        console.warn(
          "No se pudieron limpiar las salas LiveKit:",
          error
        );
      }

      return res.json({
        ok: true,
        endedLives:
          result.count,
        deletedRooms,
      });
    } catch (error) {
      console.error(
        "Error limpiando LIVE:",
        error
      );

      return res
        .status(500)
        .json({
          error:
            "No se pudieron limpiar los LIVE",
        });
    }
  }
);

app.post(
  "/api/livekit/token",
  async (req, res) => {
    try {
      const {
        roomName,
        role,
      } = req.body;

      if (
        !roomName ||
        typeof roomName !==
          "string"
      ) {
        return res
          .status(400)
          .json({
            error:
              "roomName es obligatorio",
          });
      }

      if (
        role !==
          "broadcaster" &&
        role !== "viewer"
      ) {
        return res
          .status(400)
          .json({
            error:
              'role debe ser "broadcaster" o "viewer"',
          });
      }

      const participantToken =
        await createLiveKitToken(
          roomName,
          role
        );

      return res.json({
        serverUrl:
          LIVEKIT_URL,

        participantToken,
        role,
      });
    } catch (error) {
      console.error(
        "Error generando token LiveKit:",
        error
      );

      return res
        .status(500)
        .json({
          error:
            "No se pudo generar el token LiveKit",
        });
    }
  }
);

/*
 * Crear LIVE.
 */
app.post(
  "/api/lives",
  async (req, res) => {
    try {
      const {
        roomName,
        title,
        eventName,
        description,
        latitude,
        longitude,
        placeName,
      } = req.body;

      if (
        !roomName ||
        typeof roomName !==
          "string"
      ) {
        return res
          .status(400)
          .json({
            error:
              "roomName es obligatorio",
          });
      }

      const user =
        await getDevUser();

      const live =
        await prisma.liveSession.create({
          data: {
            roomName,

            creatorId:
              user.id,

            status: "LIVE",

            title:
              cleanOptionalString(
                title,
                120
              ),

            eventName:
              cleanOptionalString(
                eventName,
                120
              ),

            description:
              cleanOptionalString(
                description,
                500
              ),

            latitude:
              typeof latitude ===
              "number"
                ? latitude
                : null,

            longitude:
              typeof longitude ===
              "number"
                ? longitude
                : null,

            placeName:
              cleanOptionalString(
                placeName,
                160
              ),
          },

          include: {
            creator: true,
          },
        });

      return res
        .status(201)
        .json(live);
    } catch (error) {
      console.error(
        "Error creando LIVE:",
        error
      );

      return res
        .status(500)
        .json({
          error:
            "No se pudo crear la emisión",
        });
    }
  }
);

/*
 * Editar datos de un LIVE.
 *
 * Esto nos permite cambiar título,
 * evento o ubicación sin cortar
 * la emisión.
 */
app.patch(
  "/api/lives/:id",
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const existing =
        await prisma.liveSession.findUnique({
          where: {
            id,
          },
        });

      if (!existing) {
        return res
          .status(404)
          .json({
            error:
              "Emisión no encontrada",
          });
      }

      if (
        existing.status !==
        "LIVE"
      ) {
        return res
          .status(409)
          .json({
            error:
              "La emisión ya ha terminado",
          });
      }

      const {
        title,
        eventName,
        latitude,
        longitude,
        placeName,
      } = req.body;

      const live =
        await prisma.liveSession.update({
          where: {
            id,
          },

          data: {
            ...(title !==
              undefined && {
              title:
                cleanOptionalString(
                  title,
                  120
                ),
            }),

            ...(eventName !==
              undefined && {
              eventName:
                cleanOptionalString(
                  eventName,
                  120
                ),
            }),

            ...(latitude !==
              undefined && {
              latitude:
                typeof latitude ===
                "number"
                  ? latitude
                  : null,
            }),

            ...(longitude !==
              undefined && {
              longitude:
                typeof longitude ===
                "number"
                  ? longitude
                  : null,
            }),

            ...(placeName !==
              undefined && {
              placeName:
                cleanOptionalString(
                  placeName,
                  160
                ),
            }),
          },

          include: {
            creator: true,
          },
        });

      return res.json(live);
    } catch (error) {
      console.error(
        "Error editando LIVE:",
        error
      );

      return res
        .status(500)
        .json({
          error:
            "No se pudo editar la emisión",
        });
    }
  }
);

app.get(
  "/api/lives/active",
  async (_req, res) => {
    try {
      const lives =
        await reconcileActiveLives();

      return res.json(lives);
    } catch (error) {
      console.error(
        "Error obteniendo LIVE activos:",
        error
      );

      return res
        .status(500)
        .json({
          error:
            "No se pudieron obtener las emisiones",
        });
    }
  }
);

app.patch(
  "/api/lives/:id/end",
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const existingLive =
        await prisma.liveSession.findUnique({
          where: {
            id,
          },
        });

      if (!existingLive) {
        return res
          .status(404)
          .json({
            error:
              "Emisión no encontrada",
          });
      }

      const live =
        await prisma.liveSession.update({
          where: {
            id,
          },

          data: {
            status: "ENDED",
            endedAt:
              new Date(),
          },
        });

      try {
        await roomService.deleteRoom(
          existingLive.roomName
        );
      } catch {
        console.warn(
          "Sala LiveKit ya cerrada:",
          existingLive.roomName
        );
      }

      return res.json(live);
    } catch (error) {
      console.error(
        "Error finalizando LIVE:",
        error
      );

      return res
        .status(500)
        .json({
          error:
            "No se pudo finalizar la emisión",
        });
    }
  }
);

app.listen(
  PORT,
  () => {
    console.log(
      `Allive API funcionando en http://localhost:${PORT}`
    );
  }
);