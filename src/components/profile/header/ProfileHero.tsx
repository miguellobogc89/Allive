// src/components/profile/header/ProfileHero.tsx

import type { ReactNode } from "react";
import {
  StyleSheet,
  View,
} from "react-native";

import { ProfileBio } from "./ProfileBio";
import { ProfileCoverImage } from "./ProfileCoverImage";
import { ProfileEditButton } from "./ProfileEditButton";
import { ProfileHeroMask } from "./ProfileHeroMask";
import { ProfileIdentity } from "./ProfileIdentity";

type Props = {
  displayName: string;
  username: string;
  coverUrl: string | null;
  description: string;
  verified?: boolean;
  action?: ReactNode;
  onPressEditProfile?: () => void;
};

export function ProfileHero({
  displayName,
  username,
  coverUrl,
  description,
  verified = false,
  action,
  onPressEditProfile,
}: Props) {
  let profileAction = action;

  if (
    !profileAction &&
    onPressEditProfile
  ) {
    profileAction = (
      <ProfileEditButton
        onPress={onPressEditProfile}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ProfileCoverImage
        imageUrl={coverUrl}
      />

      <ProfileHeroMask />

      <View style={styles.content}>
        <View style={styles.identity}>
          <ProfileIdentity
            displayName={displayName}
            username={username}
            verified={verified}
          />

          <ProfileBio
            description={description}
          />
        </View>

        {profileAction}
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