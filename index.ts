// index.ts

import {
  registerRootComponent,
} from "expo";

import App from "./App";

import {
  registerLiveKitGlobals,
} from "./src/livekit/registerLiveKit";

void registerLiveKitGlobals();

registerRootComponent(App);