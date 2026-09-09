// src/components/search/result-card/PersonSearchCard.tsx

import {
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

import type { SearchUser } from "../../../api/searchApi";

import { styles } from "./searchResultCard.styles";

type Props = {
  user: SearchUser;
};

export function PersonSearchCard({
  user,
}: Props) {
  const displayName =
    user.displayName ??
    user.username;

  return (
    <Pressable style={styles.personCard}>
      {user.avatarUrl ? (
        <Image
          source={{
            uri: user.avatarUrl,
          }}
          style={styles.personAvatar}
        />
      ) : (
        <View
          style={[
            styles.personAvatar,
            styles.personAvatarFallback,
          ]}
        >
          <Text
            style={styles.personInitial}
          >
            {user.username
              .slice(0, 1)
              .toUpperCase()}
          </Text>
        </View>
      )}

      <View style={styles.personInfo}>
        <Text
          style={styles.personName}
          numberOfLines={1}
        >
          {displayName}
        </Text>

        <Text
          style={styles.personUsername}
          numberOfLines={1}
        >
          @{user.username}
        </Text>
      </View>
    </Pressable>
  );
}