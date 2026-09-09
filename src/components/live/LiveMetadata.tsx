// src/components/live/LiveMetadata.tsx

import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, iconSizes, typography } from "../../styles";

type LiveMetadataProps = {
  title?: string | null;
  eventName?: string | null;
  placeName?: string | null;
  creatorName?: string | null;
  onPressEvent?: () => void;
  onPressLocation?: () => void;
};

export function LiveMetadata({ title, eventName, placeName, creatorName, onPressEvent, onPressLocation }: LiveMetadataProps) {
  return (
    <View style={styles.container}>
      {creatorName ? <Text style={styles.creator} numberOfLines={1}>@{creatorName}</Text> : null}
      {title ? <Text style={styles.title} numberOfLines={2}>{title}</Text> : null}
      {eventName ? (
        <Pressable style={styles.contextRow} onPress={onPressEvent} disabled={!onPressEvent}>
          <Ionicons name="calendar-outline" size={iconSizes.xs} color={colors.text} />
          <Text style={styles.contextText} numberOfLines={1}>{eventName}</Text>
        </Pressable>
      ) : null}
      {placeName ? (
        <Pressable style={styles.contextRow} onPress={onPressLocation} disabled={!onPressLocation}>
          <Ionicons name="location-outline" size={iconSizes.xs} color={colors.text} />
          <Text style={styles.contextText} numberOfLines={1}>{placeName}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { maxWidth: "78%", gap: 5 },
  creator: { color: colors.text, fontSize: 13, fontWeight: "800" },
  title: { color: colors.text, ...typography.title, lineHeight: 22, textShadowColor: "rgba(0,0,0,0.55)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  contextRow: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", maxWidth: "100%" },
  contextText: { flexShrink: 1, color: "rgba(255,255,255,0.9)", ...typography.label, fontWeight: "600" },
});
