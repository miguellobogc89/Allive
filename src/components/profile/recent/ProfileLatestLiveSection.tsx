// src/components/profile/recent/ProfileLatestLiveSection.tsx

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { ProfileVideoItem } from "../profileTypes";
import { LatestLiveCard } from "./LatestLiveCard";

type Props = {
  video?: ProfileVideoItem;
  title?: string;
};

export function ProfileLatestLiveSection({
  video,
  title = "Tu ultimo directo",
}: Props) {
  if (!video) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.heading}>
          {title}
        </Text>
      </View>

      <LatestLiveCard video={video} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },

  header: {
    marginBottom: 9,
  },

  heading: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
});