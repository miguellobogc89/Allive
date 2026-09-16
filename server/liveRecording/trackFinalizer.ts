// server/liveRecording/trackFinalizer.ts

import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import {
  createReadStream,
  createWriteStream,
} from "node:fs";

import {
  mkdir,
  readFile,
  rm,
} from "node:fs/promises";

import {
  tmpdir,
} from "node:os";

import {
  join,
} from "node:path";

import {
  pipeline,
} from "node:stream/promises";

import {
  spawn,
} from "node:child_process";

import ffmpegPath from "ffmpeg-static";

import {
  recordingConfig,
} from "./config";


type FinalizedReplay = {
  key: string;
  url: string;
};


const r2Client =
  new S3Client({
    region: "auto",

    endpoint:
      recordingConfig.r2Endpoint,

    credentials: {
      accessKeyId:
        recordingConfig.r2AccessKeyId,

      secretAccessKey:
        recordingConfig.r2SecretAccessKey,
    },

    forcePathStyle: true,
  });


function sleep(
  milliseconds: number,
) {
  return new Promise<void>(
    (resolve) => {
      setTimeout(
        resolve,
        milliseconds,
      );
    },
  );
}


function buildPublicUrl(
  key: string,
) {
  return (
    `${recordingConfig.r2PublicUrl}/${key}`
  );
}


async function findObjectByPrefix(
  prefix: string,
) {
  const response =
    await r2Client.send(
      new ListObjectsV2Command({
        Bucket:
          recordingConfig.r2BucketName,

        Prefix:
          prefix,
      }),
    );

  const object =
    response.Contents
      ?.filter(
        (item) =>
          Boolean(item.Key),
      )
      .sort(
        (a, b) =>
          (b.LastModified?.getTime() ?? 0) -
          (a.LastModified?.getTime() ?? 0),
      )[0];

  return object?.Key ?? null;
}


async function waitForObject(
  prefix: string,
  attempts = 20,
  delayMs = 500,
) {
  for (
    let attempt = 1;
    attempt <= attempts;
    attempt += 1
  ) {
    const key =
      await findObjectByPrefix(
        prefix,
      );

    if (key) {
      return key;
    }

    if (attempt < attempts) {
      await sleep(delayMs);
    }
  }

  throw new Error(
    `R2 no terminó de generar el objeto ${prefix}.`,
  );
}


async function downloadObject(
  key: string,
  destination: string,
) {
  const response =
    await r2Client.send(
      new GetObjectCommand({
        Bucket:
          recordingConfig.r2BucketName,

        Key: key,
      }),
    );

  if (!response.Body) {
    throw new Error(
      `R2 devolvió el objeto ${key} sin contenido.`,
    );
  }

  const body =
    response.Body as NodeJS.ReadableStream;

  await pipeline(
    body,
    createWriteStream(
      destination,
    ),
  );
}


async function runFfmpeg(
  videoPath: string,
  audioPath: string | null,
  outputPath: string,
) {
  const executable =
    ffmpegPath;

  if (!executable) {
    throw new Error(
      "ffmpeg-static no devolvió una ruta válida a FFmpeg.",
    );
  }

  const args =
    audioPath
      ? [
          "-y",

          "-i",
          videoPath,

          "-i",
          audioPath,

          "-map",
          "0:v:0",

          "-map",
          "1:a:0",

          "-c",
          "copy",

          outputPath,
        ]
      : [
          "-y",

          "-i",
          videoPath,

          "-map",
          "0:v:0",

          "-c",
          "copy",

          outputPath,
        ];

  await new Promise<void>(
    (
      resolve,
      reject,
    ) => {
      const child =
        spawn(
          executable,
          args,
          {
            stdio: [
              "ignore",
              "ignore",
              "pipe",
            ],
          },
        );

      let stderr = "";

      child.stderr.on(
        "data",
        (
          chunk: Buffer,
        ) => {
          stderr +=
            chunk.toString();
        },
      );

      child.on(
        "error",
        (
          error: Error,
        ) => {
          reject(error);
        },
      );

      child.on(
        "close",
        (
          code: number | null,
        ) => {
          if (code === 0) {
            resolve();
            return;
          }

          reject(
            new Error(
              `FFmpeg terminó con código ${code}.\n${stderr}`,
            ),
          );
        },
      );
    },
  );
}


async function uploadReplay(
  localPath: string,
  key: string,
) {
  const body =
    await readFile(
      localPath,
    );

  await r2Client.send(
    new PutObjectCommand({
      Bucket:
        recordingConfig.r2BucketName,

      Key:
        key,

      Body:
        body,

      ContentType:
        "video/webm",
    }),
  );
}


/*
 * Convierte las pistas independientes generadas
 * por Track Egress en el replay reproducible de Allive.
 *
 * Los archivos RAW se conservan en R2 de momento.
 * Así podemos inspeccionarlos durante la beta si
 * aparece cualquier problema con el mux.
 */
export async function finalizeTrackReplay(
  liveSessionId: string,
  videoKeyPrefix: string | null,
  audioKeyPrefix: string | null,
): Promise<FinalizedReplay> {
  if (!videoKeyPrefix) {
    throw new Error(
      "No existe una pista de vídeo TRACK para generar el replay.",
    );
  }

  const temporaryDirectory =
    join(
      tmpdir(),
      `allive-replay-${liveSessionId}-${Date.now()}`,
    );

  await mkdir(
    temporaryDirectory,
    {
      recursive: true,
    },
  );

  const videoPath =
    join(
      temporaryDirectory,
      "video.webm",
    );

  const audioPath =
    join(
      temporaryDirectory,
      "audio.ogg",
    );

  const outputPath =
    join(
      temporaryDirectory,
      "replay.webm",
    );

  try {
    /*
     * LiveKit añade la extensión real al filepath
     * proporcionado al Track Egress.
     *
     * Por eso buscamos por prefijo en lugar de asumir
     * que la key almacenada en Neon es el objeto final.
     */
    const actualVideoKey =
      await waitForObject(
        videoKeyPrefix,
      );

    let actualAudioKey:
      string | null = null;

    if (audioKeyPrefix) {
      try {
        actualAudioKey =
          await waitForObject(
            audioKeyPrefix,
          );
      } catch (error) {
        console.warn(
          "No se encontró la pista de audio TRACK. Se generará replay sin audio.",
          error,
        );
      }
    }

    await downloadObject(
      actualVideoKey,
      videoPath,
    );

    if (actualAudioKey) {
      await downloadObject(
        actualAudioKey,
        audioPath,
      );
    }

    await runFfmpeg(
      videoPath,
      actualAudioKey
        ? audioPath
        : null,
      outputPath,
    );

    const finalKey =
      `live-replays/${liveSessionId}/replay.webm`;

    await uploadReplay(
      outputPath,
      finalKey,
    );

    const finalUrl =
      buildPublicUrl(
        finalKey,
      );

    console.log(
      "🎬 Replay TRACK finalizado:",
      {
        liveSessionId,
        videoKey:
          actualVideoKey,
        audioKey:
          actualAudioKey,
        recordingKey:
          finalKey,
        recordingUrl:
          finalUrl,
      },
    );

    return {
      key:
        finalKey,

      url:
        finalUrl,
    };
  } finally {
    try {
      await rm(
        temporaryDirectory,
        {
          recursive: true,
          force: true,
        },
      );
    } catch (error) {
      console.warn(
        "No se pudo limpiar el directorio temporal del replay:",
        error,
      );
    }
  }
}
