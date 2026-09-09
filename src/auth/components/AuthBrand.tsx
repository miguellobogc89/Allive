// src/auth/components/AuthBrand.tsx

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  colors,
  radius,
  spacing,
} from "../../styles";

type Props = {
  compact: boolean;
  horizontal: boolean;
};

export function AuthBrand({
  compact,
  horizontal,
}: Props) {
  let markSize = 52;
  let coreSize = 18;
  let logoSize = 28;
  let bottomMargin: number = spacing.xl;

  if (compact) {
    markSize = 38;
    coreSize = 12;
    logoSize = 22;
    bottomMargin = spacing.sm;
  }

  if (horizontal) {
    markSize = 72;
    coreSize = 24;
    logoSize = 34;
    bottomMargin = 0;
  }

  return (
    <View
      style={[
        styles.container,
        {
          marginBottom: bottomMargin,
        },
      ]}
    >
      <View
        style={[
          styles.mark,
          {
            width: markSize,
            height: markSize,
            borderRadius:
              markSize / 2,
          },
        ]}
      >
        <View
          style={[
            styles.core,
            {
              width: coreSize,
              height: coreSize,
              borderRadius:
                coreSize / 2,
            },
          ]}
        />
      </View>

      <Text
        style={[
          styles.logo,
          {
            fontSize: logoSize,
          },
        ]}
      >
        ALLIVE
      </Text>

      {!compact && (
        <Text style={styles.claim}>
          LIVE. NOW. EVERYWHERE.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },

  mark: {
    backgroundColor:
      colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.accent,
    marginBottom: spacing.sm,
  },

  core: {
    backgroundColor:
      colors.accent,
  },

  logo: {
    color: colors.text,
    fontWeight: "800",
    letterSpacing: 5,
  },

  claim: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 2.2,
  },
});