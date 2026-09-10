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
const USER_KEY = "allive.auth.user";
const MODE_KEY = "allive.auth.mode";
const GUEST_ID_KEY = "allive.guest.id";

type StoredMode =
  | "user"
  | "guest";

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
    remember: boolean,
  ) => Promise<void>;

  register: (
    username: string,
    email: string,
    password: string,
    remember: boolean,
  ) => Promise<void>;

  updateUsername: (
    username: string,
  ) => Promise<void>;

  updateProfile: (input: {
    displayName?: string;
    avatarUrl?: string | null;
  }) => Promise<void>;

  uploadAvatar: (
    image: Blob,
  ) => Promise<AuthUser>;

  continueAsGuest: () => Promise<void>;

  logout: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextValue | null>(
    null,
  );

function createUuid() {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID ===
      "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (character) => {
      const random =
        Math.floor(Math.random() * 16);

      let value = random;

      if (character === "y") {
        value =
          (random & 0x3) | 0x8;
      }

      return value.toString(16);
    },
  );
}

function createGuestId() {
  return `guest_${createUuid()}`;
}

async function clearStoredUserSession() {
  await AsyncStorage.multiRemove([
    TOKEN_KEY,
    USER_KEY,
    MODE_KEY,
  ]);
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
    useState<ViewerIdentity | null>(
      null,
    );

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

  async function restoreGuest() {
    const guestIdentity =
      await getOrCreateGuestIdentity();

    setToken(null);
    setUser(null);
    setIdentity(guestIdentity);
  }

  async function restoreUser() {
    const storedToken =
      await AsyncStorage.getItem(
        TOKEN_KEY,
      );

    const storedUser =
      await AsyncStorage.getItem(
        USER_KEY,
      );

    if (!storedToken) {
      await clearStoredUserSession();

      setToken(null);
      setUser(null);
      setIdentity(null);

      return;
    }

    let cachedUser: AuthUser | null =
      null;

    if (storedUser) {
      try {
        cachedUser =
          JSON.parse(storedUser) as AuthUser;
      } catch {
        cachedUser = null;
      }
    }

    if (cachedUser) {
      setToken(storedToken);
      setUser(cachedUser);

      setIdentity({
        type: "user",
        id: cachedUser.id,
      });
    }

    try {
      const restoredUser =
        await authApi.getMe(
          storedToken,
        );

      setToken(storedToken);
      setUser(restoredUser);

      setIdentity({
        type: "user",
        id: restoredUser.id,
      });

      await AsyncStorage.setItem(
        USER_KEY,
        JSON.stringify(restoredUser),
      );
    } catch (error) {
      if (
        error instanceof
          authApi.AuthApiError &&
        error.status === 401
      ) {
        await clearStoredUserSession();

        setToken(null);
        setUser(null);
        setIdentity(null);

        return;
      }

      if (!cachedUser) {
        setToken(null);
        setUser(null);
        setIdentity(null);
      }
    }
  }

  async function restoreSession() {
    try {
      const storedMode =
        await AsyncStorage.getItem(
          MODE_KEY,
        );

      if (storedMode === "guest") {
        await restoreGuest();
        return;
      }

      if (storedMode === "user") {
        await restoreUser();
        return;
      }

      setToken(null);
      setUser(null);
      setIdentity(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function persistUserSession(
    session: AuthSession,
  ) {
    await AsyncStorage.multiSet([
      [
        TOKEN_KEY,
        session.token,
      ],
      [
        USER_KEY,
        JSON.stringify(
          session.user,
        ),
      ],
      [
        MODE_KEY,
        "user",
      ],
    ]);
  }

  async function clearPersistentSession() {
    await AsyncStorage.multiRemove([
      TOKEN_KEY,
      USER_KEY,
      MODE_KEY,
    ]);
  }

  async function saveSession(
    session: AuthSession,
    remember: boolean,
  ) {
    if (remember) {
      await persistUserSession(
        session,
      );
    } else {
      await clearPersistentSession();
    }

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
    remember: boolean,
  ) {
    const session =
      await authApi.login({
        email: email.trim(),
        password,
      });

    await saveSession(
      session,
      remember,
    );
  }

  async function register(
    username: string,
    email: string,
    password: string,
    remember: boolean,
  ) {
    const session =
      await authApi.register({
        username: username.trim(),
        email: email.trim(),
        password,
      });

    await saveSession(
      session,
      remember,
    );
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

    const storedMode =
      await AsyncStorage.getItem(
        MODE_KEY,
      );

    if (storedMode === "user") {
      await AsyncStorage.setItem(
        USER_KEY,
        JSON.stringify(updatedUser),
      );
    }
  }

  async function persistUpdatedUser(
    updatedUser: AuthUser,
  ) {
    setUser(updatedUser);

    const storedMode =
      await AsyncStorage.getItem(
        MODE_KEY,
      );

    if (storedMode === "user") {
      await AsyncStorage.setItem(
        USER_KEY,
        JSON.stringify(updatedUser),
      );
    }
  }

  async function updateProfile(input: {
    displayName?: string;
    avatarUrl?: string | null;
  }) {
    if (!token) {
      throw new Error(
        "Debes iniciar sesion para actualizar tu perfil",
      );
    }

    const updatedUser =
      await authApi.updateProfile(
        token,
        input,
      );

    await persistUpdatedUser(
      updatedUser,
    );
  }

  async function uploadAvatar(
    image: Blob,
  ) {
    if (!token) {
      throw new Error(
        "Debes iniciar sesion para subir tu foto",
      );
    }

    const updatedUser =
      await authApi.uploadAvatar(
        token,
        image,
      );

    await persistUpdatedUser(
      updatedUser,
    );

    return updatedUser;
  }

  async function continueAsGuest() {
    await clearPersistentSession();

    const guestIdentity =
      await getOrCreateGuestIdentity();

    await AsyncStorage.setItem(
      MODE_KEY,
      "guest",
    );

    setToken(null);
    setUser(null);
    setIdentity(guestIdentity);
  }

  async function logout() {
    await clearPersistentSession();

    setToken(null);
    setUser(null);
    setIdentity(null);
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
        updateProfile,
        uploadAvatar,

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
