// src/api/profileApi.ts

import { API_URL } from "./apiConfig";

export type ProfileLive = {
  id: string;
  title: string | null;
  placeName: string | null;
  startedAt: string;
  endedAt: string | null;
  thumbnailUrl: string | null;
};

export class ProfileApiError extends Error {
  status: number;

  constructor(
    message: string,
    status: number,
  ) {
    super(message);

    this.name = "ProfileApiError";
    this.status = status;
  }
}

export async function getMyLives(
  token: string,
  signal?: AbortSignal,
): Promise<ProfileLive[]> {
  const response = await fetch(
    `${API_URL}/api/lives/mine`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal,
    },
  );

  if (!response.ok) {
    let message =
      "No se pudieron obtener tus emisiones";

    try {
      const body = (await response.json()) as {
        error?: string;
      };

      if (body.error) {
        message = body.error;
      }
    } catch {
      // La respuesta no contiene JSON válido.
    }

    throw new ProfileApiError(
      message,
      response.status,
    );
  }

  return response.json() as Promise<
    ProfileLive[]
  >;
}
