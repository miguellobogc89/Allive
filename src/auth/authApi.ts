// src/auth/authApi.ts

import { API_URL } from "../api/apiConfig";
import type { AuthSession, AuthUser } from "./types";

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Ha ocurrido un error");
  }

  return data;
}

export async function register(input: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthSession> {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return parseResponse<AuthSession>(response);
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthSession> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return parseResponse<AuthSession>(response);
}

export async function getMe(token: string): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await parseResponse<{ user: AuthUser }>(response);

  return data.user;
}