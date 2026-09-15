// src/api/locationApi.ts

import {
  API_URL,
} from "./apiConfig";

export type LocationPlace = {
  id: string;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
};

export type ResolvedArea = {
  placeName: string;
  neighborhood: string | null;
  city: string | null;
  province: string | null;
};

type LocationPlacesResponse = {
  places: LocationPlace[];
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

function buildCoordinatesParams(
  coordinates: Coordinates,
): URLSearchParams {
  const params =
    new URLSearchParams();

  params.set(
    "latitude",
    String(
      coordinates.latitude,
    ),
  );

  params.set(
    "longitude",
    String(
      coordinates.longitude,
    ),
  );

  return params;
}

async function requestPlaces(
  path: string,
  signal?: AbortSignal,
): Promise<LocationPlace[]> {
  const response =
    await fetch(
      `${API_URL}${path}`,
      {
        signal,
      },
    );

  if (!response.ok) {
    throw new Error(
      `Location API error ${response.status}`,
    );
  }

  const data =
    (await response.json()) as LocationPlacesResponse;

  return data.places;
}

export async function resolveArea(
  coordinates: Coordinates,
  signal?: AbortSignal,
): Promise<ResolvedArea> {
  const params =
    buildCoordinatesParams(
      coordinates,
    );

  const response =
    await fetch(
      `${API_URL}/api/location/resolve?${params.toString()}`,
      {
        signal,
      },
    );

  if (!response.ok) {
    throw new Error(
      `Location API error ${response.status}`,
    );
  }

  return (
    await response.json()
  ) as ResolvedArea;
}

export async function getNearbyPlaces(
  coordinates: Coordinates,
  signal?: AbortSignal,
): Promise<LocationPlace[]> {
  const params =
    buildCoordinatesParams(
      coordinates,
    );

  return requestPlaces(
    `/api/location/nearby?${params.toString()}`,
    signal,
  );
}

export async function searchPlaces(
  query: string,
  coordinates: Coordinates,
  signal?: AbortSignal,
): Promise<LocationPlace[]> {
  const params =
    buildCoordinatesParams(
      coordinates,
    );

  params.set(
    "q",
    query,
  );

  return requestPlaces(
    `/api/location/search?${params.toString()}`,
    signal,
  );
}