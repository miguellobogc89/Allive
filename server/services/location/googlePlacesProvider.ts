// server/services/location/googlePlacesProvider.ts

import {
  type LocationCoordinates,
  type LocationPlace,
  type LocationProvider,
  type ResolvedArea,
} from "./locationTypes";

const GOOGLE_TEXT_SEARCH_URL =
  "https://places.googleapis.com/v1/places:searchText";

const GOOGLE_NEARBY_SEARCH_URL =
  "https://places.googleapis.com/v1/places:searchNearby";

const LIVE_RELEVANT_PLACE_TYPES = [
  "restaurant",
  "bar",
  "cafe",
  "coffee_shop",
  "pub",
  "night_club",

  "movie_theater",
  "performing_arts_theater",
  "concert_hall",
  "amphitheatre",
  "event_venue",

  "museum",
  "art_gallery",
  "cultural_center",
  "historical_landmark",
  "monument",

  "tourist_attraction",
  "visitor_center",
  "observation_deck",

  "amusement_park",
  "aquarium",
  "zoo",
  "water_park",

  "park",
  "national_park",
  "plaza",

  "stadium",
  "sports_complex",
  "sports_club",
  "gym",

  "shopping_mall",
  "market",

  "airport",
  "train_station",
  "transit_station",
  "ferry_terminal",
] as const;

type GoogleAddressComponent = {
  longText?: string;
  types?: string[];
};

type GooglePlace = {
  id?: string;

  displayName?: {
    text?: string;
  };

  formattedAddress?: string;

  location?: {
    latitude?: number;
    longitude?: number;
  };

  addressComponents?: GoogleAddressComponent[];
};

type GooglePlacesResponse = {
  places?: GooglePlace[];
};

function getApiKey(): string {
  const apiKey =
    process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GOOGLE_PLACES_API_KEY no está configurada",
    );
  }

  return apiKey;
}

function getHeaders(
  fieldMask: string[],
) {
  return {
    "Content-Type":
      "application/json",

    "X-Goog-Api-Key":
      getApiKey(),

    "X-Goog-FieldMask":
      fieldMask.join(","),
  };
}

function mapPlaces(
  response: GooglePlacesResponse,
): LocationPlace[] {
  const places =
    response.places ?? [];

  const result: LocationPlace[] =
    [];

  for (const place of places) {
    const id =
      place.id;

    const name =
      place.displayName?.text;

    const latitude =
      place.location?.latitude;

    const longitude =
      place.location?.longitude;

    if (!id) {
      continue;
    }

    if (!name) {
      continue;
    }

    if (
      typeof latitude !==
        "number" ||
      typeof longitude !==
        "number"
    ) {
      continue;
    }

    result.push({
      id,
      name,
      address:
        place.formattedAddress ??
        null,
      latitude,
      longitude,
    });
  }

  return result;
}

function findAddressComponent(
  components: GoogleAddressComponent[],
  acceptedTypes: string[],
): string | null {
  for (
    const acceptedType
    of acceptedTypes
  ) {
    for (
      const component
      of components
    ) {
      const types =
        component.types ?? [];

      if (
        !types.includes(
          acceptedType,
        )
      ) {
        continue;
      }

      if (
        !component.longText
      ) {
        continue;
      }

      return component.longText;
    }
  }

  return null;
}

