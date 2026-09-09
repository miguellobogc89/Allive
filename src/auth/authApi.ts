// src/auth/authApi.ts

import { API_URL } from "../api/apiConfig";
import type {
  AuthSession,
  AuthUser,
} from "./types";

export class AuthApiError extends Error {
  status: number;

  constructor(
    message: string,
    status: number,
  ) {
    super(message);

    this.name = "AuthApiError";
    this.status = status;
  }
}

async function parseResponse<T>(
  response: Response,
): Promise<T> {
  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    let message = "Ha ocurrido un error";

    if (
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof data.error === "string"
    ) {
      message = data.error;
    }

    throw new AuthApiError(
      message,
      response.status,
    );
  }

  return data as T;
}

export async function register(input: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthSession> {
  const response = await fetch(
    `${API_URL}/api/auth/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(input),
    },
  );

  return parseResponse<AuthSession>(
    response,
  );
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthSession> {
  const response = await fetch(
    `${API_URL}/api/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(input),
    },
  );

  return parseResponse<AuthSession>(
    response,
  );
}

export async function getMe(
  token: string,
): Promise<AuthUser> {
  const response = await fetch(
    `${API_URL}/api/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await parseResponse<{
    user: AuthUser;
  }>(response);

  return data.user;
}

export async function updateMe(
  token: string,
  input: {
    username: string;
  },
): Promise<AuthUser> {
  const response = await fetch(
    `${API_URL}/api/auth/me`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(input),
    },
  );

  const data = await parseResponse<{
    user: AuthUser;
  }>(response);

  return data.user;
}