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

export const recordingConfig = {
  livekitUrl:
    requireEnvironmentVariable(
      "LIVEKIT_URL",
    ),

  livekitApiKey:
    requireEnvironmentVariable(
      "LIVEKIT_API_KEY",
    ),

  livekitApiSecret:
    requireEnvironmentVariable(
      "LIVEKIT_API_SECRET",
    ),

  r2BucketName:
    requireEnvironmentVariable(
      "R2_BUCKET_NAME",
    ),

  r2Endpoint:
    requireEnvironmentVariable(
      "R2_ENDPOINT",
    ),

  r2AccessKeyId:
    requireEnvironmentVariable(
      "R2_ACCESS_KEY_ID",
    ),

  r2SecretAccessKey:
    requireEnvironmentVariable(
      "R2_SECRET_ACCESS_KEY",
    ),

  r2PublicUrl:
    requireEnvironmentVariable(
      "R2_PUBLIC_URL",
    ).replace(/\/$/, ""),
};
