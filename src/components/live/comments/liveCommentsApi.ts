// src/components/live/comments/liveCommentsApi.ts

import { API_URL } from "../../../api/apiConfig";
import type { ViewerIdentity } from "../../../auth/types";
import type { LiveCommentModel } from "./liveCommentTypes";

export async function getLiveComments(
  liveId: string,
): Promise<LiveCommentModel[]> {
  const response = await fetch(
    `${API_URL}/api/lives/${encodeURIComponent(liveId)}/comments`,
  );

  if (!response.ok) {
    throw new Error(
      `No se pudieron cargar los comentarios (${response.status})`,
    );
  }

  return response.json();
}

export async function createLiveComment(
  liveId: string,
  body: string,
  identity: ViewerIdentity,
  token: string | null,
): Promise<LiveCommentModel> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL}/api/lives/${encodeURIComponent(liveId)}/comments`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        body,
        ...(identity.type === "guest"
          ? {
              guestId: identity.id,
              username: "invitado",
            }
          : {}),
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ??
        `No se pudo publicar el comentario (${response.status})`,
    );
  }

  return data as LiveCommentModel;
}
