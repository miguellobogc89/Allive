// src/api/liveApi.ts

import {
  API_URL,
} from "./apiConfig";

import type {
  ActiveLive,
} from "../components/live/types";

export async function getActiveLives(
  signal?: AbortSignal,
): Promise<ActiveLive[]> {
  const response =
    await fetch(
      `${API_URL}/api/lives/active`,
      {
        signal,
      },
    );

  if (!response.ok) {
    throw new Error(
      `No se pudieron consultar los LIVE activos (${response.status})`,
    );
  }

  const lives =
    (await response.json()) as
      ActiveLive[];

  if (!Array.isArray(lives)) {
    throw new Error(
      "Respuesta inválida del servidor.",
    );
  }

  return lives;
}
