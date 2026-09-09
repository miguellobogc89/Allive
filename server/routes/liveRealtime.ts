// server/routes/liveRealtime.ts

import type {
  Express,
} from "express";

import {
  addLiveRealtimeClient,
} from "../services/liveRealtime";

const HEARTBEAT_MS = 25_000;

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
        addLiveRealtimeClient(res);

      const heartbeat =
        setInterval(() => {
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
        }, HEARTBEAT_MS);

      req.on(
        "close",
        () => {
          clearInterval(
            heartbeat,
          );

          removeClient();
        },
      );
    },
  );
}