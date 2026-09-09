// src/screens/NowScreen.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, controls, spacing } from "../styles";

type NowScreenProps = {
  requestedLiveId?: string | null;
};

export function NowScreen({
  requestedLiveId: _requestedLiveId,
}: NowScreenProps) {
  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      }}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.top}>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>

        <View style={styles.viewers}>
          <Ionicons
            name="eye-outline"
            size={15}
            color={colors.text}
          />

          <Text style={styles.viewerText}>1.284</Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <View style={styles.info}>
          <View style={styles.locationRow}>
            <Ionicons
              name="location"
              size={16}
              color={colors.text}
            />

            <Text style={styles.location}>
              La Barrosa · Chiclana
            </Text>
          </View>

          <Text style={styles.creator}>@miguel</Text>

          <Text style={styles.description}>
            Así está La Barrosa ahora mismo.
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.action}>
            <Ionicons
              name="chatbubble-outline"
              size={27}
              color={colors.text}
            />

            <Text style={styles.actionText}>328</Text>
          </Pressable>

          <Pressable style={styles.action}>
            <Ionicons
              name="star-outline"
              size={29}
              color={colors.text}
            />

            <Text style={styles.actionText}>Guardar</Text>
          </Pressable>

          <Pressable style={styles.action}>
            <Ionicons
              name="arrow-redo-outline"
              size={29}
              color={colors.text}
            />

            <Text style={styles.actionText}>Compartir</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.12)",
  },

  top: {
    position: "absolute",

    top: 22,
    left: 22,
    right: 22,

    flexDirection: "row",
    alignItems: "center",

    gap: 8,
  },

  liveBadge: {
    height: 30,

    flexDirection: "row",
    alignItems: "center",

    gap: 6,

    paddingHorizontal: 10,

    borderRadius: 9,

    backgroundColor: colors.overlayViewerBadge,
  },

  liveDot: {
    width: controls.badgeDotSize,
    height: controls.badgeDotSize,

    borderRadius: 4,

    backgroundColor: colors.live,
  },

  liveText: {
    color: colors.text,

    fontSize: 12,
    fontWeight: "800",
  },

  viewers: {
    height: 30,

    flexDirection: "row",
    alignItems: "center",

    gap: 5,

    paddingHorizontal: 10,

    borderRadius: 9,

    backgroundColor: colors.overlayViewerBadge,
  },

  viewerText: {
    color: colors.text,

    fontSize: 12,
    fontWeight: "600",
  },

  bottom: {
    position: "absolute",

    left: 22,
    right: 18,
    bottom: 108,

    flexDirection: "row",
    alignItems: "flex-end",
  },

  info: {
    flex: 1,

    paddingRight: 20,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",

    gap: 5,
  },

  location: {
    color: colors.text,

    fontSize: 18,
    fontWeight: "800",
  },

  creator: {
    marginTop: 6,

    color: colors.text,

    fontSize: 14,
    fontWeight: "700",
  },

  description: {
    marginTop: 7,

    color: colors.text,

    fontSize: 14,
    lineHeight: 19,
  },

  actions: {
    alignItems: "center",

    gap: 21,
  },

  action: {
    minWidth: 52,

    alignItems: "center",

    gap: spacing.xxs,
  },

  actionText: {
    color: colors.text,

    fontSize: 10,
    fontWeight: "600",
  },
});
