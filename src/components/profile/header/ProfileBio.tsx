// src/components/profile/header/ProfileBio.tsx

import { StyleSheet, Text } from "react-native";

type Props = {
  description: string;
};

export function ProfileBio({ description }: Props) {
  if (!description) {
    return null;
  }

  return <Text style={styles.text}>{description}</Text>;
}

const styles = StyleSheet.create({
  text: {
    maxWidth: 300,
    marginTop: 8,
    color: "#E1E7EE",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "500",
  },
});
