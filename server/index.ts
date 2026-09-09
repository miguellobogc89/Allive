// server/index.ts

import "dotenv/config";

import cors from "cors";
import express from "express";

import { registerDevRoutes } from "./routes/dev";
import { registerHealthRoutes } from "./routes/health";
import {
  registerLiveKitTokenRoutes,
  registerLiveKitWebhookRoute,
} from "./routes/livekit";
import { registerLiveCommentRoutes } from "./routes/liveComments";
import { registerLiveLikeRoutes } from "./routes/liveLikes";
import { registerLiveRoutes } from "./routes/lives";
import { registerAuthRoutes } from "./routes/auth";

const app = express();
const PORT = 3001;

registerLiveKitWebhookRoute(app);

app.use(cors());
app.use(express.json());

registerAuthRoutes(app);
registerHealthRoutes(app);
registerDevRoutes(app);
registerLiveKitTokenRoutes(app);
registerLiveRoutes(app);
registerLiveLikeRoutes(app);
registerLiveCommentRoutes(app);

app.listen(PORT, () => {
  console.log(`Allive API funcionando en http://localhost:${PORT}`);
});
