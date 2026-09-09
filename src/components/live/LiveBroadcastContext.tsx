// src/components/live/LiveBroadcastContext.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  colors,
  radius,
  spacing,
  typography,
} from "../../styles";

import type {
  BroadcastLocation,
  LocationStatus,
} from "./broadcastTypes";

type Props = {
  title: string;
  editingTitle: boolean;
  location: BroadcastLocation | null;
  locationStatus: LocationStatus;
  locationVisible: boolean;
  onChangeTitle: (value: string) => void;
  onEditTitle: () => void;
  onSaveTitle: () => void;
  onToggleLocation: () => void;
};

export function LiveBroadcastContext({
  title,
  editingTitle,
  location,
  locationStatus,
  locationVisible,
  onChangeTitle,
  onEditTitle,
  onSaveTitle,
  onToggleLocation,
}: Props) {
  let locationText =
    "Ubicacion no disponible";

  if (locationStatus === "loading") {
    locationText = "Localizando...";
  }

  if (
    locationStatus === "ready" &&
    location
  ) {
    locationText = location.placeName;
  }

  return (
    <View
      style={styles.container}
      pointerEvents="box-none"
    >
      <View style={styles.contextCard}>
        {editingTitle ? (
          <TextInput
            autoFocus
            value={title}
            onChangeText={onChangeTitle}
            onBlur={onSaveTitle}
            onSubmitEditing={onSaveTitle}
            placeholder="Pon un titulo al directo"
            placeholderTextColor={
              colors.textOnOverlayPlaceholder
            }
            maxLength={100}
            returnKeyType="done"
            style={styles.input}
          />
        ) : (
          <Pressable
            style={styles.titleRow}
            onPress={onEditTitle}
          >
            <View style={styles.titleBlock}>
              <Text style={styles.eyebrow}>
                Titulo del directo
              </Text>

              <Text
                numberOfLines={2}
                style={[
                  styles.title,
                  !title &&
                    styles.placeholder,
                ]}
              >
                {title ||
                  "Pon un titulo al directo"}
              </Text>
            </View>

            <View style={styles.editButton}>
              <Ionicons
                name="create-outline"
                size={17}
                color={colors.text}
              />
            </View>
          </Pressable>
        )}

        <View style={styles.separator} />

        <Pressable
          style={styles.locationRow}
          onPress={onToggleLocation}
        >
          <View style={styles.locationMain}>
            <Ionicons
              name={
                locationVisible
                  ? "location-outline"
                  : "location-sharp"
              }
              size={15}
              color={
                colors.textOnOverlaySecondary
              }
            />

            <Text
              style={styles.locationText}
              numberOfLines={1}
            >
              {locationText}
            </Text>
          </View>

          <View
            style={[
              styles.visibilityChip,
              !locationVisible &&
                styles.visibilityChipHidden,
            ]}
          >
            <Ionicons
              name={
                locationVisible
                  ? "eye-outline"
                  : "eye-off-outline"
              }
              size={13}
              color={
                locationVisible
                  ? colors.text
                  : colors.textOnOverlayMuted
              }
            />

            <Text
              style={[
                styles.visibilityText,
                !locationVisible &&
                  styles.visibilityTextHidden,
              ]}
            >
              {locationVisible
                ? "Visible"
                : "Oculta"}
            </Text>
          </View>
        </Pressable>
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
    left: 16,
    right: 16,
    bottom: 104,
    zIndex: 18,
    alignItems: "flex-start",
  },

  contextCard: {
    width: "100%",
    maxWidth: 500,
    borderRadius: 22,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor:
      "rgba(8,9,10,0.58)",
    borderWidth:
      StyleSheet.hairlineWidth,
    borderColor:
      colors.dividerOnOverlay,
  },

  titleRow: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    gap: spacing.md,
  },

  titleBlock: {
    flex: 1,
    gap: 4,
  },

  eyebrow: {
    color:
      colors.textOnOverlaySubtle,
    ...typography.micro,
    textTransform: "uppercase",
  },

  title: {
    color: colors.text,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "800",
  },

  placeholder: {
    color:
      colors.textOnOverlayPlaceholder,
    fontWeight: "600",
  },

  editButton: {
    width: 36,
    height: 36,
    borderRadius: radius.round,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      colors.overlayChrome,
  },

  input: {
    minHeight: 54,
    padding: 0,
    color: colors.text,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "800",
    backgroundColor: "transparent",
    ...inputWebOutline,
  } as any,

  separator: {
    height:
      StyleSheet.hairlineWidth,
    marginVertical: spacing.sm,
    backgroundColor:
      colors.dividerOnOverlay,
  },

  locationRow: {
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    gap: spacing.md,
  },

  locationMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  locationText: {
    flex: 1,
    color:
      colors.textOnOverlaySecondary,
    ...typography.caption,
  },

  visibilityChip: {
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    borderRadius: radius.round,
    backgroundColor:
      "rgba(255,255,255,0.13)",
  },

  visibilityChipHidden: {
    backgroundColor:
      colors.overlaySoft,
  },

  visibilityText: {
    color: colors.text,
    ...typography.caption,
  },

  visibilityTextHidden: {
    color:
      colors.textOnOverlayMuted,
  },
});
