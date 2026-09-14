// src/api/profileApi.ts

import {
  API_URL,
} from "./apiConfig";

export type ProfileLive = {
  id: string;
  title: string | null;
  placeName: string | null;
  startedAt: string;
  endedAt: string | null;
  thumbnailUrl:
    | string
    | null;
};

export type ProfileStatsData = {
  followers: number;
  emissions: number;
  averageViewers:
    | number
    | null;
};

export class ProfileApiError
  extends Error {
  status: number;

  constructor(
    message: string,
    status: number,
  ) {
    super(message);

    this.name =
      "ProfileApiError";

    this.status =
      status;
  }
}

async function readProfileApiError(
  response: Response,
  fallback: string,
): Promise<never> {
  let message =
    fallback;

  try {
    const body =
      (await response.json()) as {
        error?: string;
      };

    if (body.error) {
      message =
        body.error;
    }
  } catch {
    // Sin JSON válido.
  }

  throw new ProfileApiError(
    message,
    response.status,
  );
}

export async function getMyLives(
  token: string,
  signal?: AbortSignal,
): Promise<ProfileLive[]> {
  const response =
    await fetch(
      `${API_URL}/api/profile/me/lives`,
      {
        method: "GET",

        headers: {
          Authorization:
            `Bearer ${token}`,
        },

        signal,
      },
    );

  if (!response.ok) {
    await readProfileApiError(
      response,
      "No se pudieron obtener tus emisiones",
    );
  }

  return response.json() as Promise<
    ProfileLive[]
  >;
}

export async function getMyProfileStats(
  token: string,
  signal?: AbortSignal,
): Promise<ProfileStatsData> {
  const response =
    await fetch(
      `${API_URL}/api/profile/me/stats`,
      {
        method: "GET",

        headers: {
          Authorization:
            `Bearer ${token}`,
        },

        signal,
      },
    );

  if (!response.ok) {
    await readProfileApiError(
      response,
      "No se pudieron obtener las estadísticas del perfil",
    );
  }

  return response.json() as Promise<
    ProfileStatsData
  >;
}