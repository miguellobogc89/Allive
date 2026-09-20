
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type ReplayCreatorMetadataProps = {
  username: string;
  avatarUrl?: string | null;
  location?: string | null;
  title?: string | null;

  isFollowing?: boolean;
  followLoading?: boolean;

  onOpenCreator?: () => void;
  onFollowPress?: () => void;
};

export function ReplayCreatorMetadata({
  username,
  avatarUrl,
  location,
  title,

  isFollowing = false,
  followLoading = false,

  onOpenCreator,
  onFollowPress,
}: ReplayCreatorMetadataProps) {
  const displayName = username.trim() || "Allive";
  const avatarInitial =
    displayName.charAt(0).toUpperCase() || "A";

  return (
    <View style={styles.container}>
      {/* AVATAR + USUARIO/UBICACIÓN + SEGUIR */}

<View style={styles.identityRow}>
  <Pressable
    style={styles.avatarButton}
    onPress={onOpenCreator}
    disabled={!onOpenCreator}
    accessibilityRole="button"
    accessibilityLabel="Abrir perfil del creador"
  >
    {avatarUrl ? (
      <Image
        source={{ uri: avatarUrl }}
        style={styles.avatarImage}
        resizeMode="cover"
      />
    ) : (
      <Text style={styles.avatarInitial}>
        {avatarInitial}
      </Text>
    )}
  </Pressable>

  <View style={styles.creatorInfo}>
    <View style={styles.usernameRow}>
      <Pressable
        style={styles.usernameButton}
        onPress={onOpenCreator}
        disabled={!onOpenCreator}
        accessibilityRole="button"
        accessibilityLabel="Abrir perfil del creador"
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.username}
        >
          @{displayName}
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.followButton,
          isFollowing && styles.followingButton,
          followLoading && styles.followButtonDisabled,
        ]}
        onPress={onFollowPress}
        disabled={!onFollowPress || followLoading}
        accessibilityRole="button"
        accessibilityLabel={
          isFollowing
            ? "Dejar de seguir al creador"
            : "Seguir al creador"
        }
      >
        <Text style={styles.followButtonText}>
          {followLoading
            ? "..."
            : isFollowing
              ? "Siguiendo"
              : "Seguir"}
        </Text>
      </Pressable>
    </View>

    {location?.trim() ? (
      <View style={styles.locationRow}>
        <Ionicons
          name="location-outline"
          size={12}
          color="rgba(255,255,255,0.78)"
        />

        <Text
          numberOfLines={1}
          style={styles.location}
        >
          {location.trim()}
        </Text>
      </View>
    ) : null}
  </View>
</View>

      {/* TÍTULO DEBAJO DEL BLOQUE DE IDENTIDAD */}
      {title?.trim() ? (
        <Text
          numberOfLines={2}
          style={styles.title}
        >
          {title.trim()}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "stretch",
  },

  identityRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: "hidden",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(35,35,40,0.85)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarInitial: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  creatorInfo: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
    gap: 3,
  },


usernameRow: {
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
},

usernameButton: {
  flexShrink: 1,
  minWidth: 0,
},

username: {
  color: "#FFFFFF",
  fontSize: 15,
  lineHeight: 19,
  fontWeight: "700",
  textShadowColor: "rgba(0,0,0,0.8)",
  textShadowOffset: {
    width: 0,
    height: 1,
  },
  textShadowRadius: 3,
},

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  location: {
    flexShrink: 1,
    color: "rgba(255,255,255,0.78)",
    fontSize: 12,
    lineHeight: 16,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },

  followButton: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 9,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  followingButton: {
    backgroundColor: "rgba(255,255,255,0.14)",
  },

  followButtonDisabled: {
    opacity: 0.5,
  },

  followButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  title: {
    width: "100%",
    marginTop: 12,
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
    textAlign: "left",
    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 4,
  },
});