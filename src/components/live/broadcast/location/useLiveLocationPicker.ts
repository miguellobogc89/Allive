// src/components/live/broadcast/location/useLiveLocationPicker.ts

import {
  useEffect,
  useState,
} from "react";

import {
  getNearbyPlaces,
  type LocationPlace,
} from "../../../../api/locationApi";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type Props = {
  coordinates:
    | Coordinates
    | null;

  enabled: boolean;
};

export function useLiveLocationPicker({
  coordinates,
  enabled,
}: Props) {
  const [
    places,
    setPlaces,
  ] = useState<LocationPlace[]>(
    [],
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  useEffect(
    () => {
      if (!enabled) {
        return;
      }

      if (!coordinates) {
        setPlaces([]);
        return;
      }

      const currentCoordinates =
        coordinates;

      const controller =
        new AbortController();

      async function loadNearby() {
        try {
          setLoading(true);

          const nearby =
            await getNearbyPlaces(
              currentCoordinates,
              controller.signal,
            );

          setPlaces(
            nearby.slice(
              0,
              4,
            ),
          );
        } catch (error) {
          if (
            error instanceof
              DOMException &&
            error.name ===
              "AbortError"
          ) {
            return;
          }

          console.error(
            "Error cargando lugares cercanos:",
            error,
          );

          setPlaces([]);
        } finally {
          setLoading(false);
        }
      }

      void loadNearby();

      return () => {
        controller.abort();
      };
    },
    [
      coordinates,
      enabled,
    ],
  );

  return {
    places,
    loading,
  };
}