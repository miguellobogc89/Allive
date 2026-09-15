// src/components/live/broadcast/location/useLiveLocationPicker.ts

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getNearbyPlaces,
  searchPlaces,
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
    query,
    setQuery,
  ] = useState("");

  const [
    nearbyPlaces,
    setNearbyPlaces,
  ] = useState<LocationPlace[]>([]);

  const [
    searchResults,
    setSearchResults,
  ] = useState<LocationPlace[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const requestIdRef =
    useRef(0);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (!coordinates) {
      return;
    }

    const currentCoordinates =
      coordinates;

    const controller =
      new AbortController();

    async function loadNearby() {
      try {
        setLoading(true);

        const places =
          await getNearbyPlaces(
            currentCoordinates,
            controller.signal,
          );

        setNearbyPlaces(
          places.slice(0, 6),
        );
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Error cargando lugares cercanos:",
          error,
        );
      } finally {
        setLoading(false);
      }
    }

    void loadNearby();

    return () => {
      controller.abort();
    };
  }, [
    coordinates,
    enabled,
  ]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (!coordinates) {
      return;
    }

    const currentCoordinates =
      coordinates;

    const normalizedQuery =
      query.trim();

    if (
      normalizedQuery.length < 2
    ) {
      setSearchResults([]);
      return;
    }

    const requestId =
      requestIdRef.current + 1;

    requestIdRef.current =
      requestId;

    const controller =
      new AbortController();

    const timeout =
      setTimeout(() => {
        async function runSearch() {
          try {
            setLoading(true);

            const places =
              await searchPlaces(
                normalizedQuery,
                currentCoordinates,
                controller.signal,
              );

            if (
              requestId !==
              requestIdRef.current
            ) {
              return;
            }

            setSearchResults(
              places.slice(0, 8),
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
              "Error buscando ubicación:",
              error,
            );
          } finally {
            if (
              requestId ===
              requestIdRef.current
            ) {
              setLoading(false);
            }
          }
        }

        void runSearch();
      }, 350);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [
    coordinates,
    enabled,
    query,
  ]);

  const normalizedQuery =
    query.trim();

  let places =
    nearbyPlaces;

  if (
    normalizedQuery.length >= 2
  ) {
    places =
      searchResults;
  }

  return {
    query,
    setQuery,
    places,
    loading,
  };
}