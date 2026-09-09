// server/routes/livekit.ts

import express, {
  type Express,
} from "express";

import {
  prisma,
} from "../db";

import {
  createLiveKitToken,
  getParticipantRole,
  LIVEKIT_URL,
  webhookReceiver,
} from "../livekit";

import {
  requireAuth,
  type AuthenticatedRequest,
} from "../auth";

import {
  publishViewerCountForRoom,
} from "../services/liveRealtime";

async function endLiveByRoomName(
  roomName: string,
) {
  await prisma.liveSession.updateMany(
    {
      where: {
        roomName,
        status: "LIVE",
      },

      data: {
        status: "ENDED",
        endedAt: new Date(),
      },
    },
  );
}

export function registerLiveKitWebhookRoute(
  app: Express,
) {
  app.post(
    "/api/livekit/webhook",

    express.raw({
      type:
        "application/webhook+json",
    }),

    async (req, res) => {
      try {
        const rawBody =
          req.body.toString(
            "utf8",
          );

        const event =
          await webhookReceiver.receive(
            rawBody,
            req.get(
              "Authorization",
            ) ?? undefined,
          );

        const roomName =
          event.room?.name;

        console.log(
          "LiveKit webhook:",
          event.event,
          roomName,
          event.participant
            ?.identity,
        );

        if (
          (
            event.event ===
              "participant_joined" ||
            event.event ===
              "participant_left"
          ) &&
          roomName
        ) {
          if (
            event.event ===
              "participant_left" &&
            event.participant
          ) {
            const role =
              getParticipantRole(
                event.participant
                  .metadata,
                event.participant
                  .identity,
              );

            if (
              role ===
              "broadcaster"
            ) {
              await endLiveByRoomName(
                roomName,
              );

              console.log(
                "Allive LIVE finalizado automáticamente:",
                roomName,
              );
            }
          }

          await publishViewerCountForRoom(
            roomName,
          );
        }

        if (
          event.event ===
            "room_finished" &&
          roomName
        ) {
          await endLiveByRoomName(
            roomName,
          );
        }

        return res
          .status(200)
          .send("ok");
      } catch (error) {
        console.error(
          "Error procesando webhook LiveKit:",
          error,
        );

        return res
          .status(400)
          .send(
            "Invalid webhook",
          );
      }
    },
  );
}

export function registerLiveKitTokenRoutes(
  app: Express,
) {
  app.post(
    "/api/livekit/token",

    async (
      req: AuthenticatedRequest,
      res,
      next,
    ) => {
      const hasAuthorization =
        Boolean(
          req.headers
            .authorization,
        );

      const requiresAuth =
        req.body?.role ===
          "broadcaster" ||
        hasAuthorization;

      if (requiresAuth) {
        await requireAuth(
          req,
          res,
          next,
        );

        return;
      }

      next();
    },

    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      try {
        const {
          roomName,
          role,
          actorType,
          actorId,
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

        if (
          role ===
          "broadcaster"
        ) {
          const userId =
            req.authUser!.id;

          const participantToken =
            await createLiveKitToken(
              roomName,
              role,
              `broadcaster-${userId}`,
              {
                actorType:
                  "user",

                actorId:
                  userId,
              },
            );

          return res.json({
            serverUrl:
              LIVEKIT_URL,

            participantToken,

            role,
          });
        }

        if (req.authUser) {
          const user =
            await prisma.user.findUnique(
              {
                where: {
                  id:
                    req
                      .authUser
                      .id,
                },

                select: {
                  id: true,
                  username:
                    true,
                },
              },
            );

          if (!user) {
            return res
              .status(401)
              .json({
                error:
                  "Usuario no encontrado",
              });
          }

          const participantToken =
            await createLiveKitToken(
              roomName,
              "viewer",
              `viewer-user-${user.id}`,
              {
                actorType:
                  "user",

                actorId:
                  user.id,

                username:
                  user.username,
              },
            );

          return res.json({
            serverUrl:
              LIVEKIT_URL,

            participantToken,

            role:
              "viewer",
          });
        }

        if (
          actorType !==
            "guest" ||
          typeof actorId !==
            "string" ||
          !actorId.startsWith(
            "guest_",
          ) ||
          actorId.length > 100
        ) {
          return res
            .status(400)
            .json({
              error:
                "Identidad de invitado no válida",
            });
        }

        const participantToken =
          await createLiveKitToken(
            roomName,
            "viewer",
            `viewer-guest-${actorId}`,
            {
              actorType:
                "guest",

              actorId,
            },
          );

        return res.json({
          serverUrl:
            LIVEKIT_URL,

          participantToken,

          role: "viewer",
        });
      } catch (error) {
        console.error(
          "Error generando token LiveKit:",
          error,
        );

        return res
          .status(500)
          .json({
            error:
              "No se pudo generar el token LiveKit",
          });
      }
    },
  );
}