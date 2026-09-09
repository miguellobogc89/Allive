// src/components/live/thumbnail/liveThumbnailApi.ts

import { API_URL } from "../../../api/apiConfig";

export async function uploadLiveThumbnail(
  liveSessionId: string,
  thumbnail: Blob,
  authToken: string,
) {
  const response = await fetch(
    `${API_URL}/api/lives/${liveSessionId}/thumbnail`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "image/webp",
      },
      body: thumbnail,
    },
  );

  if (!response.ok) {
    const responseBody = await response
      .json()
      .catch(() => null);

    throw new Error(
      responseBody?.error ??
        `No se pudo actualizar la miniatura (${response.status})`,
    );
  }

  return response.json() as Promise<{
    thumbnailUrl: string;
  }>;
}