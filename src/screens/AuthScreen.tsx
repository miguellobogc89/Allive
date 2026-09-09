// src/screens/AuthScreen.tsx

import { LinearGradient } from "expo-linear-gradient";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";

import {
  useAuth,
} from "../auth/AuthContext";

import {
  AuthBrand,
} from "../auth/components/AuthBrand";

import {
  AuthForm,
} from "../auth/components/AuthForm";

import type {
  AuthMode,
} from "../auth/components/AuthModeSelector";

import {
  authStyles,
  colors,
} from "../styles";

export function AuthScreen() {
  const {
    login,
    register,
    continueAsGuest,
  } = useAuth();

  const {
    width,
    height,
  } = useWindowDimensions();

  const [mode, setMode] =
    useState<AuthMode>("login");

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [remember, setRemember] =
    useState(true);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const entrance =
    useRef(
      new Animated.Value(0),
    ).current;

  const glow =
    useRef(
      new Animated.Value(0),
    ).current;

  const isTablet =
    width >= 768;

  const isLandscape =
    width > height;

  const tabletLandscape =
    isTablet &&
    isLandscape;

  let compact =
    height < 760;

  if (
    isLandscape &&
    height < 600
  ) {
    compact = true;
  }

  useEffect(() => {
    Animated.timing(
      entrance,
      {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      },
    ).start();

    const animation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            glow,
            {
              toValue: 1,
              duration: 2800,
              useNativeDriver: true,
            },
          ),

          Animated.timing(
            glow,
            {
              toValue: 0,
              duration: 2800,
              useNativeDriver: true,
            },
          ),
        ]),
      );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [
    entrance,
    glow,
  ]);

  const translateY =
    entrance.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 0],
    });

  const glowScale =
    glow.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.16],
    });

  const glowOpacity =
    glow.interpolate({
      inputRange: [0, 1],
      outputRange: [
        0.18,
        0.38,
      ],
    });

  function validate() {
    if (!email.trim()) {
      return "Introduce tu email";
    }

    if (!password) {
      return "Introduce tu contraseña";
    }

    if (
      mode === "register" &&
      !username.trim()
    ) {
      return "Introduce un nombre de usuario";
    }

    if (
      mode === "register" &&
      password.length < 8
    ) {
      return "La contraseña debe tener al menos 8 caracteres";
    }

    return null;
  }

  async function submit() {
    const validationError =
      validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login(
          email,
          password,
          remember,
        );

        return;
      }

      await register(
        username,
        email,
        password,
        remember,
      );
    } catch (submitError) {
      if (
        submitError instanceof Error
      ) {
        setError(
          submitError.message,
        );

        return;
      }

      setError(
        "No se ha podido completar el acceso",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function enterAsGuest() {
    setError(null);
    setIsSubmitting(true);

    try {
      await continueAsGuest();
    } catch {
      setError(
        "No se ha podido iniciar como invitado",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function changeMode(
    nextMode: AuthMode,
  ) {
    setMode(nextMode);
    setError(null);
  }

  let keyboardBehavior:
    "padding" | undefined;

  if (Platform.OS === "ios") {
    keyboardBehavior =
      "padding";
  }

  return (
    <KeyboardAvoidingView
      style={authStyles.root}
      behavior={keyboardBehavior}
    >
      <LinearGradient
        colors={[
          colors.background,
          "#111011",
          colors.background,
        ]}
        style={
          authStyles.background
        }
      >
        <Animated.View
          pointerEvents="none"
          style={[
            authStyles.glow,
            {
              opacity:
                glowOpacity,

              transform: [
                {
                  scale:
                    glowScale,
                },
              ],
            },
          ]}
        />

        <ScrollView
          style={authStyles.scroll}
          contentContainerStyle={
            authStyles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
          bounces={false}
        >
          <Animated.View
            style={[
              authStyles.layout,

              compact &&
                authStyles.layoutCompact,

              tabletLandscape &&
                authStyles.layoutTabletLandscape,

              {
                opacity:
                  entrance,

                transform: [
                  {
                    translateY,
                  },
                ],
              },
            ]}
          >
            <View
              style={[
                authStyles.brandColumn,

                tabletLandscape &&
                  authStyles.brandColumnTablet,
              ]}
            >
              <AuthBrand
                compact={
                  compact &&
                  !tabletLandscape
                }
                horizontal={
                  tabletLandscape
                }
              />
            </View>

            <View
              style={[
                authStyles.formColumn,

                tabletLandscape &&
                  authStyles.formColumnTablet,
              ]}
            >
              <AuthForm
                mode={mode}
                compact={compact}

                username={
                  username
                }

                email={email}
                password={
                  password
                }

                remember={
                  remember
                }

                showPassword={
                  showPassword
                }

                error={error}

                isSubmitting={
                  isSubmitting
                }

                onModeChange={
                  changeMode
                }

                onUsernameChange={
                  setUsername
                }

                onEmailChange={
                  setEmail
                }

                onPasswordChange={
                  setPassword
                }

                onRememberChange={() =>
                  setRemember(
                    !remember,
                  )
                }

                onTogglePassword={() =>
                  setShowPassword(
                    !showPassword,
                  )
                }

                onSubmit={() =>
                  void submit()
                }

                onGuest={() =>
                  void enterAsGuest()
                }
              />
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}