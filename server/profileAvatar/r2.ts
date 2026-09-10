// server/profileAvatar/r2.ts

import {
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

function requireEnvironmentVariable(
  name: string,
) {
  const value = process.env[name];

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

const r2 = new S3Client({
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
});

function extensionForContentType(
  contentType: string,
) {
  if (contentType === "image/png") {
    return "png";
  }

  if (contentType === "image/webp") {
    return "webp";
  }

  return "jpg";
}

export async function uploadProfileAvatarToR2({
  userId,
  image,
  contentType,
}: {
  userId: string;
  image: Buffer;
  contentType: string;
}) {
  const key = `profile-avatars/${userId}-${Date.now()}.${extensionForContentType(
    contentType,
  )}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: image,
      ContentType: contentType,
      CacheControl:
        "public, max-age=31536000, immutable",
    }),
  );

  return `${publicUrl}/${key}`;
}
