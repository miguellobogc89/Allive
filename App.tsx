// App.tsx

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AppState,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  AuthProvider,
  useAuth,
} from "./src/auth/AuthContext";

import {
  getUnreadNotificationCount,
  markNotificationRead,
  type AlliveNotificationTarget,
} from "./src/api/notificationsApi";

import {
  BottomNav,
} from "./src/components/navigation/BottomNav";

import {
  AlliveLoadingScreen,
} from "./src/components/loading/AlliveLoadingScreen";

import {
  useAppNavigation,
} from "./src/navigation/useAppNavigation";

import {
  addAlliveNotificationListeners,
  registerForAllivePushNotifications,
  setAlliveBadgeCount,
  type NotificationNavigationTarget,
} from "./src/notifications/alliveNotifications";

import {
  AuthScreen,
} from "./src/screens/AuthScreen";

import {
  EmitScreen,
} from "./src/screens/EmitScreen";

import {
  MapScreen,
} from "./src/screens/MapScreen";

import {
  NowScreen,
} from "./src/screens/NowScreen";

import {
  NotificationsScreen,
} from "./src/screens/NotificationsScreen";

import {
  ProfileScreen,
} from "./src/screens/ProfileScreen";

import {
  SearchScreen,
} from "./src/screens/SearchScreen";

import {
  UserProfileScreen,
} from "./src/screens/UserProfileScreen";

import {
  appStyles as styles,
} from "./src/styles/app.styles";

import {
  appFontFamily,
} from "./src/styles";

function AppContent() {
  const {
    identity,
    isLoading,
    token,
  } = useAuth();

  const {
    activeTab,

    selectedUserId,

    notificationsVisible,

    requestedLiveId,

    requestedReplayId,

    changeTab,

    openLive,

    openReplay,

    openUser,

    openNotifications,

    goBack,
  } = useAppNavigation();

  const [
    unreadNotifications,
    setUnreadNotifications,
  ] = useState(0);

  const [
    notificationRefreshKey,
    setNotificationRefreshKey,
  ] = useState(0);

  const emitStartLiveRef =
    useRef<
      (() => void) | null
    >(null);

  const [
    emitIsLive,
    setEmitIsLive,
  ] = useState(false);

  const [
    emitIsConnecting,
    setEmitIsConnecting,
  ] = useState(false);

  const [
    emitCameraReady,
    setEmitCameraReady,
  ] = useState(false);

  useEffect(() => {
    if (
      Platform.OS !== "web"
    ) {
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

  const openNotificationTarget =
    useCallback(
      (
        target:
          | AlliveNotificationTarget
          | NotificationNavigationTarget,
      ) => {
        if (
          "notificationId" in
            target &&
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
            .catch(
              () => undefined,
            );
        }

        if (
          target.type === "LIVE"
        ) {
          openLive(
            target.id,
          );

          return;
        }

        openUser(
          target.id,
        );
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

    const interval =
      setInterval(() => {
        void refreshUnreadNotifications();
      }, 15000);

    return () => {
      clearInterval(
        interval,
      );
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
          if (
            state === "active"
          ) {
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
            (current) =>
              current + 1,
          );

          void refreshUnreadNotifications();
        },

        onResponse: (
          target,
        ) => {
          void refreshUnreadNotifications();

          openNotificationTarget(
            target,
          );
        },
      },
    );
  }, [
    openNotificationTarget,
    refreshUnreadNotifications,
  ]);

  if (isLoading) {
    return (
      <AlliveLoadingScreen />
    );
  }

  if (!identity) {
    return (
      <AuthScreen />
    );
  }

  function handleEmitStatusChange(
    status: {
      isLive: boolean;
      isConnecting: boolean;
      cameraReady: boolean;
    },
  ) {
    setEmitIsLive(
      status.isLive,
    );

    setEmitIsConnecting(
      status.isConnecting,
    );

    setEmitCameraReady(
      status.cameraReady,
    );
  }

  function handleEmitStartReady(
    startLive:
      | (() => void)
      | null,
  ) {
    emitStartLiveRef.current =
      startLive;
  }

  function renderScreen() {
    if (
      notificationsVisible
    ) {
      return (
        <NotificationsScreen
          onBack={
            goBack
          }
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

    if (
      selectedUserId
    ) {
      return (
        <UserProfileScreen
          userId={
            selectedUserId
          }
          onBack={
            goBack
          }
        />
      );
    }

    if (
      activeTab === "now"
    ) {
      return (
        <NowScreen
          requestedLiveId={
            requestedLiveId
          }
          requestedReplayId={
            requestedReplayId
          }
          onOpenUser={
            openUser
          }
        />
      );
    }

    if (
      activeTab === "map"
    ) {
      return (
        <MapScreen />
      );
    }

    if (
      activeTab === "emit"
    ) {
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

    if (
      activeTab === "search"
    ) {
      return (
      <SearchScreen
        onOpenLive={
          openLive
        }
        onOpenReplay={
          openReplay
        }
        onOpenUser={
          openUser
        }
        onBack={
          goBack
        }
      />
      );
    }

    if (
      activeTab === "profile"
    ) {
      return (
        <ProfileScreen
          unreadNotifications={
            unreadNotifications
          }
          onOpenNotifications={
            openNotifications
          }
        />
      );
    }

    return (
      <NowScreen
        requestedLiveId={
          requestedLiveId
        }
        requestedReplayId={
          requestedReplayId
        }
        onOpenUser={
          openUser
        }
      />
    );
  }

  return (
    <SafeAreaView
      style={
        styles.container
      }
      edges={[
        "top",
      ]}
    >
      <View
        style={
          styles.content
        }
      >
        {renderScreen()}
      </View>

      {activeTab ===
        "emit" &&
      emitIsLive ? null : (
        <BottomNav
          activeTab={
            activeTab
          }
          onTabPress={
            changeTab
          }
          emitCanStart={
            emitCameraReady
          }
          emitIsConnecting={
            emitIsConnecting
          }
          onEmitStart={
            activeTab ===
            "emit"
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
    defaultText.defaultProps ??
    {};

  defaultTextInput.defaultProps =
    defaultTextInput.defaultProps ??
    {};

  defaultText.defaultProps.style =
    [
      {
        fontFamily:
          appFontFamily,
      },

      defaultText
        .defaultProps.style,
    ];

  defaultTextInput.defaultProps.style =
    [
      {
        fontFamily:
          appFontFamily,
      },

      defaultTextInput
        .defaultProps.style,
    ];
}

configureDefaultTypography();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
