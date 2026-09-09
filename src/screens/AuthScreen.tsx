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
import {
  colors,
  controls,
  radius,
  spacing,
  typography,
} from "../styles";

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
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
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
      <View style={styles.form}>
        <Text style={styles.logo}>ALLIVE</Text>

        <Text style={styles.title}>
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </Text>

        {mode === "register" && (
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Nombre de usuario"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            style={styles.input}
          />
        )}

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          style={styles.input}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={styles.primaryButton}
          onPress={() => void submit()}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.pureBlack} />
          ) : (
            <Text style={styles.primaryButtonText}>
              {mode === "login" ? "Entrar" : "Crear cuenta"}
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

        <Pressable onPress={() => void continueAsGuest()}>
          <Text style={styles.guest}>Continuar como invitado</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: spacing.xxl,
  },

  form: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    gap: spacing.sm,
  },

  logo: {
    ...typography.screenTitle,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.xl,
  },

  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.sm,
  },

  input: {
    ...typography.body,
    minHeight: controls.primaryButtonHeight,
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },

  error: {
    ...typography.body,
    color: colors.dangerText,
  },

  primaryButton: {
    height: controls.primaryButtonHeight,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    marginTop: spacing.xs,
  },

  primaryButtonText: {
    ...typography.bodyStrong,
    color: colors.pureBlack,
  },

  link: {
    ...typography.bodyStrong,
    color: colors.text,
    textAlign: "center",
    marginTop: spacing.sm,
  },

  guest: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.sm,
  },
});