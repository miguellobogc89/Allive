// src/maps/hooks/useMapLives.ts

import { useCallback, useEffect, useMemo, useState } from "react";

import { getActiveMapLives } from "../api/mapApi";
import type { MapLive, MappedLive } from "../types/mapTypes";

function hasCoordinates(live: MapLive): live is MappedLive {
  return (
    typeof live.latitude === "number" &&
    Number.isFinite(live.latitude) &&
    typeof live.longitude === "number" &&
    Number.isFinite(live.longitude)
  );
}

export function useMapLives() {
  const [lives, setLives] = useState<MapLive[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const activeLives = await getActiveMapLives();
      setLives(activeLives);
    } catch (loadError) {
      console.error("Error cargando LIVE del mapa:", loadError);
      setError("No se pudieron cargar los LIVE");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const mappedLives = useMemo(
    () => lives.filter(hasCoordinates),
    [lives],
  );

  return {
    lives,
    mappedLives,
    isLoading,
    error,
    refresh,
  };
}
