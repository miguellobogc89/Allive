// server/routes/liveRealtime.ts

import type {
  Express,
} from "express";

import {
  prisma,
} from "../db";

import {
  addLiveRealtimeClient,
  publishViewerCountForLive,
} from "../services/liveRealtime";

const HEARTBEAT_MS =
  25_000;

const VIEWER_SYNC_MS =
  2_000;

let viewerSyncRunning =
  false;

async function syncLiveViewers() {
  if (viewerSyncRunning) {
    return;
  }

  viewerSyncRunning =
    true;

  try {
    const lives =
      await prisma.liveSession.findMany(
        {
          where: {
            status: "LIVE",
          },

          select: {
            id: true,
            roomName: true,
          },
        },
      );

    await Promise.all(
      lives
        .filter(
          (live) =>
            !live.roomName.startsWith(
              "allive_dev_",
            ),
        )
        .map(
          (live) =>
            publishViewerCountForLive(
              live.id,
            ),
        ),
    );
  } catch (error) {
    console.error(
      "Error sincronizando viewers:",
      error,
    );
  } finally {
    viewerSyncRunning =
      false;
  }
}

export function registerLiveRealtimeRoutes(
  app: Express,
) {
  app.get(
    "/api/live/realtime",

    (req, res) => {
      res.status(200);

      res.setHeader(
        "Content-Type",
        "text/event-stream",
      );

      res.setHeader(
        "Cache-Control",
        "no-cache, no-transform",
      );

      res.setHeader(
        "Connection",
        "keep-alive",
      );

      res.flushHeaders();

      res.write(
        `data: ${JSON.stringify({
          type: "connected",
        })}\n\n`,
      );

      const removeClient =
        addLiveRealtimeClient(
          res,
        );

      void syncLiveViewers();

      const heartbeat =
        setInterval(
          () => {
            try {
              res.write(
                ": heartbeat\n\n",
              );
            } catch {
              clearInterval(
                heartbeat,
              );

              removeClient();
            }
          },
          HEARTBEAT_MS,
        );

      const viewerSync =
        setInterval(
          () => {
            void syncLiveViewers();
          },
          VIEWER_SYNC_MS,
        );

      req.on(
        "close",
        () => {
          clearInterval(
            heartbeat,
          );

          clearInterval(
            viewerSync,
          );

          removeClient();
        },
      );
    },
  );

  app.post(
    "/api/live/realtime/:id/viewers/refresh",

    async (
      req,
      res,
    ) => {
      const id =
        Array.isArray(
          req.params.id,
        )
          ? req.params.id[0]
          : req.params.id;

      if (!id) {
        return res
          .status(400)
          .json({
            error:
              "ID inválido",
          });
      }

      try {
        await publishViewerCountForLive(
          id,
        );

        return res.json({
          ok: true,
        });
      } catch (error) {
        console.error(
          "Error refrescando viewers:",
          error,
        );

        return res
          .status(500)
          .json({
            error:
              "No se pudieron refrescar los viewers",
          });
      }
    },
  );
}