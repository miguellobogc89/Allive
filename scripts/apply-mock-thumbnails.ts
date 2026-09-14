// scripts/apply-mock-thumbnails.ts

import {
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import {
  readFile,
  readdir,
} from "node:fs/promises";

import {
  prisma,
} from "../server/db";

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

const bucketName =
  requireEnvironmentVariable(
    "R2_BUCKET_NAME",
  );

const publicUrl =
  requireEnvironmentVariable(
    "R2_PUBLIC_URL",
  ).replace(/\/$/, "");

const thumbnailsDirectory =
  new URL(
    "./assets/mock-thumbnails/",
    import.meta.url,
  );

const r2 =
  new S3Client({
    region: "auto",

    endpoint:
      requireEnvironmentVariable(
        "R2_ENDPOINT",
      ),

    credentials: {
      accessKeyId:
        requireEnvironmentVariable(
          "R2_ACCESS_KEY_ID",
        ),

      secretAccessKey:
        requireEnvironmentVariable(
          "R2_SECRET_ACCESS_KEY",
        ),
    },

    forcePathStyle: true,
  });

async function main() {
  const files =
    (
      await readdir(
        thumbnailsDirectory,
        {
          withFileTypes: true,
        },
      )
    )
      .filter(
        (entry) =>
          entry.isFile() &&
          entry.name
            .toLowerCase()
            .endsWith(".png"),
      )
      .map(
        (entry) =>
          entry.name,
      )
      .sort();

  if (
    files.length === 0
  ) {
    throw new Error(
      "No hay imágenes PNG en scripts/assets/mock-thumbnails.",
    );
  }

  console.log(
    `Imágenes encontradas: ${files.length}`,
  );

  for (
    let index = 0;
    index < files.length;
    index += 1
  ) {
    const fileName =
      files[index];

    const roomName =
      `allive_dev_live_${index + 1}`;

    const image =
      await readFile(
        new URL(
          fileName,
          thumbnailsDirectory,
        ),
      );

    const objectKey =
      `dev/mock-thumbnails/${fileName}`;

    await r2.send(
      new PutObjectCommand({
        Bucket:
          bucketName,

        Key:
          objectKey,

        Body:
          image,

        ContentType:
          "image/png",

        CacheControl:
          "public, max-age=31536000, immutable",
      }),
    );

    const thumbnailUrl =
      `${publicUrl}/${objectKey}`;

    const mockLive =
      await prisma.liveSession.findFirst({
        where: {
          roomName,
        },

        select: {
          id: true,
        },
      });

    if (!mockLive) {
      console.warn(
        `No existe ${roomName}; se omite ${fileName}.`,
      );

      continue;
    }

    await prisma.liveSession.update({
      where: {
        id: mockLive.id,
      },

      data: {
        thumbnailUrl,
        status: "LIVE",
        startedAt:
          new Date(
            Date.now() -
              index *
                3 *
                60 *
                1000,
          ),
        endedAt: null,
      },
    });

    console.log(
      `${roomName} → ${fileName}`,
    );
  }

  console.log(
    "Thumbnails mock aplicadas correctamente.",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });