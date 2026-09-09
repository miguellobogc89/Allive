// src/maps/api/mapApi.ts

import { API_URL } from "../../api/apiConfig";
import type { MapLive } from "../types/mapTypes";

export async function getActiveMapLives(): Promise<MapLive[]> {
  const response = await fetch(`${API_URL}/api/lives/active`);

  if (!response.ok) {
    throw new Error("No se pudieron cargar los LIVE del mapa");
  }

  return response.json() as Promise<MapLive[]>;
}
