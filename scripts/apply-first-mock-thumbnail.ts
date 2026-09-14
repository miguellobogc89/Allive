// scripts/apply-first-mock-thumbnail.ts

import {
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import {
  readFile,
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

const objectKey =
  "dev/mock-thumbnails/01-triana-sunset.png";

const imagePath =
  new URL(
    "./assets/mock-thumbnails/01-triana-sunset.png",
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
  const image =
    await readFile(
      imagePath,
    );

  await r2.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: image,
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
        roomName:
          "allive_dev_live_1",
      },

      select: {
        id: true,
      },
    });

  if (!mockLive) {
    throw new Error(
      "No existe allive_dev_live_1. Ejecuta primero el seed de búsqueda.",
    );
  }

  await prisma.liveSession.update({
    where: {
      id: mockLive.id,
    },

data: {
  thumbnailUrl,
  status: "LIVE",
  startedAt: new Date(),
  endedAt: null,
},
  });

  console.log(
    "Thumbnail mock aplicada:",
    thumbnailUrl,
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