// server/routes/location.ts

import {
  type Express,
  type Request,
  type Response,
} from "express";

import {
  getNearbyPlaces,
  resolveArea,
  searchPlaces,
} from "../services/location/locationService";

function parseCoordinate(
  value: unknown,
): number | null {
  if (
    typeof value !==
    "string"
  ) {
    return null;
  }

  const parsed =
    Number(value);

  if (
    !Number.isFinite(
      parsed,
    )
  ) {
    return null;
  }

  return parsed;
}

function getSearchQuery(
  value: unknown,
): string {
  if (
    typeof value !==
    "string"
  ) {
    return "";
  }

  return value.trim();
}

function getCoordinates(
  req: Request,
) {
  const latitude =
    parseCoordinate(
      req.query.latitude,
    );

  const longitude =
    parseCoordinate(
      req.query.longitude,
    );

  if (
    latitude === null ||
    longitude === null
  ) {
    return null;
  }

  return {
    latitude,
    longitude,
  };
}

export function registerLocationRoutes(
  app: Express,
) {
  app.get(
    "/api/location/resolve",
    async (
      req: Request,
      res: Response,
    ) => {
      const coordinates =
        getCoordinates(
          req,
        );

      if (!coordinates) {
        return res.status(400).json({
          error:
            "Coordenadas inválidas",
        });
      }

      try {
        const area =
          await resolveArea(
            coordinates,
          );

        if (!area) {
          return res.status(404).json({
            error:
              "No se pudo resolver la ubicación",
          });
        }

        return res.json(
          area,
        );
      } catch (error) {
        console.error(
          "Error resolviendo ubicación:",
          error,
        );

        return res.status(502).json({
          error:
            "No se pudo resolver la ubicación",
        });
      }
    },
  );

  app.get(
    "/api/location/nearby",
    async (
      req: Request,
      res: Response,
    ) => {
      const coordinates =
        getCoordinates(
          req,
        );

      if (!coordinates) {
        return res.status(400).json({
          error:
            "Coordenadas inválidas",
        });
      }

      try {
        const places =
          await getNearbyPlaces(
            coordinates,
          );

        return res.json({
          places,
        });
      } catch (error) {
        console.error(
          "Error obteniendo lugares cercanos:",
          error,
        );

        return res.status(502).json({
          error:
            "No se pudieron obtener los lugares cercanos",
        });
      }
    },
  );

  app.get(
    "/api/location/search",
    async (
      req: Request,
      res: Response,
    ) => {
      const coordinates =
        getCoordinates(
          req,
        );

      const query =
        getSearchQuery(
          req.query.q,
        );

      if (!coordinates) {
        return res.status(400).json({
          error:
            "Coordenadas inválidas",
        });
      }

      if (!query) {
        return res.status(400).json({
          error:
            "La búsqueda está vacía",
        });
      }

      try {
        const places =
          await searchPlaces(
            query,
            coordinates,
          );

        return res.json({
          places,
        });
      } catch (error) {
        console.error(
          "Error buscando lugares:",
          error,
        );

        return res.status(502).json({
          error:
            "No se pudieron buscar lugares",
        });
      }
    },
  );
}