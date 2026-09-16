import {
  EgressClient,
  RoomServiceClient,
} from "livekit-server-sdk";

import {
  recordingConfig,
} from "./config";

function livekitHttpUrl(
  url: string,
) {
  return url
    .replace(/^wss:\/\//, "https://")
    .replace(/^ws:\/\//, "http://");
}

export const egressClient =
  new EgressClient(
    recordingConfig.livekitUrl,
    recordingConfig.livekitApiKey,
    recordingConfig.livekitApiSecret,
  );

export const roomServiceClient =
  new RoomServiceClient(
    livekitHttpUrl(
      recordingConfig.livekitUrl,
    ),
    recordingConfig.livekitApiKey,
    recordingConfig.livekitApiSecret,
  );
