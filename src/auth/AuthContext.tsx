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
import type { AuthSession, AuthUser } from "./types";

const TOKEN_KEY = "allive.auth.token";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);

      if (!storedToken) {
        return;
      }

      const restoredUser = await authApi.getMe(storedToken);

      setToken(storedToken);
      setUser(restoredUser);
    } catch {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveSession(session: AuthSession) {
    await AsyncStorage.setItem(TOKEN_KEY, session.token);

    setToken(session.token);
    setUser(session.user);
    setIsGuest(false);
  }

  async function login(email: string, password: string) {
    const session = await authApi.login({ email, password });
    await saveSession(session);
  }

  async function register(
    username: string,
    email: string,
    password: string,
  ) {
    const session = await authApi.register({
      username,
      email,
      password,
    });

    await saveSession(session);
  }

  function continueAsGuest() {
    setUser(null);
    setToken(null);
    setIsGuest(true);
  }

  async function logout() {
    await AsyncStorage.removeItem(TOKEN_KEY);

    setUser(null);
    setToken(null);
    setIsGuest(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isGuest,
        login,
        register,
        continueAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}