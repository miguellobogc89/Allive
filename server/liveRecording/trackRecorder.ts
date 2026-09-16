import {
  DirectFileOutput,
  S3Upload,
} from "livekit-server-sdk";

import {
  egressClient,
} from "./clients";

import {
  recordingConfig,
} from "./config";

import type {
  PublishedTrack,
  TrackRecording,
} from "./types";

function buildPublicUrl(
  key: string,
) {
  return (
    `${recordingConfig.r2PublicUrl}/${key}`
  );
}

function buildOutput(
  key: string,
) {
  return new DirectFileOutput({
    filepath: key,

    disableManifest: true,

    output: {
      case: "s3",

      value: new S3Upload({
        accessKey:
          recordingConfig
            .r2AccessKeyId,

        secret:
          recordingConfig
            .r2SecretAccessKey,

        endpoint:
          recordingConfig
            .r2Endpoint,

        bucket:
          recordingConfig
            .r2BucketName,

        forcePathStyle:
          true,
      }),
    },
  });
}

export async function startTrackRecording(
  roomName: string,
  liveSessionId: string,
  kind: "video" | "audio",
  track: PublishedTrack,
): Promise<TrackRecording> {
  /*
   * No fijamos extensión.
   *
   * En Track Egress passthrough LiveKit
   * selecciona el contenedor adecuado
   * según el codec recibido.
   */
  const key =
    `live-replays-raw/${liveSessionId}/${kind}`;

  const output =
    buildOutput(key);

  const info =
    await egressClient
      .startTrackEgress(
        roomName,
        output,
        track.sid,
      );

  if (!info.egressId) {
    throw new Error(
      `LiveKit no devolvió egressId para la pista ${kind}.`,
    );
  }

  return {
    egressId:
      info.egressId,

    trackSid:
      track.sid,

    key,

    publicUrl:
      buildPublicUrl(key),
  };
}

export async function stopTrackRecording(
  egressId: string,
) {
  return egressClient
    .stopEgress(
      egressId,
    );
}
