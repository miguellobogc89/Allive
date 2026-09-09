// src/auth/AuthContext.tsx

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import * as authApi from "./authApi";
import type {
  AuthSession,
  AuthUser,
  GuestIdentity,
  ViewerIdentity,
} from "./types";

const TOKEN_KEY = "allive.auth.token";
const GUEST_ID_KEY = "allive.guest.id";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  identity: ViewerIdentity | null;

  isLoading: boolean;
  isGuest: boolean;
  isAuthenticated: boolean;

  login: (
    email: string,
    password: string,
  ) => Promise<void>;

  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;

  updateUsername: (
    username: string,
  ) => Promise<void>;

  continueAsGuest: () => Promise<void>;

  logout: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextValue | null>(null);

function createUuid() {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (character) => {
      const random = Math.floor(Math.random() * 16);
      const value =
        character === "x"
          ? random
          : (random & 0x3) | 0x8;

      return value.toString(16);
    },
  );
}

function createGuestId() {
  return `guest_${createUuid()}`;
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [identity, setIdentity] =
    useState<ViewerIdentity | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const isGuest =
    identity?.type === "guest";

  const isAuthenticated =
    identity?.type === "user";

  useEffect(() => {
    void restoreSession();
  }, []);

  async function getOrCreateGuestIdentity():
    Promise<GuestIdentity> {
    const storedGuestId =
      await AsyncStorage.getItem(
        GUEST_ID_KEY,
      );

    if (storedGuestId) {
      return {
        type: "guest",
        id: storedGuestId,
      };
    }

    const guestId = createGuestId();

    await AsyncStorage.setItem(
      GUEST_ID_KEY,
      guestId,
    );

    return {
      type: "guest",
      id: guestId,
    };
  }

  async function restoreSession() {
    try {
      const storedToken =
        await AsyncStorage.getItem(
          TOKEN_KEY,
        );

      if (!storedToken) {
        return;
      }

      const restoredUser =
        await authApi.getMe(storedToken);

      setToken(storedToken);
      setUser(restoredUser);

      setIdentity({
        type: "user",
        id: restoredUser.id,
      });
    } catch {
      await AsyncStorage.removeItem(
        TOKEN_KEY,
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function saveSession(
    session: AuthSession,
  ) {
    await AsyncStorage.setItem(
      TOKEN_KEY,
      session.token,
    );

    setToken(session.token);
    setUser(session.user);

    setIdentity({
      type: "user",
      id: session.user.id,
    });
  }

  async function login(
    email: string,
    password: string,
  ) {
    const session =
      await authApi.login({
        email,
        password,
      });

    await saveSession(session);
  }

  async function register(
    username: string,
    email: string,
    password: string,
  ) {
    const session =
      await authApi.register({
        username,
        email,
        password,
      });

    await saveSession(session);
  }

  async function updateUsername(
    username: string,
  ) {
    if (!token) {
      throw new Error(
        "Debes iniciar sesión para cambiar tu nombre de usuario",
      );
    }

    const updatedUser =
      await authApi.updateMe(
        token,
        {
          username,
        },
      );

    setUser(updatedUser);
  }

  async function continueAsGuest() {
    await AsyncStorage.removeItem(
      TOKEN_KEY,
    );

    const guestIdentity =
      await getOrCreateGuestIdentity();

    setToken(null);
    setUser(null);
    setIdentity(guestIdentity);
  }

  async function logout() {
    await AsyncStorage.removeItem(
      TOKEN_KEY,
    );

    setToken(null);
    setUser(null);
    setIdentity(null);

    // La identidad guest de esta instalación
    // se conserva deliberadamente.
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        identity,

        isLoading,
        isGuest,
        isAuthenticated,

        login,
        register,
        updateUsername,

        continueAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe usarse dentro de AuthProvider",
    );
  }

  return context;
}