function resolveAreaFromPlace(
  place: GooglePlace,
): ResolvedArea | null {
  const components =
    place.addressComponents ?? [];

  if (
    components.length === 0
  ) {
    return null;
  }

  const neighborhood =
    findAddressComponent(
      components,
      [
        "neighborhood",
        "sublocality_level_1",
        "sublocality",
      ],
    );

  const city =
    findAddressComponent(
      components,
      [
        "locality",
        "postal_town",
      ],
    );

  const province =
    findAddressComponent(
      components,
      [
        "administrative_area_level_2",
        "administrative_area_level_1",
      ],
    );

  let placeName = "";

  if (
    neighborhood &&
    city &&
    neighborhood !== city
  ) {
    placeName =
      `${neighborhood}, ${city}`;
  }

  if (
    !placeName &&
    city &&
    province &&
    city !== province
  ) {
    placeName =
      `${city}, ${province}`;
  }

  if (
    !placeName &&
    city
  ) {
    placeName =
      city;
  }

  if (
    !placeName &&
    province
  ) {
    placeName =
      province;
  }

  if (!placeName) {
    return null;
  }

  return {
    placeName,
    neighborhood,
    city,
    province,
  };
}

async function parsePlacesResponse(
  response: Response,
): Promise<GooglePlacesResponse> {
  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `Google Places error ${response.status}: ${errorText}`,
    );
  }

  return (
    await response.json()
  ) as GooglePlacesResponse;
}

async function resolveArea(
  coordinates: LocationCoordinates,
): Promise<ResolvedArea | null> {
  const response =
    await fetch(
      GOOGLE_NEARBY_SEARCH_URL,
      {
        method: "POST",

        headers:
          getHeaders([
            "places.addressComponents",
          ]),

        body: JSON.stringify({
          maxResultCount: 1,

          rankPreference:
            "DISTANCE",

          locationRestriction: {
            circle: {
              center: {
                latitude:
                  coordinates.latitude,

                longitude:
                  coordinates.longitude,
              },

              radius: 100,
            },
          },

          languageCode: "es",
          regionCode: "ES",
        }),
      },
    );

  const data =
    await parsePlacesResponse(
      response,
    );

  const places =
    data.places ?? [];

  if (
    places.length === 0
  ) {
    return null;
  }

  return resolveAreaFromPlace(
    places[0],
  );
}

async function searchNearby(
  coordinates: LocationCoordinates,
): Promise<LocationPlace[]> {
  const response =
    await fetch(
      GOOGLE_NEARBY_SEARCH_URL,
      {
        method: "POST",

        headers:
          getHeaders([
            "places.id",
            "places.displayName",
            "places.formattedAddress",
            "places.location",
          ]),

        body: JSON.stringify({
          includedTypes:
            LIVE_RELEVANT_PLACE_TYPES,

          maxResultCount: 4,

          rankPreference:
            "DISTANCE",

          locationRestriction: {
            circle: {
              center: {
                latitude:
                  coordinates.latitude,

                longitude:
                  coordinates.longitude,
              },

              radius: 10,
            },
          },

          languageCode: "es",
          regionCode: "ES",
        }),
      },
    );

  const data =
    await parsePlacesResponse(
      response,
    );

  return mapPlaces(
    data,
  );
}

async function searchByText(
  query: string,
  coordinates: LocationCoordinates,
): Promise<LocationPlace[]> {
  const response =
    await fetch(
      GOOGLE_TEXT_SEARCH_URL,
      {
        method: "POST",

        headers:
          getHeaders([
            "places.id",
            "places.displayName",
            "places.formattedAddress",
            "places.location",
          ]),

        body: JSON.stringify({
          textQuery:
            query,

          locationBias: {
            circle: {
              center: {
                latitude:
                  coordinates.latitude,

                longitude:
                  coordinates.longitude,
              },

              radius: 5000,
            },
          },

          maxResultCount: 10,
          languageCode: "es",
          regionCode: "ES",
        }),
      },
    );

  const data =
    await parsePlacesResponse(
      response,
    );

  return mapPlaces(
    data,
  );
}

export const googlePlacesProvider: LocationProvider =
  {
    async resolveArea(
      coordinates,
    ) {
      return resolveArea(
        coordinates,
      );
    },

    async searchNearby(
      coordinates,
    ) {
      return searchNearby(
        coordinates,
      );
    },

    async search(
      query,
      coordinates,
    ) {
      return searchByText(
        query,
        coordinates,
      );
    },
  };