import { API_URL } from "./apiConfig";

export type AlliveNotificationTarget = {
  type: "LIVE" | "USER";
  id: string;
};

export type AlliveNotification = {
  id: string;
  type: "LIVE_STARTED" | "NEW_FOLLOWER";
  text: string;
  actionLabel: string | null;
  target: AlliveNotificationTarget;
  readAt: string | null;
  createdAt: string;
  actor: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  } | null;
};

async function request<T>(
  path: string,
  token: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      headers: {
        ...(options?.headers ?? {}),
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    let message =
      "No se pudo completar la accion";

    try {
      const body =
        (await response.json()) as {
          error?: string;
        };

      message = body.error ?? message;
    } catch {
      // Respuesta sin JSON.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function registerNotificationDeviceToken(
  token: string,
  input: {
    expoPushToken: string;
    platform: string;
    deviceId?: string | null;
  },
) {
  return request<void>(
    "/api/notifications/device-tokens",
    token,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
  );
}

export function getNotifications(
  token: string,
  signal?: AbortSignal,
) {
  return request<AlliveNotification[]>(
    "/api/notifications",
    token,
    { signal },
  );
}

export function getUnreadNotificationCount(
  token: string,
) {
  return request<{ count: number }>(
    "/api/notifications/unread-count",
    token,
  );
}

export function markNotificationRead(
  token: string,
  notificationId: string,
) {
  return request<{ updated: boolean }>(
    `/api/notifications/${notificationId}/read`,
    token,
    { method: "PATCH" },
  );
}

export function markAllNotificationsRead(
  token: string,
) {
  return request<{ updated: number }>(
    "/api/notifications/read-all",
    token,
    { method: "PATCH" },
  );
}
