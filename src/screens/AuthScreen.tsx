// src/screens/AuthScreen.tsx

import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "../auth/AuthContext";

type Mode = "login" | "register";

export function AuthScreen() {
  const { login, register, continueAsGuest } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit() {
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ha ocurrido un error",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    setError(null);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>ALLIVE</Text>

      <Text style={styles.title}>
        {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
      </Text>

      {mode === "register" && (
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Nombre de usuario"
          autoCapitalize="none"
          style={styles.input}
        />
      )}

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Contraseña"
        secureTextEntry
        style={styles.input}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable
        style={styles.primaryButton}
        onPress={submit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.primaryButtonText}>
            {mode === "login"
              ? "Entrar"
              : "Crear cuenta"}
          </Text>
        )}
      </Pressable>

      <Pressable
        onPress={() =>
          changeMode(mode === "login" ? "register" : "login")
        }
      >
        <Text style={styles.link}>
          {mode === "login"
            ? "¿No tienes cuenta? Regístrate"
            : "¿Ya tienes cuenta? Inicia sesión"}
        </Text>
      </Pressable>

      <Pressable onPress={continueAsGuest}>
        <Text style={styles.guest}>
          Continuar como invitado
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 32,
    backgroundColor: "#ffffff",
  },

  logo: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 40,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
  },

  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
  },

  error: {
    color: "#c62828",
    marginBottom: 12,
  },

  primaryButton: {
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111111",
    borderRadius: 10,
    marginTop: 4,
  },

  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  link: {
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
  },

  guest: {
    textAlign: "center",
    marginTop: 28,
    color: "#666666",
  },
});