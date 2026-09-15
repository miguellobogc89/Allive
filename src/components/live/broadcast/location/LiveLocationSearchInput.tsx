// src/components/live/broadcast/location/LiveLocationSearchInput.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

type Props = {
  value: string;
  onChangeText: (
    value: string,
  ) => void;
};

export function LiveLocationSearchInput({
  value,
  onChangeText,
}: Props) {
  const hasValue =
    value.length > 0;

  return (
    <View style={styles.container}>
      <Ionicons
        name="search-outline"
        size={17}
        color="rgba(255,255,255,0.50)"
      />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Buscar bar, parque, estadio..."
        placeholderTextColor="rgba(255,255,255,0.38)"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />

      {hasValue && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Borrar búsqueda"
          hitSlop={8}
          onPress={() => {
            onChangeText("");
          }}
        >
          <Ionicons
            name="close-circle"
            size={17}
            color="rgba(255,255,255,0.42)"
          />
        </Pressable>
      )}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      height: 42,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor:
        "rgba(255,255,255,0.14)",
      borderRadius: 12,
      backgroundColor:
        "rgba(255,255,255,0.055)",
    },

    input: {
      flex: 1,
      height: "100%",
      padding: 0,
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "400",
      outlineWidth: 0,
    },
  });