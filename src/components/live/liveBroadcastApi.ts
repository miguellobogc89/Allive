// src/components/live/liveBroadcastApi.ts

import { API_URL } from "../../api/apiConfig";
import type { BroadcastLocation } from "./broadcastTypes";
import type { LiveKitTokenResponse } from "./types";

type LiveMetadataPayload = {
  title: string;
  eventName: string;
  location: BroadcastLocation | null;
};

function buildLiveMetadataBody({
  title,
  eventName,
  location,
}: LiveMetadataPayload) {
  return {
    title,
    eventName,
    latitude: location?.latitude ?? null,
    longitude: location?.longitude ?? null,
    placeName: location?.placeName ?? null,
  };
}

export async function getBroadcasterToken(
  roomName: string,
  authToken: string,
): Promise<LiveKitTokenResponse> {
  const response = await fetch(`${API_URL}/api/livekit/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      roomName,
      role: "broadcaster",
    }),
  });

  if (!response.ok) {
    const responseBody = await response.json().catch(() => null);

    throw new Error(
      responseBody?.error ??
        `No se pudo obtener el token de emisión (${response.status})`,
    );
  }

  const tokenData = (await response.json()) as LiveKitTokenResponse;

  if (!tokenData.serverUrl || !tokenData.participantToken) {
    throw new Error("La API devolvió un token LiveKit inválido.");
  }

  return tokenData;
}

export async function registerLiveInBackend(
  roomName: string,
  metadata: LiveMetadataPayload,
  authToken: string,
) {
  const response = await fetch(`${API_URL}/api/lives`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      roomName,
      ...buildLiveMetadataBody(metadata),
    }),
  });

  if (!response.ok) {
    throw new Error(
      `No se pudo registrar el LIVE en Allive (${response.status})`,
    );
  }

  const liveSession = await response.json();

  if (!liveSession?.id) {
    throw new Error("La API no devolvió el ID del LIVE.");
  }

  console.log("Allive LIVE registrado:", liveSession);

  return liveSession.id as string;
}

export async function updateLiveMetadata(
  liveSessionId: string,
  metadata: LiveMetadataPayload,
  authToken: string,
) {
  const response = await fetch(`${API_URL}/api/lives/${liveSessionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(buildLiveMetadataBody(metadata)),
  });

  if (!response.ok) {
    const responseBody = await response.json().catch(() => null);

    throw new Error(
      responseBody?.error ??
        `No se pudieron actualizar los datos del LIVE (${response.status})`,
    );
  }
}

export async function markLiveAsEnded(
  liveSessionId: string,
  authToken: string,
) {
  const response = await fetch(
    `${API_URL}/api/lives/${liveSessionId}/end`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  );

  if (!response.ok) {
    const responseBody = await response.json().catch(() => null);

    throw new Error(
      responseBody?.error ??
        `No se pudo finalizar el LIVE en Allive (${response.status})`,
    );
  }
}