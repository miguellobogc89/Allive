// src/components/profile/now/ProfileNowSection.tsx

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  onPress?: () => void;
};

export function ProfileNowSection({
  onPress,
}: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>
        Ahora
      </Text>

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          pressed && styles.pressed,
        ]}
      >
        <LinearGradient
          colors={[
            "#164A79",
            "#0E72C4",
            "#168FE8",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.plusButton}
        >
          <Ionicons
            name="add"
            size={31}
            color="#FFFFFF"
          />
        </LinearGradient>

        <View style={styles.copy}>
          <Text style={styles.title}>
            Comparte tu momento
          </Text>

          <Text style={styles.subtitle}>
            Go live y conecta con tu gente
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={23}
          color="#F2F6FA"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },

  heading: {
    marginBottom: 10,
    color: "#F5F7FA",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.25,
  },

  card: {
    minHeight: 74,
    paddingHorizontal: 12,
    paddingVertical: 10,

    flexDirection: "row",
    alignItems: "center",

    borderRadius: 14,

    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#27AFFF",

    backgroundColor: "#0A1621",
  },

  pressed: {
    opacity: 0.78,
  },

  plusButton: {
    width: 50,
    height: 50,

    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#168FE8",
    shadowOpacity: 0.35,
    shadowRadius: 9,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 5,
  },

  copy: {
    flex: 1,
    marginLeft: 13,
    marginRight: 8,
  },

  title: {
    color: "#46B5FF",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
    letterSpacing: -0.2,
  },

  subtitle: {
    marginTop: 3,

    color: "#B5C0CD",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "400",
  },
});