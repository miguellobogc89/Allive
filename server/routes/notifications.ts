import type { Express } from "express";

import {
  requireAuth,
  type AuthenticatedRequest,
} from "../auth";
import {
  getUnreadNotificationCount,
  listNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  registerDevicePushToken,
} from "../services/notifications";

function getParam(
  value: string | string[] | undefined,
) {
  return Array.isArray(value)
    ? value[0]
    : value;
}

export function registerNotificationRoutes(
  app: Express,
) {
  app.post(
    "/api/notifications/device-tokens",
    requireAuth,
    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      try {
        const expoPushToken =
          req.body?.expoPushToken;

        if (
          typeof expoPushToken !==
            "string" ||
          !expoPushToken.trim()
        ) {
          return res
            .status(400)
            .json({
              error:
                "expoPushToken es obligatorio",
            });
        }

        await registerDevicePushToken(
          req.authUser!.id,
          {
            expoPushToken,
            platform:
              typeof req.body
                ?.platform ===
              "string"
                ? req.body.platform
                : null,
            deviceId:
              typeof req.body
                ?.deviceId ===
              "string"
                ? req.body.deviceId
                : null,
          },
        );

        return res
          .status(204)
          .send();
      } catch (error) {
        console.error(
          "Error registrando token push:",
          error,
        );

        return res
          .status(500)
          .json({
            error:
              "No se pudo registrar el dispositivo",
          });
      }
    },
  );

  app.get(
    "/api/notifications",
    requireAuth,
    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      try {
        const notifications =
          await listNotifications(
            req.authUser!.id,
          );

        return res.json(
          notifications,
        );
      } catch (error) {
        console.error(
          "Error obteniendo notificaciones:",
          error,
        );

        return res
          .status(500)
          .json({
            error:
              "No se pudieron obtener las notificaciones",
          });
      }
    },
  );

  app.get(
    "/api/notifications/unread-count",
    requireAuth,
    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      try {
        const count =
          await getUnreadNotificationCount(
            req.authUser!.id,
          );

        return res.json({ count });
      } catch (error) {
        console.error(
          "Error obteniendo badge:",
          error,
        );

        return res
          .status(500)
          .json({
            error:
              "No se pudo obtener el badge de notificaciones",
          });
      }
    },
  );

  app.patch(
    "/api/notifications/read-all",
    requireAuth,
    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      try {
        const result =
          await markAllNotificationsAsRead(
            req.authUser!.id,
          );

        return res.json({
          updated: result.count,
        });
      } catch (error) {
        console.error(
          "Error marcando notificaciones:",
          error,
        );

        return res
          .status(500)
          .json({
            error:
              "No se pudieron marcar las notificaciones",
          });
      }
    },
  );

  app.patch(
    "/api/notifications/:id/read",
    requireAuth,
    async (
      req: AuthenticatedRequest,
      res,
    ) => {
      try {
        const id = getParam(
          req.params.id,
        );

        if (!id) {
          return res
            .status(400)
            .json({
              error:
                "ID de notificacion invalido",
            });
        }

        const updated =
          await markNotificationAsRead(
            req.authUser!.id,
            id,
          );

        return res.json({
          updated,
        });
      } catch (error) {
        console.error(
          "Error marcando notificacion:",
          error,
        );

        return res
          .status(500)
          .json({
            error:
              "No se pudo marcar la notificacion",
          });
      }
    },
  );
}
