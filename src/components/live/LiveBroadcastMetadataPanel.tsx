// src/components/live/LiveBroadcastMetadataPanel.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors, typography } from "../../styles";
import type {
  BroadcastLocation,
  LocationStatus,
} from "./broadcastTypes";

type LiveBroadcastMetadataPanelProps = {
  title: string;
  eventName: string;
  editingTitle: boolean;
  editingEvent: boolean;
  location: BroadcastLocation | null;
  locationStatus: LocationStatus;
  onChangeTitle: (value: string) => void;
  onChangeEventName: (value: string) => void;
  onEditTitle: () => void;
  onEditEvent: () => void;
  onSaveTitle: () => void;
  onSaveEvent: () => void;
};

export function LiveBroadcastMetadataPanel({
  title,
  eventName,
  editingTitle,
  editingEvent,
  location,
  locationStatus,
  onChangeTitle,
  onChangeEventName,
  onEditTitle,
  onEditEvent,
  onSaveTitle,
  onSaveEvent,
}: LiveBroadcastMetadataPanelProps) {
  return (
    <View style={styles.container}>
      {editingTitle ? (
        <View style={styles.editorRow}>
          <TextInput
            autoFocus
            value={title}
            onChangeText={onChangeTitle}
            placeholder={"\u00bfQu\u00e9 est\u00e1 pasando?"}
            placeholderTextColor="rgba(255,255,255,0.45)"
            maxLength={120}
            style={styles.titleInput}
            returnKeyType="done"
            onSubmitEditing={onSaveTitle}
            onBlur={onSaveTitle}
          />
        </View>
      ) : (
        <Pressable style={styles.metadataRow} onPress={onEditTitle}>
          <Ionicons name="create-outline" size={19} color={colors.text} />
          <Text
            numberOfLines={2}
            style={[styles.titleText, !title && styles.placeholderText]}
          >
            {title || "\u00bfQu\u00e9 est\u00e1 pasando?"}
          </Text>
        </Pressable>
      )}

      <View style={styles.separator} />

      {editingEvent ? (
        <View style={styles.editorRow}>
          <Ionicons
            name="calendar-outline"
            size={18}
            color={colors.text}
          />
          <TextInput
            autoFocus
            value={eventName}
            onChangeText={onChangeEventName}
            placeholder="Nombre del evento"
            placeholderTextColor="rgba(255,255,255,0.45)"
            maxLength={120}
            style={styles.eventInput}
            returnKeyType="done"
            onSubmitEditing={onSaveEvent}
            onBlur={onSaveEvent}
          />
        </View>
      ) : (
        <Pressable style={styles.metadataRow} onPress={onEditEvent}>
          <Ionicons
            name="calendar-outline"
            size={18}
            color={eventName ? colors.text : "rgba(255,255,255,0.65)"}
          />
          <Text
            numberOfLines={1}
            style={[styles.secondaryText, !eventName && styles.placeholderText]}
          >
            {eventName || "A\u00f1adir evento"}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color="rgba(255,255,255,0.4)"
          />
        </Pressable>
      )}

      <View style={styles.separator} />

      <View style={styles.metadataRow}>
        <Ionicons
          name="location"
          size={18}
          color={
            locationStatus === "ready"
              ? colors.text
              : "rgba(255,255,255,0.55)"
          }
        />

        <View style={styles.locationTextContainer}>
          <Text style={styles.secondaryText}>
            {locationStatus === "loading"
              ? "Buscando ubicaci\u00f3n..."
              : locationStatus === "ready"
                ? location?.placeName
                : "Sin ubicaci\u00f3n"}
          </Text>

          {location ? (
            <Text style={styles.coordinates}>
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const inputWebOutline = {
  outlineStyle: "none",
} as const;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 205,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.62)",
    zIndex: 20,
  },
  metadataRow: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  editorRow: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  titleText: {
    flex: 1,
    color: colors.text,
    fontSize: typography.title.fontSize,
    lineHeight: 22,
    fontWeight: typography.title.fontWeight,
  },
  secondaryText: {
    flex: 1,
    color: colors.text,
    ...typography.bodyStrong,
  },
  placeholderText: {
    color: "rgba(255,255,255,0.55)",
  },
  titleInput: {
    flex: 1,
    color: colors.text,
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    ...inputWebOutline,
  } as any,
  eventInput: {
    flex: 1,
    color: colors.text,
    ...typography.bodyStrong,
    ...inputWebOutline,
  } as any,
  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  locationTextContainer: {
    flex: 1,
  },
  coordinates: {
    marginTop: 2,
    color: "rgba(255,255,255,0.42)",
    fontSize: 10,
  },
});
