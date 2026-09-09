// src/components/live/useBroadcastLocation.web.ts

import { useEffect, useState } from "react";

import type {
  BroadcastLocation,
  LocationStatus,
} from "./broadcastTypes";

export function useBroadcastLocation() {
  const [location, setLocation] = useState<BroadcastLocation | null>(null);
  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>("loading");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          placeName: "Ubicaci\u00f3n actual",
        });

        setLocationStatus("ready");
      },
      (locationError) => {
        console.warn("No se pudo obtener ubicaci\u00f3n:", locationError);

        setLocationStatus("unavailable");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, []);

  return { location, locationStatus };
}
