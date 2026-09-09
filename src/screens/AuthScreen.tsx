// src/screens/AuthScreen.tsx

import { LinearGradient } from "expo-linear-gradient";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  useAuth,
} from "../auth/AuthContext";

import {
  colors,
  controls,
  radius,
  spacing,
  typography,
} from "../styles";

type Mode =
  | "login"
  | "register";

export function AuthScreen() {
  const {
    login,
    register,
    continueAsGuest,
  } = useAuth();

  const [mode, setMode] =
    useState<Mode>("login");

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [remember, setRemember] =
    useState(true);

  const [showPassword, setShowPassword] =
    useState(false);

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

  useEffect(() => {
    Animated.timing(
      entrance,
      {
        toValue: 1,
        duration: 550,
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
              duration: 2600,
              useNativeDriver: true,
            },
          ),
          Animated.timing(
            glow,
            {
              toValue: 0,
              duration: 2600,
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

  const cardTranslate =
    entrance.interpolate({
      inputRange: [0, 1],
      outputRange: [24, 0],
    });

  const glowScale =
    glow.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.18],
    });

  const glowOpacity =
    glow.interpolate({
      inputRange: [0, 1],
      outputRange: [0.22, 0.42],
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
      } else {
        setError(
          "No se ha podido completar el acceso",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function changeMode(
    nextMode: Mode,
  ) {
    setMode(nextMode);
    setError(null);
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

  let title =
    "Bienvenido de nuevo";

  let subtitle =
    "Entra y descubre qué está pasando ahora mismo.";

  let submitLabel =
    "Entrar";

  if (mode === "register") {
    title =
      "Crea tu cuenta";

    subtitle =
      "Únete a Allive y empieza a vivir lo que está pasando.";

    submitLabel =
      "Crear cuenta";
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <LinearGradient
        colors={[
          colors.background,
          "#111011",
          colors.background,
        ]}
        style={styles.background}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glow,
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
          contentContainerStyle={
            styles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity:
                  entrance,
                transform: [
                  {
                    translateY:
                      cardTranslate,
                  },
                ],
              },
            ]}
          >
            <View
              style={
                styles.brandArea
              }
            >
              <View
                style={
                  styles.logoMark
                }
              >
                <View
                  style={
                    styles.logoCore
                  }
                />
              </View>

              <Text
                style={
                  styles.logo
                }
              >
                ALLIVE
              </Text>

              <Text
                style={
                  styles.brandClaim
                }
              >
                LIVE. NOW. EVERYWHERE.
              </Text>
            </View>

            <View
              style={
                styles.card
              }
            >
              <View
                style={
                  styles.heading
                }
              >
                <Text
                  style={
                    styles.title
                  }
                >
                  {title}
                </Text>

                <Text
                  style={
                    styles.subtitle
                  }
                >
                  {subtitle}
                </Text>
              </View>

              <View
                style={
                  styles.modeSelector
                }
              >
                <Pressable
                  onPress={() =>
                    changeMode(
                      "login",
                    )
                  }
                  style={[
                    styles.modeButton,
                    mode === "login" &&
                      styles.modeButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.modeText,
                      mode === "login" &&
                        styles.modeTextActive,
                    ]}
                  >
                    Entrar
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    changeMode(
                      "register",
                    )
                  }
                  style={[
                    styles.modeButton,
                    mode ===
                      "register" &&
                      styles.modeButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.modeText,
                      mode ===
                        "register" &&
                        styles.modeTextActive,
                    ]}
                  >
                    Registrarme
                  </Text>
                </Pressable>
              </View>

              <View
                style={
                  styles.fields
                }
              >
                {mode ===
                  "register" && (
                  <View>
                    <Text
                      style={
                        styles.label
                      }
                    >
                      Usuario
                    </Text>

                    <TextInput
                      value={
                        username
                      }
                      onChangeText={
                        setUsername
                      }
                      placeholder="Tu nombre en Allive"
                      placeholderTextColor={
                        colors.textMuted
                      }
                      autoCapitalize="none"
                      autoCorrect={
                        false
                      }
                      style={
                        styles.input
                      }
                    />
                  </View>
                )}

                <View>
                  <Text
                    style={
                      styles.label
                    }
                  >
                    Email
                  </Text>

                  <TextInput
                    value={
                      email
                    }
                    onChangeText={
                      setEmail
                    }
                    placeholder="nombre@email.com"
                    placeholderTextColor={
                      colors.textMuted
                    }
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={
                      false
                    }
                    style={
                      styles.input
                    }
                  />
                </View>

                <View>
                  <Text
                    style={
                      styles.label
                    }
                  >
                    Contraseña
                  </Text>

                  <View
                    style={
                      styles.passwordField
                    }
                  >
                    <TextInput
                      value={
                        password
                      }
                      onChangeText={
                        setPassword
                      }
                      placeholder="Tu contraseña"
                      placeholderTextColor={
                        colors.textMuted
                      }
                      secureTextEntry={
                        !showPassword
                      }
                      autoCapitalize="none"
                      style={
                        styles.passwordInput
                      }
                    />

                    <Pressable
                      onPress={() =>
                        setShowPassword(
                          !showPassword,
                        )
                      }
                      hitSlop={12}
                    >
                      <Text
                        style={
                          styles.passwordAction
                        }
                      >
                        {showPassword
                          ? "Ocultar"
                          : "Ver"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              <Pressable
                onPress={() =>
                  setRemember(
                    !remember,
                  )
                }
                style={
                  styles.rememberRow
                }
              >
                <View
                  style={[
                    styles.checkbox,
                    remember &&
                      styles.checkboxActive,
                  ]}
                >
                  {remember && (
                    <View
                      style={
                        styles.checkboxDot
                      }
                    />
                  )}
                </View>

                <Text
                  style={
                    styles.rememberText
                  }
                >
                  Recordarme
                </Text>
              </Pressable>

              {error && (
                <View
                  style={
                    styles.errorBox
                  }
                >
                  <Text
                    style={
                      styles.error
                    }
                  >
                    {error}
                  </Text>
                </View>
              )}

              <Pressable
                onPress={() =>
                  void submit()
                }
                disabled={
                  isSubmitting
                }
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed &&
                    styles.primaryButtonPressed,
                  isSubmitting &&
                    styles.disabled,
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
                  style={
                    styles.primaryGradient
                  }
                >
                  {isSubmitting && (
                    <ActivityIndicator
                      color={
                        colors.text
                      }
                    />
                  )}

                  {!isSubmitting && (
                    <Text
                      style={
                        styles.primaryButtonText
                      }
                    >
                      {submitLabel}
                    </Text>
                  )}
                </LinearGradient>
              </Pressable>

              <View
                style={
                  styles.divider
                }
              >
                <View
                  style={
                    styles.dividerLine
                  }
                />

                <Text
                  style={
                    styles.dividerText
                  }
                >
                  O
                </Text>

                <View
                  style={
                    styles.dividerLine
                  }
                />
              </View>

              <Pressable
                onPress={() =>
                  void enterAsGuest()
                }
                disabled={
                  isSubmitting
                }
                style={({ pressed }) => [
                  styles.guestButton,
                  pressed &&
                    styles.guestButtonPressed,
                ]}
              >
                <Text
                  style={
                    styles.guestButtonText
                  }
                >
                  Continuar como invitado
                </Text>

                <Text
                  style={
                    styles.guestArrow
                  }
                >
                  →
                </Text>
              </Pressable>

              <Text
                style={
                  styles.footer
                }
              >
                Al continuar aceptas las
                condiciones de uso y la
                política de privacidad.
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles =
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor:
        colors.background,
    },

    background: {
      flex: 1,
      overflow: "hidden",
    },

    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal:
        spacing.xl,
      paddingVertical: 48,
    },

    content: {
      width: "100%",
      maxWidth: 460,
      alignSelf: "center",
    },

    glow: {
      position: "absolute",
      width: 380,
      height: 380,
      borderRadius: 190,
      backgroundColor:
        colors.accentGlow,
      top: -160,
      alignSelf: "center",
    },

    brandArea: {
      alignItems: "center",
      marginBottom:
        spacing.xxl,
    },

    logoMark: {
      width: 54,
      height: 54,
      borderRadius: 27,
      backgroundColor:
        colors.accentSoft,
      alignItems: "center",
      justifyContent:
        "center",
      marginBottom:
        spacing.md,
      borderWidth: 1,
      borderColor:
        colors.accent,
    },

    logoCore: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor:
        colors.accent,
    },

    logo: {
      fontSize: 28,
      lineHeight: 32,
      fontWeight: "800",
      letterSpacing: 5,
      color: colors.text,
    },

    brandClaim: {
      marginTop:
        spacing.xs,
      fontSize: 10,
      letterSpacing: 2.2,
      fontWeight: "600",
      color:
        colors.textMuted,
    },

    card: {
      backgroundColor:
        "rgba(18,20,22,0.94)",
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius:
        radius.xl,
      padding:
        spacing.xl,
      shadowColor:
        colors.pureBlack,
      shadowOffset: {
        width: 0,
        height: 20,
      },
      shadowOpacity: 0.32,
      shadowRadius: 36,
      elevation: 16,
    },

    heading: {
      marginBottom:
        spacing.xl,
    },

    title: {
      ...typography.title,
      color: colors.text,
      fontSize: 26,
      lineHeight: 32,
    },

    subtitle: {
      ...typography.body,
      color:
        colors.textSecondary,
      marginTop:
        spacing.xs,
      lineHeight: 21,
    },

    modeSelector: {
      flexDirection: "row",
      padding: 4,
      borderRadius:
        radius.md,
      backgroundColor:
        colors.background,
      marginBottom:
        spacing.xl,
    },

    modeButton: {
      flex: 1,
      minHeight: 40,
      borderRadius:
        radius.sm,
      alignItems: "center",
      justifyContent:
        "center",
    },

    modeButtonActive: {
      backgroundColor:
        colors.surfaceElevated,
    },

    modeText: {
      ...typography.bodyStrong,
      color:
        colors.textMuted,
    },

    modeTextActive: {
      color: colors.text,
    },

    fields: {
      gap: spacing.md,
    },

    label: {
      ...typography.bodyStrong,
      color:
        colors.textSecondary,
      marginBottom:
        spacing.xs,
      fontSize: 13,
    },

    input: {
      ...typography.body,
      minHeight:
        controls.primaryButtonHeight,
      color: colors.text,
      backgroundColor:
        colors.background,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius:
        radius.md,
      paddingHorizontal:
        spacing.md,
    },

    passwordField: {
      minHeight:
        controls.primaryButtonHeight,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor:
        colors.background,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius:
        radius.md,
      paddingRight:
        spacing.md,
    },

    passwordInput: {
      ...typography.body,
      flex: 1,
      minHeight:
        controls.primaryButtonHeight,
      color: colors.text,
      paddingHorizontal:
        spacing.md,
    },

    passwordAction: {
      ...typography.bodyStrong,
      color:
        colors.accent,
      fontSize: 13,
    },

    rememberRow: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf:
        "flex-start",
      marginTop:
        spacing.md,
    },

    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 6,
      borderWidth: 1,
      borderColor:
        colors.border,
      backgroundColor:
        colors.background,
      alignItems: "center",
      justifyContent:
        "center",
      marginRight:
        spacing.xs,
    },

    checkboxActive: {
      borderColor:
        colors.accent,
      backgroundColor:
        colors.accentSoft,
    },

    checkboxDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor:
        colors.accent,
    },

    rememberText: {
      ...typography.body,
      color:
        colors.textSecondary,
      fontSize: 13,
    },

    errorBox: {
      marginTop:
        spacing.md,
      padding:
        spacing.sm,
      borderRadius:
        radius.sm,
      backgroundColor:
        colors.dangerSurface,
    },

    error: {
      ...typography.body,
      color:
        colors.dangerText,
      fontSize: 13,
    },

    primaryButton: {
      marginTop:
        spacing.lg,
      borderRadius:
        radius.md,
      overflow: "hidden",
    },

    primaryButtonPressed: {
      opacity: 0.88,
      transform: [
        {
          scale: 0.99,
        },
      ],
    },

    disabled: {
      opacity: 0.65,
    },

    primaryGradient: {
      height:
        controls.primaryButtonHeight,
      alignItems: "center",
      justifyContent:
        "center",
      borderRadius:
        radius.md,
    },

    primaryButtonText: {
      ...typography.bodyStrong,
      color: colors.text,
      fontSize: 15,
    },

    divider: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginVertical:
        spacing.lg,
    },

    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor:
        colors.border,
    },

    dividerText: {
      color:
        colors.textMuted,
      fontSize: 11,
      fontWeight: "700",
    },

    guestButton: {
      minHeight:
        controls.primaryButtonHeight,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        colors.background,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius:
        radius.md,
      paddingHorizontal:
        spacing.md,
    },

    guestButtonPressed: {
      backgroundColor:
        colors.surfaceElevated,
    },

    guestButtonText: {
      ...typography.bodyStrong,
      color: colors.text,
    },

    guestArrow: {
      position: "absolute",
      right: spacing.md,
      color:
        colors.accent,
      fontSize: 20,
    },

    footer: {
      ...typography.body,
      color:
        colors.textMuted,
      textAlign: "center",
      fontSize: 11,
      lineHeight: 16,
      marginTop:
        spacing.lg,
    },
  });