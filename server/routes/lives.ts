// server/routes/lives.ts

import type { Express } from "express";

import { prisma } from "../db";
import {
  createLiveSession,
  endLiveSession,
  reconcileActiveLives,
  updateLiveSession,
} from "../services/liveSessions";

export function registerLiveRoutes(app: Express) {
  /*
   * Crear LIVE.
   */
  app.post("/api/lives", async (req, res) => {
    try {
      const { roomName } = req.body;

      if (!roomName || typeof roomName !== "string") {
        return res.status(400).json({
          error: "roomName es obligatorio",
        });
      }

      const live = await createLiveSession(req.body);

      return res.status(201).json(live);
    } catch (error) {
      console.error("Error creando LIVE:", error);

      return res.status(500).json({
        error: "No se pudo crear la emisi\u00f3n",
      });
    }
  });

  /*
   * Editar datos de un LIVE.
   *
   * Esto nos permite cambiar titulo,
   * evento o ubicacion sin cortar
   * la emision.
   */
  app.patch("/api/lives/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const existing = await prisma.liveSession.findUnique({
        where: {
          id,
        },
      });

      if (!existing) {
        return res.status(404).json({
          error: "Emisi\u00f3n no encontrada",
        });
      }

      if (existing.status !== "LIVE") {
        return res.status(409).json({
          error: "La emisi\u00f3n ya ha terminado",
        });
      }

      const live = await updateLiveSession(id, req.body);

      return res.json(live);
    } catch (error) {
      console.error("Error editando LIVE:", error);

      return res.status(500).json({
        error: "No se pudo editar la emisi\u00f3n",
      });
    }
  });

  app.get("/api/lives/active", async (_req, res) => {
    try {
      const lives = await reconcileActiveLives();

      return res.json(lives);
    } catch (error) {
      console.error("Error obteniendo LIVE activos:", error);

      return res.status(500).json({
        error: "No se pudieron obtener las emisiones",
      });
    }
  });

  app.patch("/api/lives/:id/end", async (req, res) => {
    try {
      const { id } = req.params;

      const live = await endLiveSession(id);

      if (!live) {
        return res.status(404).json({
          error: "Emisi\u00f3n no encontrada",
        });
      }

      return res.json(live);
    } catch (error) {
      console.error("Error finalizando LIVE:", error);

      return res.status(500).json({
        error: "No se pudo finalizar la emisi\u00f3n",
      });
    }
  });
}
