// App.tsx

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  AppState,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  AuthProvider,
  useAuth,
} from "./src/auth/AuthContext";

import {
  getUnreadNotificationCount,
  markNotificationRead,
  type AlliveNotificationTarget,
} from "./src/api/notificationsApi";

import { BottomNav } from "./src/components/BottomNav";
import {
  addAlliveNotificationListeners,
  registerForAllivePushNotifications,
  setAlliveBadgeCount,
  type NotificationNavigationTarget,
} from "./src/notifications/alliveNotifications";

import { AuthScreen } from "./src/screens/AuthScreen";
import { EmitScreen } from "./src/screens/EmitScreen";
import { MapScreen } from "./src/screens/MapScreen";
import { NowScreen } from "./src/screens/NowScreen";
import { NotificationsScreen } from "./src/screens/NotificationsScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { SearchScreen } from "./src/screens/SearchScreen";
import { UserProfileScreen } from "./src/screens/UserProfileScreen";

import {
  appFontFamily,
  colors,
} from "./src/styles";

function AppContent() {
  const { identity, isLoading, token } =
    useAuth();

  const [activeTab, setActiveTab] = useState("now");
  const [requestedLiveId, setRequestedLiveId] =
    useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] =
    useState<string | null>(null);
  const [
    notificationsVisible,
    setNotificationsVisible,
  ] = useState(false);
  const [
    unreadNotifications,
    setUnreadNotifications,
  ] = useState(0);
  const [
    notificationRefreshKey,
    setNotificationRefreshKey,
  ] = useState(0);
  const emitStartLiveRef =
    useRef<(() => void) | null>(null);
  const [emitIsLive, setEmitIsLive] =
    useState(false);
  const [
    emitIsConnecting,
    setEmitIsConnecting,
  ] = useState(false);
  const [
    emitCameraReady,
    setEmitCameraReady,
  ] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    document.body.style.fontFamily =
      appFontFamily;
  }, []);

  const refreshUnreadNotifications =
    useCallback(async () => {
      if (!token) {
        setUnreadNotifications(0);
        setAlliveBadgeCount(0);
        return;
      }

      try {
        const result =
          await getUnreadNotificationCount(
            token,
          );

        setUnreadNotifications(
          result.count,
        );
        setAlliveBadgeCount(
          result.count,
        );
      } catch (error) {
        console.warn(
          "No se pudo actualizar el badge de notificaciones:",
          error,
        );
      }
    }, [token]);

  const openLive = useCallback(
    (liveId: string) => {
      setRequestedLiveId(liveId);
      setSelectedUserId(null);
      setNotificationsVisible(false);
      setActiveTab("now");
    },
    [],
  );

  const openUser = useCallback(
    (userId: string) => {
      setSelectedUserId(userId);
      setNotificationsVisible(false);
    },
    [],
  );

  const openNotificationTarget =
    useCallback(
      (
        target:
          | AlliveNotificationTarget
          | NotificationNavigationTarget,
      ) => {
        if (
          "notificationId" in target &&
          target.notificationId &&
          token
        ) {
          void markNotificationRead(
            token,
            target.notificationId,
          )
            .then(() =>
              refreshUnreadNotifications(),
            )
            .catch(() => undefined);
        }

        if (target.type === "LIVE") {
          openLive(target.id);
          return;
        }

        openUser(target.id);
      },
      [
        openLive,
        openUser,
        token,
        refreshUnreadNotifications,
      ],
    );

  useEffect(() => {
    if (!token) {
      setUnreadNotifications(0);
      setAlliveBadgeCount(0);
      return;
    }

    void refreshUnreadNotifications();

    void registerForAllivePushNotifications(
      token,
    ).catch((error) => {
      console.warn(
        "No se pudo registrar el dispositivo para push:",
        error,
      );
    });
  }, [
    token,
    refreshUnreadNotifications,
  ]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const interval = setInterval(
      () => {
        void refreshUnreadNotifications();
      },
      15000,
    );

    return () => {
      clearInterval(interval);
    };
  }, [
    token,
    refreshUnreadNotifications,
  ]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const subscription =
      AppState.addEventListener(
        "change",
        (state) => {
          if (state === "active") {
            void refreshUnreadNotifications();
          }
        },
      );

    return () => {
      subscription.remove();
    };
  }, [
    token,
    refreshUnreadNotifications,
  ]);

  useEffect(() => {
    return addAlliveNotificationListeners(
      {
        onReceived: () => {
          setNotificationRefreshKey(
            (current) => current + 1,
          );
          void refreshUnreadNotifications();
        },
        onResponse: (target) => {
          void refreshUnreadNotifications();
          openNotificationTarget(target);
        },
      },
    );
  }, [
    openNotificationTarget,
    refreshUnreadNotifications,
  ]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator color={colors.accent} />
      </SafeAreaView>
    );
  }

  if (!identity) {
    return <AuthScreen />;
  }

  function changeTab(tab: string) {
    setSelectedUserId(null);
    setNotificationsVisible(false);

    if (tab !== "now") {
      setRequestedLiveId(null);
    }

    setActiveTab(tab);
  }

  function handleEmitStatusChange(status: {
    isLive: boolean;
    isConnecting: boolean;
    cameraReady: boolean;
  }) {
    setEmitIsLive(status.isLive);
    setEmitIsConnecting(
      status.isConnecting,
    );
    setEmitCameraReady(
      status.cameraReady,
    );
  }

  function handleEmitStartReady(
    startLive: (() => void) | null,
  ) {
    emitStartLiveRef.current =
      startLive;
  }

  function renderScreen() {
    if (notificationsVisible) {
      return (
        <NotificationsScreen
          onBack={() => {
            setNotificationsVisible(false);
          }}
          onOpenTarget={
            openNotificationTarget
          }
          onUnreadChanged={() => {
            void refreshUnreadNotifications();
          }}
          refreshKey={
            notificationRefreshKey
          }
        />
      );
    }

    if (selectedUserId) {
      return (
        <UserProfileScreen
          userId={selectedUserId}
          onBack={() => {
            setSelectedUserId(null);
          }}
        />
      );
    }

    if (activeTab === "now") {
      return (
        <NowScreen
          requestedLiveId={
            requestedLiveId
          }
          onOpenUser={openUser}
        />
      );
    }

    if (activeTab === "map") {
      return <MapScreen />;
    }

    if (activeTab === "emit") {
      return (
        <EmitScreen
          onStatusChange={
            handleEmitStatusChange
          }
          onStartLiveReady={
            handleEmitStartReady
          }
        />
      );
    }

    if (activeTab === "search") {
      return (
        <SearchScreen
          onOpenLive={openLive}
          onOpenUser={openUser}
        />
      );
    }

    if (activeTab === "profile") {
      return (
        <ProfileScreen
          unreadNotifications={
            unreadNotifications
          }
          onOpenNotifications={() => {
            setNotificationsVisible(true);
          }}
        />
      );
    }

    return <NowScreen requestedLiveId={requestedLiveId} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {activeTab === "emit" &&
      emitIsLive ? null : (
        <BottomNav
          activeTab={activeTab}
          onTabPress={changeTab}
          emitCanStart={emitCameraReady}
          emitIsConnecting={
            emitIsConnecting
          }
          onEmitStart={
            activeTab === "emit"
              ? () => {
                  emitStartLiveRef
                    .current?.();
                }
              : undefined
          }
        />
      )}
    </SafeAreaView>
  );
}

function configureDefaultTypography() {
  const defaultText =
    Text as unknown as {
      defaultProps?: {
        style?: unknown;
        allowFontScaling?: boolean;
      };
    };
  const defaultTextInput =
    TextInput as unknown as {
      defaultProps?: {
        style?: unknown;
        allowFontScaling?: boolean;
      };
    };

  defaultText.defaultProps =
    defaultText.defaultProps ?? {};
  defaultTextInput.defaultProps =
    defaultTextInput.defaultProps ?? {};

  defaultText.defaultProps.style = [
    {
      fontFamily: appFontFamily,
    },
    defaultText.defaultProps.style,
  ];
  defaultTextInput.defaultProps.style = [
    {
      fontFamily: appFontFamily,
    },
    defaultTextInput.defaultProps.style,
  ];
}

configureDefaultTypography();

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
