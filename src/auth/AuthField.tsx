// src/auth/components/AuthField.tsx

import {
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  authStyles,
  colors,
} from "../styles";

type Props = {
  label: string;
  value: string;
  placeholder: string;

  compact: boolean;

  password?: boolean;
  showPassword?: boolean;

  keyboardType?:
    | "default"
    | "email-address";

  onChangeText: (
    value: string,
  ) => void;

  onTogglePassword?: () => void;
};

export function AuthField({
  label,
  value,
  placeholder,
  compact,
  password = false,
  showPassword = false,
  keyboardType = "default",
  onChangeText,
  onTogglePassword,
}: Props) {
  if (password) {
    return (
      <View style={authStyles.field}>
        <Text style={authStyles.label}>
          {label}
        </Text>

        <View
          style={[
            authStyles.passwordField,
            compact &&
              authStyles.passwordFieldCompact,
          ]}
        >
          <TextInput
            value={value}
            onChangeText={
              onChangeText
            }
            placeholder={
              placeholder
            }
            placeholderTextColor={
              colors.textMuted
            }
            secureTextEntry={
              !showPassword
            }
            autoCapitalize="none"
            autoCorrect={false}
            style={[
              authStyles.passwordInput,
              compact &&
                authStyles.passwordInputCompact,
            ]}
          />

          <Pressable
            onPress={
              onTogglePassword
            }
            hitSlop={12}
          >
            <Text
              style={
                authStyles.passwordAction
              }
            >
              {showPassword
                ? "Ocultar"
                : "Ver"}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={authStyles.field}>
      <Text style={authStyles.label}>
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={
          colors.textMuted
        }
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
        style={[
          authStyles.input,
          compact &&
            authStyles.inputCompact,
        ]}
      />
    </View>
  );
}