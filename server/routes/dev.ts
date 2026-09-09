// server/routes/dev.ts

import type { Express } from "express";

import { cleanupDevLives } from "../services/liveSessions";

export function registerDevRoutes(app: Express) {
  /*
   * TEMPORAL DE DESARROLLO.
   */
  app.post("/api/dev/lives/cleanup", async (_req, res) => {
    try {
      const result = await cleanupDevLives();

      return res.json({
        ok: true,
        endedLives: result.endedLives,
        deletedRooms: result.deletedRooms,
      });
    } catch (error) {
      console.error("Error limpiando LIVE:", error);

      return res.status(500).json({
        error: "No se pudieron limpiar los LIVE",
      });
    }
  });
}
