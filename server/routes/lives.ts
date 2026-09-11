// server/routes/lives.ts

import type {
  Express,
} from "express";

import {
  requireAuth,
  type AuthenticatedRequest,
} from "../auth";

import {
  prisma,
} from "../db";

import {
  startLiveRecording,
  stopLiveRecording,
} from "../services/liveRecordingService";

import {
  ActiveLiveExistsError,
  createLiveSession,
  endLiveSession,
  reconcileActiveLives,
  updateLiveSession,
} from "../services/liveSessions";

export function registerLiveRoutes(
  app: Express,
) {
  /*
   * Crear LIVE.
   */
  app.post(
    "/api/lives",
    requireAuth,
    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      try {
        const {
          roomName,
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

        const live =
          await createLiveSession(
            req.authUser!.id,
            req.body,
          );

        return res
          .status(201)
          .json(live);
      } catch (error) {
        if (
          error instanceof
          ActiveLiveExistsError
        ) {
          return res
            .status(409)
            .json({
              error:
                "Ya tienes una emisión activa",
              activeLiveId:
                error.liveId,
              roomName:
                error.roomName,
            });
        }

        console.error(
          "Error creando LIVE:",
          error,
        );

        return res
          .status(500)
          .json({
            error:
              "No se pudo crear la emisión",
          });
      }
    },
  );

  /*
   * Editar datos de un LIVE.
   */
  app.patch(
    "/api/lives/:id",
    requireAuth,
    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      try {
        const idParam =
          req.params.id;

        const id =
          Array.isArray(
            idParam,
          )
            ? idParam[0]
            : idParam;

        if (!id) {
          return res
            .status(400)
            .json({
              error:
                "ID de emisión inválido",
            });
        }

        const existing =
          await prisma.liveSession.findUnique(
            {
              where: {
                id,
              },
            },
          );

        if (!existing) {
          return res
            .status(404)
            .json({
              error:
                "Emisión no encontrada",
            });
        }

        if (
          existing.creatorId !==
          req.authUser!.id
        ) {
          return res
            .status(403)
            .json({
              error:
                "No puedes modificar esta emisión",
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

        const live =
          await updateLiveSession(
            id,
            req.body,
          );

        return res.json(live);
      } catch (error) {
        console.error(
          "Error editando LIVE:",
          error,
        );

        return res
          .status(500)
          .json({
            error:
              "No se pudo editar la emisión",
          });
      }
    },
  );

  /*
   * Obtener LIVE activos.
   */
  app.get(
    "/api/lives/active",
    async (_req, res) => {
      try {
        const lives =
          await reconcileActiveLives();

        return res.json(
          lives,
        );
      } catch (error) {
        console.error(
          "Error obteniendo LIVE activos:",
          error,
        );

        return res
          .status(500)
          .json({
            error:
              "No se pudieron obtener las emisiones",
          });
      }
    },
  );

  /*
   * Obtener REPLAYS.
   * Emisiones que ya han terminado.
   */
  app.get(
    "/api/lives/replays",
    async (_req, res) => {
      try {
        const replays =
          await prisma.liveSession.findMany(
            {
              where: {
                status:
                  "ENDED",
                endedAt: {
                  not: null,
                },
              },

              orderBy: {
                endedAt:
                  "desc",
              },

              take: 50,

              select: {
                id: true,
                roomName: true,
                title: true,
                description:
                  true,
                eventName: true,
                placeName: true,
                latitude: true,
                longitude: true,
                startedAt: true,
                endedAt: true,
                thumbnailUrl:
                  true,

                creator: {
                  select: {
                    id: true,
                    username:
                      true,
                    displayName:
                      true,
                    avatarUrl:
                      true,
                  },
                },

                _count: {
                  select: {
                    live_likes:
                      true,
                    live_comments:
                      true,
                  },
                },
              },
            },
          );

        return res.json(
          replays.map(
            (replay) => ({
              id: replay.id,

              roomName:
                replay.roomName,

              title:
                replay.title,

              description:
                replay.description,

              eventName:
                replay.eventName,

              placeName:
                replay.placeName,

              latitude:
                replay.latitude,

              longitude:
                replay.longitude,

              startedAt:
                replay.startedAt,

              endedAt:
                replay.endedAt,

              thumbnailUrl:
                replay.thumbnailUrl,

              likeCount:
                replay._count
                  .live_likes,

              commentCount:
                replay._count
                  .live_comments,

              creator:
                replay.creator,
            }),
          ),
        );
      } catch (error) {
        console.error(
          "Error obteniendo replays:",
          error,
        );

        return res
          .status(500)
          .json({
            error:
              "No se pudieron obtener los replays",
          });
      }
    },
  );

    /*
   * Iniciar grabación de un LIVE.
   */
  app.post(
    "/api/lives/:id/recording/start",
    requireAuth,
    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      try {
        const idParam =
          req.params.id;

        const id =
          Array.isArray(
            idParam,
          )
            ? idParam[0]
            : idParam;

        if (!id) {
          return res
            .status(400)
            .json({
              error:
                "ID de emisión inválido",
            });
        }

        const live =
          await prisma.liveSession.findUnique(
            {
              where: {
                id,
              },
            },
          );

        if (!live) {
          return res
            .status(404)
            .json({
              error:
                "Emisión no encontrada",
            });
        }

        if (
          live.creatorId !==
          req.authUser!.id
        ) {
          return res
            .status(403)
            .json({
              error:
                "No puedes grabar esta emisión",
            });
        }

        if (
          live.status !==
          "LIVE"
        ) {
          return res
            .status(409)
            .json({
              error:
                "La emisión ya ha terminado",
            });
        }

const recording =
          await startLiveRecording(
            live.roomName,
            live.id,
          );

        await prisma.liveSession.update({
          where: {
            id: live.id,
          },
          data: {
            recording_key:
              recording.key,
            recording_url:
              recording.url,
            recording_egress_id:
              recording.egressId,
          },
        });

        return res
          .status(201)
          .json(recording);
      } catch (error) {
        console.error(
          "Error iniciando grabación:",
          error,
        );

        return res
          .status(500)
          .json({
            error:
              "No se pudo iniciar la grabación",
          });
      }
    },
  );

  /*
   * Detener grabación de un LIVE.
   */
  app.post(
    "/api/lives/:id/recording/stop",
    requireAuth,
    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      try {
        const idParam =
          req.params.id;

        const id =
          Array.isArray(
            idParam,
          )
            ? idParam[0]
            : idParam;

        const {
          egressId,
        } = req.body;

        if (!id) {
          return res
            .status(400)
            .json({
              error:
                "ID de emisión inválido",
            });
        }

        if (
          !egressId ||
          typeof egressId !==
            "string"
        ) {
          return res
            .status(400)
            .json({
              error:
                "egressId es obligatorio",
            });
        }

        const live =
          await prisma.liveSession.findUnique(
            {
              where: {
                id,
              },
            },
          );

        if (!live) {
          return res
            .status(404)
            .json({
              error:
                "Emisión no encontrada",
            });
        }

        if (
          live.creatorId !==
          req.authUser!.id
        ) {
          return res
            .status(403)
            .json({
              error:
                "No puedes detener esta grabación",
            });
        }

        await stopLiveRecording(
          egressId,
        );

        return res.json({
          ok: true,
        });
      } catch (error) {
        console.error(
          "Error deteniendo grabación:",
          error,
        );

        return res
          .status(500)
          .json({
            error:
              "No se pudo detener la grabación",
          });
      }
    },
  );

  /*
   * Guardar grabación como REPLAY durante 24 horas.
   */
  app.post(
    "/api/lives/:id/replay/save",
    requireAuth,
    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      try {
        const idParam =
          req.params.id;

        const id =
          Array.isArray(idParam)
            ? idParam[0]
            : idParam;

        if (!id) {
          return res
            .status(400)
            .json({
              error:
                "ID de emisión inválido",
            });
        }

        const live =
          await prisma.liveSession.findUnique({
            where: {
              id,
            },
          });

        if (!live) {
          return res
            .status(404)
            .json({
              error:
                "Emisión no encontrada",
            });
        }

        if (
          live.creatorId !==
          req.authUser!.id
        ) {
          return res
            .status(403)
            .json({
              error:
                "No puedes guardar esta grabación",
            });
        }

        if (
          live.status !==
          "ENDED"
        ) {
          return res
            .status(409)
            .json({
              error:
                "La emisión todavía no ha terminado",
            });
        }

        if (
          !live.recording_key ||
          !live.recording_url ||
          !live.recording_egress_id
        ) {
          return res
            .status(409)
            .json({
              error:
                "Esta emisión no tiene una grabación disponible",
            });
        }

        const savedAt =
          new Date();

        const visibleUntil =
          new Date(
            savedAt.getTime() +
              24 * 60 * 60 * 1000,
          );

        const savedReplay =
          await prisma.liveSession.update({
            where: {
              id,
            },
            data: {
              replay_saved_at:
                savedAt,
              replay_visible_until:
                visibleUntil,
            },
          });

        return res.json({
          ok: true,
          replaySavedAt:
            savedReplay.replay_saved_at,
          replayVisibleUntil:
            savedReplay.replay_visible_until,
        });
      } catch (error) {
        console.error(
          "Error guardando REPLAY:",
          error,
        );

        return res
          .status(500)
          .json({
            error:
              "No se pudo guardar el vídeo",
          });
      }
    },
  );

  /*
   * Finalizar LIVE.
   */
  app.patch(
    "/api/lives/:id/end",
    requireAuth,
    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      try {
        const idParam =
          req.params.id;

        const id =
          Array.isArray(
            idParam,
          )
            ? idParam[0]
            : idParam;

        if (!id) {
          return res
            .status(400)
            .json({
              error:
                "ID de emisión inválido",
            });
        }

        const existing =
          await prisma.liveSession.findUnique(
            {
              where: {
                id,
              },
            },
          );

        if (!existing) {
          return res
            .status(404)
            .json({
              error:
                "Emisión no encontrada",
            });
        }

        if (
          existing.creatorId !==
          req.authUser!.id
        ) {
          return res
            .status(403)
            .json({
              error:
                "No puedes finalizar esta emisión",
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

        const live =
          await endLiveSession(
            id,
          );

        if (!live) {
          return res
            .status(404)
            .json({
              error:
                "Emisión no encontrada",
            });
        }

        return res.json(
          live,
        );
      } catch (error) {
        console.error(
          "Error finalizando LIVE:",
          error,
        );

        return res
          .status(500)
          .json({
            error:
              "No se pudo finalizar la emisión",
          });
      }
    },
  );
}