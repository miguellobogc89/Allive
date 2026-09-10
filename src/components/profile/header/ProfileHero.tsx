// src/components/profile/header/ProfileHero.tsx

import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { ProfileBio } from "./ProfileBio";
import { ProfileCoverImage } from "./ProfileCoverImage";
import { ProfileEditButton } from "./ProfileEditButton";
import { ProfileIdentity } from "./ProfileIdentity";
import { ProfileLocation } from "./ProfileLocation";

type Props = {
  displayName: string;
  username: string;
  coverUrl: string | null;
  description: string;
  location: string;
  verified?: boolean;
  action?: ReactNode;
  onPressEditProfile?: () => void;
};

export function ProfileHero({
  displayName,
  username,
  coverUrl,
  description,
  location,
  verified = false,
  action,
  onPressEditProfile,
}: Props) {
  return (
    <View style={styles.container}>
      <ProfileCoverImage imageUrl={coverUrl} />

      {/* Oscurecido superior muy suave */}
      <LinearGradient
        colors={[
          "rgba(2,8,14,0.38)",
          "rgba(2,8,14,0.08)",
          "rgba(2,8,14,0)",
        ]}
        locations={[0, 0.55, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.4 }}
        style={styles.fullOverlay}
        pointerEvents="none"
      />

      {/* Esquina superior izquierda */}
      <LinearGradient
        colors={[
          "rgba(0,5,10,0.62)",
          "rgba(0,5,10,0.26)",
          "rgba(0,5,10,0)",
        ]}
        locations={[0, 0.48, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.topLeftShadow}
        pointerEvents="none"
      />

      {/* Esquina superior derecha */}
      <LinearGradient
        colors={[
          "rgba(0,5,10,0.62)",
          "rgba(0,5,10,0.26)",
          "rgba(0,5,10,0)",
        ]}
        locations={[0, 0.48, 1]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.topRightShadow}
        pointerEvents="none"
      />

      {/* Gradiente principal inferior:
          oscuro abajo -> completamente transparente arriba */}
      <LinearGradient
        colors={[
          "rgba(3,10,16,0)",
          "rgba(3,10,16,0.08)",
          "rgba(3,10,16,0.42)",
          "rgba(3,10,16,0.86)",
          "#06101A",
        ]}
        locations={[
          0,
          0.28,
          0.55,
          0.82,
          1,
        ]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.bottomGradient}
        pointerEvents="none"
      />

      <View style={styles.content}>
        <View style={styles.identity}>
          <ProfileIdentity
            displayName={displayName}
            username={username}
            verified={verified}
          />

          <ProfileLocation
            location={location}
          />

          <ProfileBio
            description={description}
          />
        </View>

        {action ??
          (onPressEditProfile ? (
            <ProfileEditButton
              onPress={onPressEditProfile}
            />
          ) : null)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 330,

    marginHorizontal: -18,
    marginTop: -64,

    overflow: "hidden",

    backgroundColor: "#101923",
  },

  fullOverlay: {
    ...StyleSheet.absoluteFill,
  },

  topLeftShadow: {
    position: "absolute",

    left: 0,
    top: 0,

    width: "58%",
    height: 175,
  },

  topRightShadow: {
    position: "absolute",

    right: 0,
    top: 0,

    width: "58%",
    height: 175,
  },

  bottomGradient: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 0,

    height: 245,
  },

  content: {
    position: "absolute",

    left: 18,
    right: 18,
    bottom: 18,

    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",

    gap: 16,
  },

  identity: {
    flex: 1,
  },
});
