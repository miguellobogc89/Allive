// src/auth/types.ts

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};