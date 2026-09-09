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
import { registerLiveRoutes } from "./routes/lives";

const app = express();
const PORT = 3001;

registerLiveKitWebhookRoute(app);

app.use(cors());
app.use(express.json());

registerHealthRoutes(app);
registerDevRoutes(app);
registerLiveKitTokenRoutes(app);
registerLiveRoutes(app);

app.listen(PORT, () => {
  console.log(`Allive API funcionando en http://localhost:${PORT}`);
});
