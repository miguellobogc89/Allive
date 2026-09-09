// src/auth/components/AuthModeSelector.tsx

import {
  Pressable,
  Text,
} from "react-native";

import {
  authStyles,
} from "../../styles";

export type AuthMode =
  | "login"
  | "register";

type Props = {
  mode: AuthMode;
  compact: boolean;
  onChange: (
    mode: AuthMode,
  ) => void;
};

export function AuthModeSelector({
  mode,
  compact,
  onChange,
}: Props) {
  return (
    <Pressable
      style={[
        authStyles.modeSelector,
        compact &&
          authStyles.modeSelectorCompact,
      ]}
    >
      <Pressable
        onPress={() =>
          onChange("login")
        }
        style={[
          authStyles.modeButton,
          compact &&
            authStyles.modeButtonCompact,
          mode === "login" &&
            authStyles.modeButtonActive,
        ]}
      >
        <Text
          style={[
            authStyles.modeText,
            mode === "login" &&
              authStyles.modeTextActive,
          ]}
        >
          Entrar
        </Text>
      </Pressable>

      <Pressable
        onPress={() =>
          onChange("register")
        }
        style={[
          authStyles.modeButton,
          compact &&
            authStyles.modeButtonCompact,
          mode === "register" &&
            authStyles.modeButtonActive,
        ]}
      >
        <Text
          style={[
            authStyles.modeText,
            mode === "register" &&
              authStyles.modeTextActive,
          ]}
        >
          Registrarme
        </Text>
      </Pressable>
    </Pressable>
  );
}