// server/routes/lives.ts

import type { Express } from "express";

import {
  requireAuth,
  type AuthenticatedRequest,
} from "../auth";
import { prisma } from "../db";
import {
  ActiveLiveExistsError,
  createLiveSession,
  endLiveSession,
  reconcileActiveLives,
  updateLiveSession,
} from "../services/liveSessions";

export function registerLiveRoutes(app: Express) {
  /*
   * Crear LIVE.
   */
  app.post(
    "/api/lives",
    requireAuth,
    async (req: AuthenticatedRequest, res) => {
      try {
        const { roomName } = req.body;

        if (!roomName || typeof roomName !== "string") {
          return res.status(400).json({
            error: "roomName es obligatorio",
          });
        }

        const live = await createLiveSession(
          req.authUser!.id,
          req.body
        );

        return res.status(201).json(live);
} catch (error) {
  if (
    error instanceof ActiveLiveExistsError
  ) {
    return res.status(409).json({
      error: "Ya tienes una emisión activa",
      activeLiveId: error.liveId,
      roomName: error.roomName,
    });
  }

  console.error(
    "Error creando LIVE:",
    error,
  );

  return res.status(500).json({
    error: "No se pudo crear la emisión",
  });
}
    }
  );

  /*
   * Editar datos de un LIVE.
   */
  app.patch(
    "/api/lives/:id",
    requireAuth,
    async (req: AuthenticatedRequest, res) => {
      try {
        const idParam = req.params.id;
const id = Array.isArray(idParam) ? idParam[0] : idParam;

if (!id) {
  return res.status(400).json({
    error: "ID de emisión inválido",
  });
}

        const existing = await prisma.liveSession.findUnique({
          where: {
            id,
          },
        });

        if (!existing) {
          return res.status(404).json({
            error: "Emisión no encontrada",
          });
        }

        if (existing.creatorId !== req.authUser!.id) {
          return res.status(403).json({
            error: "No puedes modificar esta emisión",
          });
        }

        if (existing.status !== "LIVE") {
          return res.status(409).json({
            error: "La emisión ya ha terminado",
          });
        }

        const live = await updateLiveSession(id, req.body);

        return res.json(live);
      } catch (error) {
        console.error("Error editando LIVE:", error);

        return res.status(500).json({
          error: "No se pudo editar la emisión",
        });
      }
    }
  );

  /*
   * Obtener LIVE activos.
   * Sigue siendo público para usuarios registrados e invitados.
   */
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


  // server/routes/lives.ts

// Obtener LIVE activos
app.get("/api/lives/active", async (_req, res) => {
  // ...lo que ya tienes
});


// AQUÍ PEGAS TODO EL BLOQUE NUEVO
app.get(
  "/api/lives/replays",
  async (_req, res) => {
    // ...
  },
);


// Finalizar LIVE
app.patch(
  "/api/lives/:id/end",
  // ...
);

  /*
   * Finalizar LIVE.
   */
  app.patch(
    "/api/lives/:id/end",
    requireAuth,
    async (req: AuthenticatedRequest, res) => {
      try {
        const idParam = req.params.id;
const id = Array.isArray(idParam) ? idParam[0] : idParam;

if (!id) {
  return res.status(400).json({
    error: "ID de emisión inválido",
  });
}

        const existing = await prisma.liveSession.findUnique({
          where: {
            id,
          },
        });

        if (!existing) {
          return res.status(404).json({
            error: "Emisión no encontrada",
          });
        }

        if (existing.creatorId !== req.authUser!.id) {
          return res.status(403).json({
            error: "No puedes finalizar esta emisión",
          });
        }

        if (existing.status !== "LIVE") {
          return res.status(409).json({
            error: "La emisión ya ha terminado",
          });
        }

        const live = await endLiveSession(id);

        if (!live) {
          return res.status(404).json({
            error: "Emisión no encontrada",
          });
        }

        return res.json(live);
      } catch (error) {
        console.error("Error finalizando LIVE:", error);

        return res.status(500).json({
          error: "No se pudo finalizar la emisión",
        });
      }
    }
  );
}