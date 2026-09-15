// src/components/live/useBroadcastLocation.native.ts

import {
  useEffect,
  useState,
} from "react";

import * as Location from "expo-location";

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
      let mounted = true;

      const controller =
        new AbortController();

      async function loadLocation() {
        try {
          const permission =
            await Location.requestForegroundPermissionsAsync();

          if (
            permission.status !==
            Location.PermissionStatus.GRANTED
          ) {
            if (mounted) {
              setLocationStatus(
                "unavailable",
              );
            }

            return;
          }

          const position =
            await Location.getCurrentPositionAsync(
              {
                accuracy:
                  Location.Accuracy.High,
              },
            );

          if (!mounted) {
            return;
          }

          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          console.log(
            "📍 GPS RAW NATIVE",
            {
              latitude,
              longitude,
              accuracy:
                position.coords.accuracy,
            },
          );

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

          if (!mounted) {
            return;
          }

          setLocation({
            latitude,
            longitude,
            placeName,
          });

          setLocationStatus(
            "ready",
          );
        } catch (
          locationError
        ) {
          console.warn(
            "No se pudo obtener ubicación nativa:",
            locationError,
          );

          if (mounted) {
            setLocationStatus(
              "unavailable",
            );
          }
        }
      }

      void loadLocation();

      return () => {
        mounted = false;
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