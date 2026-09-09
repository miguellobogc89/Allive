// server/routes/liveComments.ts

import type {
  Express,
} from "express";

import {
  optionalAuth,
  type AuthenticatedRequest,
} from "../auth";

import {
  prisma,
} from "../db";

import {
  createLiveComment,
  listLiveComments,
  parseGuestCommentActor,
  type CommentActor,
} from "../services/liveComments";

function getRouteId(
  value:
    | string
    | string[]
    | undefined,
) {
  return Array.isArray(value)
    ? value[0]
    : value;
}

async function resolveActor(
  req: AuthenticatedRequest,
): Promise<CommentActor | null> {
  if (req.authUser) {
    const user =
      await prisma.user.findUnique({
        where: {
          id: req.authUser.id,
        },

        select: {
          id: true,
          username: true,
        },
      });

    if (!user) {
      return null;
    }

    return {
      type: "user",
      id: user.id,
      username: user.username,
    };
  }

  return parseGuestCommentActor(
    req.body?.guestId,
    req.body?.username,
  );
}

export function registerLiveCommentRoutes(
  app: Express,
) {
  app.get(
    "/api/lives/:id/comments",
    async (req, res) => {
      try {
        const id =
          getRouteId(
            req.params.id,
          );

        if (!id) {
          return res
            .status(400)
            .json({
              error:
                "ID de emisión inválido",
            });
        }

        const comments =
          await listLiveComments(
            id,
          );

        return res.json(
          comments,
        );
      } catch (error) {
        console.error(
          "Error obteniendo comentarios:",
          error,
        );

        return res
          .status(500)
          .json({
            error:
              "No se pudieron obtener los comentarios",
          });
      }
    },
  );

  app.post(
    "/api/lives/:id/comments",
    optionalAuth,
    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      try {
        const id =
          getRouteId(
            req.params.id,
          );

        if (!id) {
          return res
            .status(400)
            .json({
              error:
                "ID de emisión inválido",
            });
        }

        const live =
          await prisma.liveSession.findFirst({
            where: {
              id,
              status: "LIVE",
            },

            select: {
              id: true,
            },
          });

        if (!live) {
          return res
            .status(409)
            .json({
              error:
                "El LIVE ya no está activo",
            });
        }

        const actor =
          await resolveActor(req);

        if (!actor) {
          return res
            .status(400)
            .json({
              error:
                "Identidad inválida",
            });
        }

        const body =
          typeof req.body?.body ===
          "string"
            ? req.body.body
            : "";

        try {
          const comment =
            await createLiveComment(
              id,
              actor,
              body,
            );

          return res
            .status(201)
            .json(comment);
        } catch (error) {
          if (
            error instanceof Error &&
            error.message ===
              "INVALID_COMMENT"
          ) {
            return res
              .status(400)
              .json({
                error:
                  "El comentario debe tener entre 1 y 280 caracteres",
              });
          }

          throw error;
        }
      } catch (error) {
        console.error(
          "Error creando comentario:",
          error,
        );

        return res
          .status(500)
          .json({
            error:
              "No se pudo crear el comentario",
          });
      }
    },
  );
}
