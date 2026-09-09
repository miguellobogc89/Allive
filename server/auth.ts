// server/auth.ts

import type { NextFunction, Request, Response } from "express";
import { jwtVerify, SignJWT } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Falta JWT_SECRET en las variables de entorno");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export type AuthUser = {
  id: string;
  username: string;
};

export type AuthenticatedRequest = Request & {
  authUser?: AuthUser;
};

export async function createAccessToken(user: AuthUser) {
  return new SignJWT({ username: user.username })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({ error: "No autenticado" });
    return;
  }

  try {
    const { payload } = await jwtVerify(
      authorization.slice(7),
      secret,
    );

    if (!payload.sub || typeof payload.username !== "string") {
      res.status(401).json({ error: "Token inválido" });
      return;
    }

    req.authUser = {
      id: payload.sub,
      username: payload.username,
    };

    next();
  } catch {
    res.status(401).json({ error: "Token inválido o caducado" });
  }
}