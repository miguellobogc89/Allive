// server/routes/auth.ts

import bcrypt from "bcryptjs";
import type { Express } from "express";

import { prisma } from "../db";
import {
  createAccessToken,
  requireAuth,
  type AuthenticatedRequest,
} from "../auth";

function publicUser(user: {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
}) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
  };
}

export function registerAuthRoutes(app: Express) {
  app.post("/api/auth/register", async (req, res) => {
    const username = String(req.body.username ?? "")
      .trim()
      .toLowerCase();

    const email = String(req.body.email ?? "")
      .trim()
      .toLowerCase();

    const password = String(req.body.password ?? "");

    if (username.length < 3) {
      res.status(400).json({
        error: "El nombre de usuario debe tener al menos 3 caracteres",
      });
      return;
    }

    if (!email.includes("@")) {
      res.status(400).json({ error: "Email no válido" });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({
        error: "La contraseña debe tener al menos 8 caracteres",
      });
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      res.status(409).json({
        error:
          existingUser.email === email
            ? "Ya existe una cuenta con ese email"
            : "Ese nombre de usuario ya está en uso",
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password_hash: passwordHash,
      },
    });

    const token = await createAccessToken({
      id: user.id,
      username: user.username,
    });

    res.status(201).json({
      token,
      user: publicUser(user),
    });
  });

  app.post("/api/auth/login", async (req, res) => {
    const email = String(req.body.email ?? "")
      .trim()
      .toLowerCase();

    const password = String(req.body.password ?? "");

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({
        error: "Email o contraseña incorrectos",
      });
      return;
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash,
    );

    if (!passwordMatches) {
      res.status(401).json({
        error: "Email o contraseña incorrectos",
      });
      return;
    }

    const token = await createAccessToken({
      id: user.id,
      username: user.username,
    });

    res.json({
      token,
      user: publicUser(user),
    });
  });

  app.get(
    "/api/auth/me",
    requireAuth,
    async (req: AuthenticatedRequest, res) => {
      const userId = req.authUser!.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        res.status(401).json({ error: "Usuario no encontrado" });
        return;
      }

      res.json({
        user: publicUser(user),
      });
    },
  );
}