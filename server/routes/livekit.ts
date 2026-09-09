// server/routes/livekit.ts

import express, { type Express } from "express";

import { prisma } from "../db";
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

export function registerLiveKitWebhookRoute(app: Express) {
  /*
   * Webhook.
   *
   * Cuando tengamos el backend publico,
   * LiveKit podra notificarnos directamente.
   */
  app.post(
    "/api/livekit/webhook",

    express.raw({
      type: "application/webhook+json",
    }),

    async (req, res) => {
      try {
        const rawBody = req.body.toString("utf8");

        const event = await webhookReceiver.receive(
          rawBody,
          req.get("Authorization") ?? undefined
        );

        console.log(
          "LiveKit webhook:",
          event.event,
          event.room?.name,
          event.participant?.identity
        );

        if (
          event.event === "participant_left" &&
          event.room?.name &&
          event.participant
        ) {
          const role = getParticipantRole(
            event.participant.metadata,
            event.participant.identity
          );

          if (role === "broadcaster") {
            await prisma.liveSession.updateMany({
              where: {
                roomName: event.room.name,

                status: "LIVE",
              },

              data: {
                status: "ENDED",
                endedAt: new Date(),
              },
            });

            console.log(
              "Allive LIVE finalizado autom\u00e1ticamente:",
              event.room.name
            );
          }
        }

        if (event.event === "room_finished" && event.room?.name) {
          await prisma.liveSession.updateMany({
            where: {
              roomName: event.room.name,

              status: "LIVE",
            },

            data: {
              status: "ENDED",
              endedAt: new Date(),
            },
          });
        }

        return res.status(200).send("ok");
      } catch (error) {
        console.error("Error procesando webhook LiveKit:", error);

        return res.status(400).send("Invalid webhook");
      }
    }
  );
}

export function registerLiveKitTokenRoutes(app: Express) {
  app.post(
    "/api/livekit/token",
    async (req: AuthenticatedRequest, res, next) => {
      if (req.body?.role === "broadcaster") {
        requireAuth(req, res, next);
        return;
      }

      next();
    },
    async (req: AuthenticatedRequest, res) => {
      try {
        const { roomName, role } = req.body;

        if (!roomName || typeof roomName !== "string") {
          return res.status(400).json({
            error: "roomName es obligatorio",
          });
        }

        if (role !== "broadcaster" && role !== "viewer") {
          return res.status(400).json({
            error: 'role debe ser "broadcaster" o "viewer"',
          });
        }

        const identity =
          role === "broadcaster"
            ? `broadcaster-${req.authUser!.id}`
            : undefined;

        const participantToken = await createLiveKitToken(
          roomName,
          role,
          identity,
        );

        return res.json({
          serverUrl: LIVEKIT_URL,
          participantToken,
          role,
        });
      } catch (error) {
        console.error("Error generando token LiveKit:", error);

        return res.status(500).json({
          error: "No se pudo generar el token LiveKit",
        });
      }
    },
  );
}
