// src/components/search/SearchState.tsx

import {
  ActivityIndicator,
  Text,
  View,
} from "react-native";

import {
  searchScreenStyles as styles,
} from "./searchScreen.styles";

type Props = {
  loading: boolean;
  error: string | null;
};

export function SearchState({
  loading,
  error,
}: Props) {
  if (loading) {
    return (
      <View style={styles.state}>
        <ActivityIndicator
          color="#FF6B5F"
        />

        <Text style={styles.stateText}>
          Buscando…
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.state}>
        <Text style={styles.stateTitle}>
          No se pudo cargar
        </Text>

        <Text style={styles.stateText}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.state}>
      <Text style={styles.stateTitle}>
        Sin resultados
      </Text>

      <Text style={styles.stateText}>
        Prueba con otra búsqueda.
      </Text>
    </View>
  );
}