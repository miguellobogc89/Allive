// src/auth/components/AuthForm.tsx

import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";

import {
  authStyles,
  colors,
} from "../../styles";

import {
  AuthField,
} from "../AuthField";

import {
  AuthModeSelector,
  type AuthMode,
} from "./AuthModeSelector";

type Props = {
  mode: AuthMode;
  compact: boolean;

  username: string;
  email: string;
  password: string;

  remember: boolean;
  showPassword: boolean;

  error: string | null;
  isSubmitting: boolean;

  onModeChange: (
    mode: AuthMode,
  ) => void;

  onUsernameChange: (
    value: string,
  ) => void;

  onEmailChange: (
    value: string,
  ) => void;

  onPasswordChange: (
    value: string,
  ) => void;

  onRememberChange: () => void;
  onTogglePassword: () => void;

  onSubmit: () => void;
  onGuest: () => void;
};

export function AuthForm({
  mode,
  compact,

  username,
  email,
  password,

  remember,
  showPassword,

  error,
  isSubmitting,

  onModeChange,
  onUsernameChange,
  onEmailChange,
  onPasswordChange,
  onRememberChange,
  onTogglePassword,
  onSubmit,
  onGuest,
}: Props) {
  let title =
    "Bienvenido de nuevo";

  let subtitle =
    "Entra y descubre qué está pasando ahora mismo.";

  let submitLabel =
    "Entrar";

  if (mode === "register") {
    title = "Crea tu cuenta";

    subtitle =
      "Únete a Allive y empieza a vivir lo que está pasando.";

    submitLabel =
      "Crear cuenta";
  }

  return (
    <View
      style={[
        authStyles.card,
        compact &&
          authStyles.cardCompact,
      ]}
    >
      <View
        style={[
          authStyles.heading,
          compact &&
            authStyles.headingCompact,
        ]}
      >
        <Text
          style={[
            authStyles.title,
            compact &&
              authStyles.titleCompact,
          ]}
        >
          {title}
        </Text>

        {!compact && (
          <Text
            style={
              authStyles.subtitle
            }
          >
            {subtitle}
          </Text>
        )}
      </View>

      <AuthModeSelector
        mode={mode}
        compact={compact}
        onChange={onModeChange}
      />

      <View
        style={[
          authStyles.fields,
          compact &&
            authStyles.fieldsCompact,
        ]}
      >
        {mode === "register" && (
          <AuthField
            label="Usuario"
            value={username}
            placeholder="Tu nombre en Allive"
            compact={compact}
            onChangeText={
              onUsernameChange
            }
          />
        )}

        <AuthField
          label="Email"
          value={email}
          placeholder="nombre@email.com"
          compact={compact}
          keyboardType="email-address"
          onChangeText={
            onEmailChange
          }
        />

        <AuthField
          label="Contraseña"
          value={password}
          placeholder="Tu contraseña"
          compact={compact}
          password
          showPassword={
            showPassword
          }
          onChangeText={
            onPasswordChange
          }
          onTogglePassword={
            onTogglePassword
          }
        />
      </View>

      <Pressable
        onPress={
          onRememberChange
        }
        style={[
          authStyles.rememberRow,
          compact &&
            authStyles.rememberRowCompact,
        ]}
      >
        <View
          style={[
            authStyles.checkbox,
            remember &&
              authStyles.checkboxActive,
          ]}
        >
          {remember && (
            <View
              style={
                authStyles.checkboxDot
              }
            />
          )}
        </View>

        <Text
          style={
            authStyles.rememberText
          }
        >
          Recordarme
        </Text>
      </Pressable>

      {error && (
        <View
          style={
            authStyles.errorBox
          }
        >
          <Text
            style={
              authStyles.error
            }
          >
            {error}
          </Text>
        </View>
      )}

      <Pressable
        onPress={onSubmit}
        disabled={isSubmitting}
        style={({ pressed }) => [
          authStyles.primaryButton,

          compact &&
            authStyles.primaryButtonCompact,

          pressed &&
            authStyles.primaryButtonPressed,

          isSubmitting &&
            authStyles.disabled,
        ]}
      >
        <LinearGradient
          colors={[
            colors.accent,
            colors.accentStrong,
          ]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={[
            authStyles.primaryGradient,
            compact &&
              authStyles.primaryGradientCompact,
          ]}
        >
          {isSubmitting && (
            <ActivityIndicator
              color={colors.text}
            />
          )}

          {!isSubmitting && (
            <Text
              style={
                authStyles.primaryButtonText
              }
            >
              {submitLabel}
            </Text>
          )}
        </LinearGradient>
      </Pressable>

      <View
        style={[
          authStyles.divider,
          compact &&
            authStyles.dividerCompact,
        ]}
      >
        <View
          style={
            authStyles.dividerLine
          }
        />

        <Text
          style={
            authStyles.dividerText
          }
        >
          O
        </Text>

        <View
          style={
            authStyles.dividerLine
          }
        />
      </View>

      <Pressable
        onPress={onGuest}
        disabled={isSubmitting}
        style={({ pressed }) => [
          authStyles.guestButton,

          compact &&
            authStyles.guestButtonCompact,

          pressed &&
            authStyles.guestButtonPressed,
        ]}
      >
        <Text
          style={
            authStyles.guestButtonText
          }
        >
          Continuar como invitado
        </Text>

        <Text
          style={
            authStyles.guestArrow
          }
        >
          →
        </Text>
      </Pressable>

      {!compact && (
        <Text
          style={
            authStyles.footer
          }
        >
          Al continuar aceptas las
          condiciones de uso y la
          política de privacidad.
        </Text>
      )}
    </View>
  );
}