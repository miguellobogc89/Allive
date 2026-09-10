// server/index.ts

import "dotenv/config";

import cors from "cors";
import express from "express";

import {
  registerAuthRoutes,
} from "./routes/auth";

import {
  registerDevRoutes,
} from "./routes/dev";

import {
  registerHealthRoutes,
} from "./routes/health";

import {
  registerLiveCommentRoutes,
} from "./routes/liveComments";

import {
  registerLiveLikeRoutes,
} from "./routes/liveLikes";

import {
  registerLiveRealtimeRoutes,
} from "./routes/liveRealtime";

import {
  registerLiveKitTokenRoutes,
  registerLiveKitWebhookRoute,
} from "./routes/livekit";

import {
  registerLiveRoutes,
} from "./routes/lives";

import {
  registerNotificationRoutes,
} from "./routes/notifications";

import {
  registerSearchRoutes,
} from "./routes/search";

import {
  registerLiveThumbnailRoutes,
} from "./liveThumbnail/liveThumbnailRoutes";

import {
  registerProfileRoutes,
} from "./routes/profile";

import {
  registerUserProfileRoutes,
} from "./routes/userProfiles";

const app = express();
const PORT = 3001;

registerLiveKitWebhookRoute(app);

app.use(cors());

registerLiveThumbnailRoutes(app);

app.use(express.json());

registerAuthRoutes(app);
registerHealthRoutes(app);
registerDevRoutes(app);
registerLiveKitTokenRoutes(app);
registerLiveRoutes(app);
registerLiveLikeRoutes(app);
registerLiveCommentRoutes(app);
registerLiveRealtimeRoutes(app);
registerNotificationRoutes(app);
registerSearchRoutes(app);
registerProfileRoutes(app);
registerUserProfileRoutes(app);

app.listen(
  PORT,
  () => {
    console.log(
      `Allive API funcionando en http://localhost:${PORT}`,
    );
  },
);
