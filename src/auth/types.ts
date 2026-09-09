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

export type RegisteredIdentity = {
  type: "user";
  id: string;
};

export type GuestIdentity = {
  type: "guest";
  id: string;
};

export type ViewerIdentity =
  | RegisteredIdentity
  | GuestIdentity;