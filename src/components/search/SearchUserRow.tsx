// src/components/search/SearchUserRow.tsx

import {
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

import type {
  SearchUser,
} from "../../api/searchApi";

import {
  searchScreenStyles as styles,
} from "./searchScreen.styles";

type Props = {
  user: SearchUser;
  onPress: () => void;
};

export function SearchUserRow({
  user,
  onPress,
}: Props) {
  const name =
    user.displayName?.trim();

  return (
    <Pressable
      style={styles.userRow}
      onPress={onPress}
    >
      {user.avatarUrl ? (
        <Image
          source={{
            uri: user.avatarUrl,
          }}
          style={styles.avatar}
        />
      ) : (
        <View
          style={[
            styles.avatar,
            styles.avatarFallback,
          ]}
        >
          <Text
            style={styles.avatarLetter}
          >
            {user.username
              .charAt(0)
              .toUpperCase()}
          </Text>
        </View>
      )}

      <View style={styles.userIdentity}>
        <Text
          numberOfLines={1}
          style={styles.username}
        >
          {user.username}
        </Text>

        {name ? (
          <Text
            numberOfLines={1}
            style={styles.displayName}
          >
            {name}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}