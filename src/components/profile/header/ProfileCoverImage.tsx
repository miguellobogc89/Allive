// src/components/profile/header/ProfileCoverImage.tsx

import { Image, StyleSheet, View } from "react-native";

type Props = {
  imageUrl: string | null;
};

export function ProfileCoverImage({ imageUrl }: Props) {
  if (!imageUrl) {
    return <View style={styles.fallback} />;
  }

  return (
    <Image
      source={{ uri: imageUrl }}
      style={styles.image}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },

  fallback: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#101923",
  },
});
