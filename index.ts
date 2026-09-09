// index.ts

import {
  registerRootComponent,
} from "expo";

import App from "./App";

import {
  registerLiveKitGlobals,
} from "./src/livekit/registerLiveKit.native";

registerLiveKitGlobals();

registerRootComponent(App);