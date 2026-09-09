// server/routes/liveLikes.ts

import type { Express } from "express";

import {
  optionalAuth,
  type AuthenticatedRequest,
} from "../auth";
import { prisma } from "../db";
import {
  getLiveLikeState,
  parseGuestActor,
  toggleLiveLike,
  type LiveLikeActor,
} from "../services/liveLikes";

function getRouteId(
  value: string | string[] | undefined,
) {
  return Array.isArray(value)
    ? value[0]
    : value;
}

function resolveActor(
  req: AuthenticatedRequest,
): LiveLikeActor | null {
  if (req.authUser) {
    return {
      type: "user",
      id: req.authUser.id,
    };
  }

  return parseGuestActor(
    req.query.guestId ??
      req.body?.guestId,
  );
}

async function liveExists(
  liveSessionId: string,
) {
  return Boolean(
    await prisma.liveSession.findUnique({
      where: {
        id: liveSessionId,
      },
      select: {
        id: true,
      },
    }),
  );
}

export function registerLiveLikeRoutes(
  app: Express,
) {
  app.get(
    "/api/lives/:id/likes",
    optionalAuth,
    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      try {
        const id = getRouteId(
          req.params.id,
        );

        if (!id) {
          return res.status(400).json({
            error:
              "ID de emisión inválido",
          });
        }

        if (!(await liveExists(id))) {
          return res.status(404).json({
            error:
              "Emisión no encontrada",
          });
        }

        const actor =
          resolveActor(req);

        return res.json(
          await getLiveLikeState(
            id,
            actor,
          ),
        );
      } catch (error) {
        console.error(
          "Error obteniendo likes:",
          error,
        );

        return res.status(500).json({
          error:
            "No se pudieron obtener los likes",
        });
      }
    },
  );

  app.post(
    "/api/lives/:id/likes/toggle",
    optionalAuth,
    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      try {
        const id = getRouteId(
          req.params.id,
        );

        if (!id) {
          return res.status(400).json({
            error:
              "ID de emisión inválido",
          });
        }

        const actor =
          resolveActor(req);

        if (!actor) {
          return res.status(400).json({
            error:
              "Identidad de usuario o invitado inválida",
          });
        }

        if (!(await liveExists(id))) {
          return res.status(404).json({
            error:
              "Emisión no encontrada",
          });
        }

        return res.json(
          await toggleLiveLike(
            id,
            actor,
          ),
        );
      } catch (error) {
        console.error(
          "Error cambiando like:",
          error,
        );

        return res.status(500).json({
          error:
            "No se pudo cambiar el like",
        });
      }
    },
  );
}
