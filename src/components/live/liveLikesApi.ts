// src/components/live/liveLikesApi.ts

import { API_URL } from "../../api/apiConfig";
import type { ViewerIdentity } from "../../auth/types";

export type LiveLikeState = {
  count: number;
  liked: boolean;
};

function buildHeaders(
  authToken: string | null,
) {
  return {
    "Content-Type": "application/json",
    ...(authToken
      ? {
          Authorization:
            `Bearer ${authToken}`,
        }
      : {}),
  };
}

function guestQuery(
  identity: ViewerIdentity | null,
) {
  if (identity?.type !== "guest") {
    return "";
  }

  return `?guestId=${encodeURIComponent(identity.id)}`;
}

async function readLikeResponse(
  response: Response,
): Promise<LiveLikeState> {
  const data =
    (await response.json()) as
      | LiveLikeState
      | {
          error?: string;
        };

  if (
    !response.ok ||
    typeof (data as LiveLikeState).count !== "number" ||
    typeof (data as LiveLikeState).liked !== "boolean"
  ) {
    throw new Error(
      "error" in data && data.error
        ? data.error
        : `Error de likes (${response.status})`,
    );
  }

  return data as LiveLikeState;
}

export async function getLiveLikeState(
  liveId: string,
  identity: ViewerIdentity | null,
  authToken: string | null,
) {
  const response = await fetch(
    `${API_URL}/api/lives/${encodeURIComponent(liveId)}/likes${guestQuery(identity)}`,
    {
      headers: buildHeaders(
        authToken,
      ),
    },
  );

  return readLikeResponse(response);
}

export async function toggleLiveLike(
  liveId: string,
  identity: ViewerIdentity,
  authToken: string | null,
) {
  const response = await fetch(
    `${API_URL}/api/lives/${encodeURIComponent(liveId)}/likes/toggle`,
    {
      method: "POST",
      headers: buildHeaders(
        authToken,
      ),
      body: JSON.stringify({
        ...(identity.type === "guest"
          ? {
              guestId:
                identity.id,
            }
          : {}),
      }),
    },
  );

  return readLikeResponse(response);
}
