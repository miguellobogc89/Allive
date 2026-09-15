// server/services/location/locationTypes.ts

export type LocationCoordinates = {
  latitude: number;
  longitude: number;
};

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

export type LocationProvider = {
  resolveArea(
    coordinates: LocationCoordinates,
  ): Promise<ResolvedArea | null>;

  searchNearby(
    coordinates: LocationCoordinates,
  ): Promise<LocationPlace[]>;

  search(
    query: string,
    coordinates: LocationCoordinates,
  ): Promise<LocationPlace[]>;
};