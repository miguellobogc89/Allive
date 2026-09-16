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
  startRecording,
  stopRecording,
} from "../services/recordingEngineService";

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
  * Obtener LIVE + REPLAYS
  * de usuarios que sigue
  * el usuario autenticado.
  */
  app.get(
    "/api/lives/following",
    requireAuth,
    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      try {
        const followerId =
          req.authUser!.id;

        const follows =
          await prisma.user_follows.findMany({
            where: {
              follower_id:
                followerId,
            },

            select: {
              following_id:
                true,
            },
          });

        const followingIds =
          follows.map(
            (follow) =>
              follow.following_id,
          );

        if (
          followingIds.length === 0
        ) {
          return res.json({
            lives: [],
            replays: [],
          });
        }

        const [
          activeLives,
          replays,
        ] = await Promise.all([
          reconcileActiveLives(),

          prisma.liveSession.findMany({
            where: {
              creatorId: {
                in: followingIds,
              },

              status: "ENDED",

              endedAt: {
                not: null,
              },

              recording_url: {
                not: null,
              },

              replay_saved_at: {
                not: null,
              },
            },

            orderBy: {
              endedAt: "desc",
            },

            take: 50,

            select: {
              id: true,
              roomName: true,

              title: true,
              description: true,
              eventName: true,

              placeName: true,
              latitude: true,
              longitude: true,

              startedAt: true,
              endedAt: true,

              thumbnailUrl: true,

              recording_url: true,

              replay_saved_at: true,
              replay_visible_until:
                true,

              creator: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatarUrl: true,
                },
              },

              _count: {
                select: {
                  live_likes: true,
                  live_comments:
                    true,
                },
              },
            },
          }),
        ]);

        const followingSet =
          new Set(followingIds);

        const filteredLives =
          activeLives.filter(
            (live) =>
              followingSet.has(
                live.creatorId,
              ),
          );

        return res.json({
          lives:
            filteredLives,

          replays:
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

                recordingUrl:
                  replay.recording_url,

                replaySavedAt:
                  replay.replay_saved_at,

                replayVisibleUntil:
                  replay.replay_visible_until,

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
        });
      } catch (error) {
        console.error(
          "Error obteniendo feed siguiendo:",
          error,
        );

        return res
          .status(500)
          .json({
            error:
              "No se pudo cargar el contenido de las personas que sigues",
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
                recording_url: {
                  not: null,
                },
                replay_saved_at: {
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
                recording_url:
                  true,
                replay_saved_at:
                  true,
                replay_visible_until:
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

recordingUrl:
  replay.recording_url,

replaySavedAt:
  replay.replay_saved_at,

replayVisibleUntil:
  replay.replay_visible_until,

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
  await startRecording(
    live.roomName,
    live.id,
  );

await prisma.liveSession.update({
  where: {
    id: live.id,
  },

  data: {
    recording_engine:
      recording.engine,

    /*
     * Campos finales del replay.
     *
     * LEGACY los genera directamente.
     * TRACK los generará posteriormente
     * durante la finalización/mux.
     */
    recording_key:
      recording.recordingKey,

    recording_url:
      recording.recordingUrl,

    /*
     * Egress antiguo.
     * Solo se utiliza con LEGACY.
     */
    recording_egress_id:
      recording.legacyEgressId,

    /*
     * Egress independientes del nuevo
     * motor TRACK.
     */
    recording_video_egress_id:
      recording.videoEgressId,

    recording_audio_egress_id:
      recording.audioEgressId,

    recording_video_key:
      recording.videoKey,

    recording_audio_key:
      recording.audioKey,
  },
});

return res
  .status(201)
  .json({
    engine:
      recording.engine,

    recordingKey:
      recording.recordingKey,

    recordingUrl:
      recording.recordingUrl,

    videoEgressId:
      recording.videoEgressId,

    audioEgressId:
      recording.audioEgressId,
  });
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
                "No puedes detener esta grabación",
            });
        }

const recordingResult =
  await stopRecording({
    engine:
      live.recording_engine,

    legacyEgressId:
      live.recording_egress_id,

    videoEgressId:
      live.recording_video_egress_id,

    audioEgressId:
      live.recording_audio_egress_id,

    videoKey:
      live.recording_video_key,

    audioKey:
      live.recording_audio_key,

    roomName:
      live.roomName,

    liveSessionId:
      live.id,
  });

if (
  live.recording_engine === "TRACK"
) {
  if (
    !recordingResult.recordingKey ||
    !recordingResult.recordingUrl
  ) {
    throw new Error(
      "TRACK terminó sin generar el replay final.",
    );
  }

  await prisma.liveSession.update({
    where: {
      id: live.id,
    },

    data: {
      recording_key:
        recordingResult.recordingKey,

      recording_url:
        recordingResult.recordingUrl,
    },
  });

  console.log(
    "🎬 Replay TRACK persistido:",
    {
      liveSessionId:
        live.id,

      recordingKey:
        recordingResult.recordingKey,

      recordingUrl:
        recordingResult.recordingUrl,
    },
  );
}


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

const hasLegacyRecording =
  live.recording_engine ===
    "LEGACY" &&
  Boolean(
    live.recording_key &&
      live.recording_url &&
      live.recording_egress_id,
  );

const hasTrackRecording =
  live.recording_engine ===
    "TRACK" &&
  Boolean(
    live.recording_key &&
      live.recording_url,
  );

if (
  !hasLegacyRecording &&
  !hasTrackRecording
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