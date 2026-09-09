// src/livekit/registerLiveKit.native.ts

import {
  registerGlobals,
} from "@livekit/react-native";

let registered = false;

export function registerLiveKitGlobals() {
  if (registered) {
    return;
  }

  registerGlobals();

  registered = true;
}