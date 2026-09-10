// src/components/profile/ProfileSettingsPanel.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
};

const mockOptions = [
  {
    icon: "notifications-outline" as const,
    label: "Notificaciones",
  },
  {
    icon: "shield-checkmark-outline" as const,
    label: "Privacidad",
  },
  {
    icon: "analytics-outline" as const,
    label: "Estadísticas",
  },
  {
    icon: "help-circle-outline" as const,
    label: "Ayuda",
  },
];

export function ProfileSettingsPanel({
  visible,
  onClose,
  onEditProfile,
  onLogout,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
      >
        <Pressable
          style={styles.sheet}
          onPress={() => undefined}
        >
          <View style={styles.handle} />

          <Text style={styles.title}>
            Ajustes
          </Text>

          <Pressable
            style={styles.row}
            onPress={onEditProfile}
          >
            <Ionicons
              name="person-outline"
              size={21}
              color="#111111"
            />
            <Text style={styles.rowText}>
              Editar perfil
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color="#A0A0A0"
            />
          </Pressable>

          {mockOptions.map((option) => (
            <Pressable
              key={option.label}
              style={styles.row}
            >
              <Ionicons
                name={option.icon}
                size={21}
                color="#111111"
              />
              <Text style={styles.rowText}>
                {option.label}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="#A0A0A0"
              />
            </Pressable>
          ))}

          <Pressable
            style={styles.row}
            onPress={onLogout}
          >
            <Ionicons
              name="log-out-outline"
              size={21}
              color="#ED4956"
            />
            <Text
              style={[
                styles.rowText,
                styles.logout,
              ]}
            >
              Cerrar sesión
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.28)",
  },

  sheet: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 34,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: "#FFFFFF",
  },

  handle: {
    width: 38,
    height: 4,
    alignSelf: "center",
    borderRadius: 2,
    backgroundColor: "#D5D5D5",
  },

  title: {
    marginTop: 18,
    marginBottom: 10,
    color: "#111111",
    fontSize: 20,
    fontWeight: "800",
  },

  row: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EFEFEF",
  },

  rowText: {
    flex: 1,
    color: "#111111",
    fontSize: 14,
    fontWeight: "600",
  },

  logout: {
    color: "#ED4956",
  },
});
