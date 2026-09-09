// src/livekit/registerLiveKit.ts

import { Platform } from "react-native";

export async function registerLiveKitGlobals() {
  if (Platform.OS === "web") {
    return;
  }

  const { registerGlobals } =
    await import("@livekit/react-native");

  registerGlobals();
}