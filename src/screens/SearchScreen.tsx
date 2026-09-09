// src/screens/SearchScreen.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors } from "../theme/colors";

const trendingSearches = [
  {
    id: "1",
    icon: "location-outline",
    title: "Puerta del Sol",
    subtitle: "Madrid",
    liveCount: 18,
  },
  {
    id: "2",
    icon: "football-outline",
    title: "Real Madrid",
    subtitle: "Partido y alrededores",
    liveCount: 42,
  },
  {
    id: "3",
    icon: "musical-notes-outline",
    title: "Festival de Málaga",
    subtitle: "Málaga",
    liveCount: 27,
  },
];

export function SearchScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Buscar</Text>

        <Text style={styles.subtitle}>
          Mira qué está pasando ahora.
        </Text>

        <View style={styles.searchBox}>
          <Ionicons
            name="search"
            size={20}
            color="rgba(255,255,255,0.55)"
          />

          <TextInput
            style={styles.input}
            placeholder="Lugar, evento o qué quieres ver..."
            placeholderTextColor="rgba(255,255,255,0.38)"
            selectionColor={colors.text}
          />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            EN DIRECTO AHORA
          </Text>

          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveIndicatorText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.results}>
          {trendingSearches.map((item) => (
            <Pressable
              key={item.id}
              style={styles.result}
            >
              <View style={styles.resultIcon}>
                <Ionicons
                  name={item.icon as any}
                  size={21}
                  color={colors.text}
                />
              </View>

              <View style={styles.resultInfo}>
                <Text style={styles.resultTitle}>
                  {item.title}
                </Text>

                <Text style={styles.resultSubtitle}>
                  {item.subtitle}
                </Text>
              </View>

              <View style={styles.liveCount}>
                <View style={styles.smallLiveDot} />

                <Text style={styles.liveCountText}>
                  {item.liveCount}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color="rgba(255,255,255,0.28)"
              />
            </Pressable>
          ))}
        </View>

        <View style={styles.idea}>
          <Ionicons
            name="radio-outline"
            size={21}
            color="rgba(255,255,255,0.62)"
          />

          <View style={styles.ideaText}>
            <Text style={styles.ideaTitle}>
              ¿No encuentras lo que buscas?
            </Text>

            <Text style={styles.ideaDescription}>
              Búscalo igualmente. Si hay gente cerca, Allive podrá detectar
              que alguien quiere verlo.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingHorizontal: 20,

    backgroundColor: colors.background,
  },

  header: {
    paddingTop: 24,
  },

  title: {
    color: colors.text,

    fontSize: 28,
    fontWeight: "900",
  },

  subtitle: {
    marginTop: 4,

    color: colors.textSecondary,

    fontSize: 14,
  },

  searchBox: {
    height: 52,

    marginTop: 20,

    flexDirection: "row",
    alignItems: "center",

    gap: 10,

    paddingHorizontal: 15,

    borderRadius: 16,

    backgroundColor: colors.surfaceElevated,

    borderWidth: 1,
    borderColor: colors.border,
  },

  input: {
    flex: 1,

    color: colors.text,

    fontSize: 15,

    outlineStyle: "none",
  } as any,

  content: {
    marginTop: 30,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 10,
  },

  sectionTitle: {
    color: colors.textMuted,

    fontSize: 11,
    fontWeight: "800",

    letterSpacing: 1.2,
  },

  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",

    gap: 5,
  },

  liveDot: {
    width: 6,
    height: 6,

    borderRadius: 3,

    backgroundColor: colors.live,
  },

  liveIndicatorText: {
    color: colors.live,

    fontSize: 10,
    fontWeight: "900",
  },

  results: {
    gap: 4,
  },

  result: {
    minHeight: 68,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 10,

    borderRadius: 14,
  },

  resultIcon: {
    width: 42,
    height: 42,

    borderRadius: 13,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.surfaceElevated,
  },

  resultInfo: {
    flex: 1,

    marginLeft: 12,
  },

  resultTitle: {
    color: colors.text,

    fontSize: 15,
    fontWeight: "800",
  },

  resultSubtitle: {
    marginTop: 3,

    color: colors.textSecondary,

    fontSize: 11,
  },

  liveCount: {
    flexDirection: "row",
    alignItems: "center",

    gap: 5,

    marginRight: 10,

    paddingHorizontal: 9,
    paddingVertical: 6,

    borderRadius: 9,

    backgroundColor: "rgba(255,59,48,0.12)",
  },

  smallLiveDot: {
    width: 6,
    height: 6,

    borderRadius: 3,

    backgroundColor: colors.live,
  },

  liveCountText: {
    color: colors.text,

    fontSize: 11,
    fontWeight: "800",
  },

  idea: {
    marginTop: 32,

    flexDirection: "row",

    gap: 12,

    padding: 16,

    borderRadius: 16,

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,
  },

  ideaText: {
    flex: 1,
  },

  ideaTitle: {
    color: colors.text,

    fontSize: 13,
    fontWeight: "800",
  },

  ideaDescription: {
    marginTop: 5,

    color: colors.textSecondary,

    fontSize: 11,
    lineHeight: 16,
  },
});