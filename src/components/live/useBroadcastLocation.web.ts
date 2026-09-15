// src/components/live/useBroadcastLocation.web.ts

import {
  useEffect,
  useState,
} from "react";

import {
  resolveArea,
} from "../../api/locationApi";

import type {
  BroadcastLocation,
  LocationStatus,
} from "./broadcastTypes";

export function useBroadcastLocation() {
  const [
    location,
    setLocation,
  ] =
    useState<BroadcastLocation | null>(
      null,
    );

  const [
    locationStatus,
    setLocationStatus,
  ] =
    useState<LocationStatus>(
      "loading",
    );

  useEffect(
    () => {
      if (
        !navigator.geolocation
      ) {
        setLocationStatus(
          "unavailable",
        );

        return;
      }

      const controller =
        new AbortController();

      navigator.geolocation.getCurrentPosition(
        async (
          position,
        ) => {
          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          let placeName =
            "Ubicación actual";

          try {
            const area =
              await resolveArea(
                {
                  latitude,
                  longitude,
                },
                controller.signal,
              );

            placeName =
              area.placeName;
          } catch (
            locationError
          ) {
            console.warn(
              "No se pudo resolver el nombre de la ubicación:",
              locationError,
            );
          }

          setLocation({
            latitude,
            longitude,
            placeName,
          });

          setLocationStatus(
            "ready",
          );
        },
        (
          locationError,
        ) => {
          console.warn(
            "No se pudo obtener ubicación:",
            locationError,
          );

          setLocationStatus(
            "unavailable",
          );
        },
        {
          enableHighAccuracy:
            true,
          timeout: 10000,
          maximumAge: 30000,
        },
      );

      return () => {
        controller.abort();
      };
    },
    [],
  );

  return {
    location,
    locationStatus,
  };
}