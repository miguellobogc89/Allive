// src/components/live/broadcast/overlay/LiveBroadcastMetadataModal.tsx

import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type LiveBroadcastMetadataModalProps = {
  visible: boolean;
  title: string;
  eventName: string;
  onChangeTitle: (value: string) => void;
  onChangeEventName: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

export function LiveBroadcastMetadataModal({
  visible,
  title,
  eventName,
  onChangeTitle,
  onChangeEventName,
  onCancel,
  onSave,
}: LiveBroadcastMetadataModalProps) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.layer}>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onCancel}
      />

      <View style={styles.panel}>
        <Text style={styles.heading}>
          Detalles del LIVE
        </Text>

        <TextInput
          value={title}
          onChangeText={onChangeTitle}
          placeholder="Título"
          placeholderTextColor="rgba(255,255,255,0.55)"
          maxLength={100}
          style={styles.input}
        />

        <TextInput
          value={eventName}
          onChangeText={onChangeEventName}
          placeholder="Evento"
          placeholderTextColor="rgba(255,255,255,0.55)"
          maxLength={100}
          style={styles.input}
        />

        <View style={styles.actions}>
          <Pressable
            onPress={onCancel}
            style={styles.action}
          >
            <Text style={styles.secondaryText}>
              Cancelar
            </Text>
          </Pressable>

          <Pressable
            onPress={onSave}
            style={[
              styles.action,
              styles.saveAction,
            ]}
          >
            <Text style={styles.saveText}>
              Guardar
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    zIndex: 30,
  },
  panel: {
    width: "100%",
    maxWidth: 430,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: 24,
    gap: 12,
    backgroundColor: "rgba(15,15,15,0.68)",
  },
  heading: {
    marginBottom: 4,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  input: {
    width: "100%",
    minHeight: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: 14,
    color: "#FFFFFF",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  actions: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  action: {
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  saveAction: {
    backgroundColor: "#FFFFFF",
  },
  secondaryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  saveText: {
    color: "#111111",
    fontWeight: "800",
  },
});
