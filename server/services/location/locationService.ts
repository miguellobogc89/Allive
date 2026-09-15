// server/services/location/locationService.ts

import {
  googlePlacesProvider,
} from "./googlePlacesProvider";

import {
  type LocationCoordinates,
  type LocationPlace,
  type ResolvedArea,
} from "./locationTypes";

export async function resolveArea(
  coordinates: LocationCoordinates,
): Promise<ResolvedArea | null> {
  return googlePlacesProvider.resolveArea(
    coordinates,
  );
}

export async function getNearbyPlaces(
  coordinates: LocationCoordinates,
): Promise<LocationPlace[]> {
  return googlePlacesProvider.searchNearby(
    coordinates,
  );
}

export async function searchPlaces(
  query: string,
  coordinates: LocationCoordinates,
): Promise<LocationPlace[]> {
  const normalizedQuery =
    query.trim();

  if (!normalizedQuery) {
    return [];
  }

  return googlePlacesProvider.search(
    normalizedQuery,
    coordinates,
  );
}