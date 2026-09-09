// src/components/live/LiveViewerAudience.tsx

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  colors,
  controls,
  iconSizes,
  spacing,
  typography,
} from "../../styles";

import type {
  LiveAudience,
} from "./liveAudience";

type Props = {
  audience: LiveAudience;
  open: boolean;
  onToggle: () => void;
};

export function LiveViewerAudience({
  audience,
  open,
  onToggle,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <Pressable
        style={
          styles.viewerBadge
        }
        onPress={onToggle}
      >
        <Ionicons
          name="eye-outline"
          size={iconSizes.sm}
          color={colors.text}
        />

        <Text
          style={
            styles.viewerText
          }
        >
          {audience.total}
        </Text>

        <Ionicons
          name={
            open
              ? "chevron-up"
              : "chevron-down"
          }
          size={12}
          color={
            colors.textSecondary
          }
        />
      </Pressable>

      {open ? (
        <View
          style={
            styles.dropdown
          }
        >
          <Text
            style={
              styles.title
            }
          >
            Viendo ahora
          </Text>

          {audience.users
            .length > 0 ? (
            <View
              style={
                styles.section
              }
            >
              <Text
                style={
                  styles.sectionLabel
                }
              >
                Usuarios
              </Text>

              {audience.users.map(
                (user) => (
                  <View
                    key={
                      user.id
                    }
                    style={
                      styles.userRow
                    }
                  >
                    <View
                      style={
                        styles.avatar
                      }
                    >
                      <Text
                        style={
                          styles.avatarText
                        }
                      >
                        {user.username
                          .charAt(0)
                          .toUpperCase()}
                      </Text>
                    </View>

                    <Text
                      style={
                        styles.username
                      }
                    >
                      @
                      {
                        user.username
                      }
                    </Text>
                  </View>
                ),
              )}
            </View>
          ) : null}

          <View
            style={
              styles.guestRow
            }
          >
            <View
              style={
                styles.guestLeft
              }
            >
              <Ionicons
                name="people-outline"
                size={16}
                color={
                  colors.textSecondary
                }
              />

              <Text
                style={
                  styles.guestLabel
                }
              >
                Invitados
              </Text>
            </View>

            <Text
              style={
                styles.guestCount
              }
            >
              {
                audience.guestCount
              }
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles =
  StyleSheet.create({
    wrapper: {
      position: "relative",
      zIndex: 40,
    },

    viewerBadge: {
      height:
        controls.compactBadgeHeight,

      paddingHorizontal: 10,

      borderRadius: 9,

      flexDirection: "row",

      alignItems: "center",

      gap: 5,

      backgroundColor:
        colors.overlayStrong,
    },

    viewerText: {
      color: colors.text,

      ...typography.label,
    },

    dropdown: {
      position: "absolute",

      top:
        controls.compactBadgeHeight +
        spacing.xs,

      left: 0,

      width: 220,

      padding: spacing.md,

      borderRadius: 14,

      backgroundColor:
        colors.overlayRaisedStrong,

      borderWidth: 1,

      borderColor:
        colors.dividerOnOverlay,

      gap: spacing.sm,
    },

    title: {
      color: colors.text,

      fontSize: 13,

      fontWeight: "800",
    },

    section: {
      gap: spacing.xs,
    },

    sectionLabel: {
      color:
        colors.textSecondary,

      fontSize: 10,

      fontWeight: "700",

      textTransform:
        "uppercase",
    },

    userRow: {
      minHeight: 32,

      flexDirection: "row",

      alignItems: "center",

      gap: spacing.sm,
    },

    avatar: {
      width: 26,

      height: 26,

      borderRadius: 13,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        colors.surfaceElevated,
    },

    avatarText: {
      color: colors.text,

      fontSize: 11,

      fontWeight: "800",
    },

    username: {
      color: colors.text,

      fontSize: 12,

      fontWeight: "700",
    },

    guestRow: {
      minHeight: 34,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      borderTopWidth: 1,

      borderTopColor:
        colors.dividerOnOverlay,

      paddingTop: spacing.sm,
    },

    guestLeft: {
      flexDirection: "row",

      alignItems: "center",

      gap: spacing.xs,
    },

    guestLabel: {
      color:
        colors.textSecondary,

      fontSize: 12,

      fontWeight: "600",
    },

    guestCount: {
      color: colors.text,

      fontSize: 12,

      fontWeight: "800",
    },
  });