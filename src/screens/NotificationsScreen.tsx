import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  useEffect,
  useState,
} from "react";

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type AlliveNotification,
  type AlliveNotificationTarget,
} from "../api/notificationsApi";
import { useAuth } from "../auth/AuthContext";
import {
  colors,
  typography,
} from "../styles";

type Props = {
  onBack: () => void;
  onOpenTarget: (
    target: AlliveNotificationTarget,
  ) => void;
  onUnreadChanged: () => void;
  refreshKey?: number;
};

function formatTime(value: string) {
  const date = new Date(value);
  const diff =
    Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return "Ahora";
  }

  if (diff < hour) {
    return `${Math.floor(diff / minute)} min`;
  }

  if (diff < day) {
    return `${Math.floor(diff / hour)} h`;
  }

  return `${Math.floor(diff / day)} d`;
}

function Avatar({
  item,
}: {
  item: AlliveNotification;
}) {
  const actor = item.actor;
  const label =
    actor?.displayName ||
    actor?.username ||
    "A";

  if (actor?.avatarUrl) {
    return (
      <Image
        source={{
          uri: actor.avatarUrl,
        }}
        style={styles.avatar}
      />
    );
  }

  return (
    <View style={styles.avatarFallback}>
      <Text style={styles.avatarText}>
        {label.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

export function NotificationsScreen({
  onBack,
  onOpenTarget,
  onUnreadChanged,
  refreshKey = 0,
}: Props) {
  const { token } = useAuth();
  const [
    notifications,
    setNotifications,
  ] = useState<AlliveNotification[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState<string | null>(null);

  async function loadNotifications(
    signal?: AbortSignal,
  ) {
    if (!token) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const result =
        await getNotifications(
          token,
          signal,
        );

      setNotifications(result);
    } catch (caughtError) {
      if (
        caughtError instanceof Error &&
        caughtError.name === "AbortError"
      ) {
        return;
      }

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No se pudieron cargar las notificaciones.",
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    const controller =
      new AbortController();

    setLoading(true);
    void loadNotifications(
      controller.signal,
    );

    return () => {
      controller.abort();
    };
  }, [token, refreshKey]);

  async function openNotification(
    notification: AlliveNotification,
  ) {
    if (token && !notification.readAt) {
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                readAt:
                  new Date().toISOString(),
              }
            : item,
        ),
      );

      await markNotificationRead(
        token,
        notification.id,
      ).catch(() => undefined);

      onUnreadChanged();
    }

    onOpenTarget(
      notification.target,
    );
  }

  async function markAllRead() {
    if (!token) {
      return;
    }

    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        readAt:
          item.readAt ||
          new Date().toISOString(),
      })),
    );

    await markAllNotificationsRead(
      token,
    ).catch(() => undefined);

    onUnreadChanged();
  }

  const unreadCount =
    notifications.filter(
      (item) => !item.readAt,
    ).length;

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.topBar}>
          <Pressable
            onPress={onBack}
            hitSlop={10}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="chevron-back"
              size={27}
              color="#FFFFFF"
            />
          </Pressable>

          <Text style={styles.title}>
            Notificaciones
          </Text>

          <Pressable
            disabled={unreadCount === 0}
            onPress={() => {
              void markAllRead();
            }}
            hitSlop={10}
            style={({ pressed }) => [
              styles.iconButton,
              unreadCount === 0 &&
                styles.disabled,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="checkmark-done"
              size={23}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.state}>
            <ActivityIndicator color={colors.accent} />
          </View>
        ) : error ? (
          <View style={styles.state}>
            <Text style={styles.stateTitle}>
              {error}
            </Text>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.state}>
            <Ionicons
              name="notifications-outline"
              size={34}
              color="rgba(255,255,255,0.58)"
            />
            <Text style={styles.stateTitle}>
              Sin notificaciones
            </Text>
            <Text style={styles.stateText}>
              Aqui apareceran tus follows y directos.
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={
              styles.list
            }
            showsVerticalScrollIndicator={
              false
            }
          >
            {notifications.map(
              (notification) => (
                <Pressable
                  key={notification.id}
                  onPress={() => {
                    void openNotification(
                      notification,
                    );
                  }}
                  style={({ pressed }) => [
                    styles.row,
                    !notification.readAt &&
                      styles.unreadRow,
                    pressed &&
                      styles.pressed,
                  ]}
                >
                  <Avatar
                    item={notification}
                  />

                  <View style={styles.copy}>
                    <Text
                      style={[
                        styles.body,
                        !notification.readAt &&
                          styles.bodyUnread,
                      ]}
                    >
                      {notification.text}
                    </Text>
                    <Text style={styles.time}>
                      {formatTime(
                        notification.createdAt,
                      )}
                    </Text>
                  </View>

                  {notification.actionLabel ? (
                    <View style={styles.action}>
                      <Text
                        style={
                          styles.actionText
                        }
                      >
                        {
                          notification.actionLabel
                        }
                      </Text>
                    </View>
                  ) : null}

                  {!notification.readAt ? (
                    <View
                      style={styles.unreadDot}
                    />
                  ) : null}
                </Pressable>
              ),
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#06101A",
  },

  inner: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 120,
    backgroundColor: "#06101A",
  },

  topBar: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: colors.text,
    fontSize: typography.title.fontSize,
    fontWeight: "800",
  },

  list: {
    paddingTop: 10,
    gap: 8,
  },

  row: {
    minHeight: 72,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
    backgroundColor:
      "rgba(255,255,255,0.055)",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.07)",
  },

  unreadRow: {
    backgroundColor:
      "rgba(255,59,48,0.12)",
    borderColor:
      "rgba(255,59,48,0.2)",
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor:
      "rgba(255,255,255,0.1)",
  },

  avatarFallback: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      "rgba(255,255,255,0.12)",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  copy: {
    flex: 1,
    gap: 5,
  },

  body: {
    color:
      "rgba(255,255,255,0.82)",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 19,
  },

  bodyUnread: {
    color: colors.text,
    fontWeight: "700",
  },

  time: {
    color:
      "rgba(255,255,255,0.52)",
    fontSize: 11,
    fontWeight: "600",
  },

  action: {
    height: 32,
    minWidth: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 13,
    backgroundColor: "#FFFFFF",
  },

  actionText: {
    color: "#06101A",
    fontSize: 12,
    fontWeight: "800",
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.live,
  },

  state: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 28,
  },

  stateTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },

  stateText: {
    color:
      "rgba(255,255,255,0.58)",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },

  disabled: {
    opacity: 0.35,
  },

  pressed: {
    opacity: 0.72,
  },
});
