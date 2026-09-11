// server/services/liveRecordingService.ts

import {
  EgressClient,
  EncodedFileOutput,
  EncodedFileType,
  EncodingOptionsPreset,
  S3Upload,
} from "livekit-server-sdk";

function requireEnvironmentVariable(
  name: string,
) {
  const value =
    process.env[name];

  if (!value) {
    throw new Error(
      `Falta la variable de entorno ${name}`,
    );
  }

  return value;
}

const livekitUrl =
  requireEnvironmentVariable(
    "LIVEKIT_URL",
  );

const livekitApiKey =
  requireEnvironmentVariable(
    "LIVEKIT_API_KEY",
  );

const livekitApiSecret =
  requireEnvironmentVariable(
    "LIVEKIT_API_SECRET",
  );

const r2BucketName =
  requireEnvironmentVariable(
    "R2_BUCKET_NAME",
  );

const r2Endpoint =
  requireEnvironmentVariable(
    "R2_ENDPOINT",
  );

const r2AccessKeyId =
  requireEnvironmentVariable(
    "R2_ACCESS_KEY_ID",
  );

const r2SecretAccessKey =
  requireEnvironmentVariable(
    "R2_SECRET_ACCESS_KEY",
  );

const r2PublicUrl =
  requireEnvironmentVariable(
    "R2_PUBLIC_URL",
  ).replace(/\/$/, "");

const egressClient =
  new EgressClient(
    livekitUrl,
    livekitApiKey,
    livekitApiSecret,
  );

export type LiveRecording = {
  egressId: string;
  key: string;
  url: string;
};

export async function startLiveRecording(
  roomName: string,
  liveSessionId: string,
): Promise<LiveRecording> {
  const key =
    `live-replays/${liveSessionId}.mp4`;

  const output =
    new EncodedFileOutput({
      fileType:
        EncodedFileType.MP4,

      filepath: key,

      output: {
        case: "s3",

        value: new S3Upload({
          accessKey:
            r2AccessKeyId,

          secret:
            r2SecretAccessKey,

          endpoint:
            r2Endpoint,

          bucket:
            r2BucketName,

          forcePathStyle:
            true,
        }),
      },
    });

  const info =
    await egressClient
      .startRoomCompositeEgress(
        roomName,
        output,
        {
          layout: "speaker",

          encodingOptions:
            EncodingOptionsPreset
              .PORTRAIT_H264_720P_30,

          audioOnly: false,
        },
      );

  if (!info.egressId) {
    throw new Error(
      "LiveKit no devolvió un egressId.",
    );
  }

  return {
    egressId:
      info.egressId,

    key,

    url:
      `${r2PublicUrl}/${key}`,
  };
}

export async function stopLiveRecording(
  egressId: string,
) {
  await egressClient.stopEgress(
    egressId,
  );
}