// server/liveThumbnail/liveThumbnailRoutes.ts

import express, {
  type Express,
} from "express";

import {
  requireAuth,
  type AuthenticatedRequest,
} from "../auth";

import { updateLiveThumbnail } from "./liveThumbnailService";

const MAX_THUMBNAIL_SIZE = 1_000_000;

export function registerLiveThumbnailRoutes(
  app: Express,
) {
  app.put(
    "/api/lives/:id/thumbnail",

    requireAuth,

    express.raw({
      type: "image/webp",
      limit: MAX_THUMBNAIL_SIZE,
    }),

    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      try {
        const idParam = req.params.id;

        const id = Array.isArray(idParam)
          ? idParam[0]
          : idParam;

        if (!id) {
          return res.status(400).json({
            error: "ID de emisión inválido",
          });
        }

        if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
          return res.status(400).json({
            error: "Miniatura inválida",
          });
        }

        const thumbnailUrl =
          await updateLiveThumbnail(
            id,
            req.authUser!.id,
            req.body,
          );

        return res.json({
          thumbnailUrl,
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "LIVE_NOT_FOUND"
        ) {
          return res.status(404).json({
            error: "Emisión no encontrada",
          });
        }

        if (
          error instanceof Error &&
          error.message === "LIVE_FORBIDDEN"
        ) {
          return res.status(403).json({
            error:
              "No puedes modificar esta emisión",
          });
        }

        if (
          error instanceof Error &&
          error.message === "LIVE_ENDED"
        ) {
          return res.status(409).json({
            error: "La emisión ya ha terminado",
          });
        }

        console.error(
          "Error actualizando thumbnail:",
          error,
        );

        return res.status(500).json({
          error:
            "No se pudo actualizar la miniatura",
        });
      }
    },
  );
}