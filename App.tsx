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
  BlurTargetView,
} from "expo-blur";

import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  AuthProvider,
  useAuth,
} from "./src/auth/AuthContext";

import {
  AppOverlayLayout,
} from "./src/components/layout";

import {
  getUnreadNotificationCount,
  markNotificationRead,
  type AlliveNotificationTarget,
} from "./src/api/notificationsApi";

import {
  AlliveLoadingScreen,
} from "./src/components/loading/AlliveLoadingScreen";

import {
  BottomNav,
} from "./src/components/navigation/BottomNav";

import {
  PersistentTabScreens,
} from "./src/navigation/PersistentTabScreens";

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

import type {
  EmitScreenControls,
  EmitScreenStatus,
} from "./src/screens/EmitScreen/emitScreen.types";

import {
  NotificationsScreen,
} from "./src/screens/NotificationsScreen";

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

  const blurTargetRef =
    useRef<View | null>(null);

  const [
    unreadNotifications,
    setUnreadNotifications,
  ] = useState(0);

  const [
    notificationRefreshKey,
    setNotificationRefreshKey,
  ] = useState(0);

  const [
    videoViewerMode,
    setVideoViewerMode,
  ] = useState<
    "live" | "replay" | null
  >(null);

  const emitStartLiveRef =
    useRef<(() => void) | null>(null);

  const emitFinishLiveRef =
    useRef<(() => void) | null>(null);

  const emitToggleMicrophoneRef =
    useRef<(() => void) | null>(null);

  const emitSwitchCameraRef =
    useRef<(() => void) | null>(null);

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

  const [
    emitMicrophoneEnabled,
    setEmitMicrophoneEnabled,
  ] = useState(true);

  useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    document.body.style.fontFamily =
      appFontFamily;
  }, []);

  const refreshUnreadNotifications =
    useCallback(
      async () => {
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
      },
      [token],
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
            .catch(
              () => undefined,
            );
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
      return;
    }

    void registerForAllivePushNotifications(
      token,
    );
  }, [token]);

  useEffect(() => {
    void refreshUnreadNotifications();
  }, [refreshUnreadNotifications]);

  useEffect(() => {
    const subscription =
      AppState.addEventListener(
        "change",
        (nextState) => {
          if (nextState === "active") {
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
    return addAlliveNotificationListeners({
      onReceived: () => {
        setNotificationRefreshKey(
          (current) => current + 1,
        );

        void refreshUnreadNotifications();
      },

      onResponse: (target) => {
        void refreshUnreadNotifications();

        openNotificationTarget(
          target,
        );
      },
    });
  }, [
    openNotificationTarget,
    refreshUnreadNotifications,
  ]);

  if (isLoading) {
    return <AlliveLoadingScreen />;
  }

  if (!identity) {
    return <AuthScreen />;
  }

  function handleEmitStatusChange(
    status: EmitScreenStatus,
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

    setEmitMicrophoneEnabled(
      status.microphoneEnabled,
    );
  }

  function handleEmitStartReady(
    startLive: (() => void) | null,
  ) {
    emitStartLiveRef.current =
      startLive;
  }

  function handleEmitFinishReady(
    finishLive: (() => void) | null,
  ) {
    emitFinishLiveRef.current =
      finishLive;
  }

  function handleEmitControlsReady(
    controls: EmitScreenControls | null,
  ) {
    emitToggleMicrophoneRef.current =
      controls?.toggleMicrophone ??
      null;

    emitSwitchCameraRef.current =
      controls?.switchCamera ??
      null;
  }

  function renderForegroundScreen() {
    if (notificationsVisible) {
      return (
        <NotificationsScreen
          onBack={goBack}
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
          onBack={goBack}
        />
      );
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
          onFinishLiveReady={
            handleEmitFinishReady
          }
          onControlsReady={
            handleEmitControlsReady
          }
          onClose={goBack}
        />
      );
    }

    return null;
  }

  const foregroundScreen =
    renderForegroundScreen();

  const showPersistentTabs =
    !foregroundScreen &&
    activeTab !== "emit";

  const isEmitting =
    activeTab === "emit" &&
    !notificationsVisible &&
    !selectedUserId;

  const isLiveViewer =
    showPersistentTabs &&
    videoViewerMode === "live";

  const isReplayViewer =
    showPersistentTabs &&
    videoViewerMode === "replay";

const reserveBottomSpace =
  !isEmitting &&
  !isLiveViewer &&
  !isReplayViewer;

const bottomNavMode =
  isEmitting
    ? "emit"
    : isLiveViewer || isReplayViewer
      ? "live"
      : "main";

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top"]}
    >
      <BlurTargetView
        ref={blurTargetRef}
        style={styles.content}
      >
        <AppOverlayLayout
          reserveBottomSpace={
            reserveBottomSpace
          }
          replayMode={
            isReplayViewer
          }
          bottomControls={
            <BottomNav
              mode={bottomNavMode}
              blurTarget={
                blurTargetRef
              }
              activeTab={
                activeTab
              }
              onTabPress={
                changeTab
              }
              emitCanStart={
                emitCameraReady
              }
              emitIsLive={
                emitIsLive
              }
              emitIsConnecting={
                emitIsConnecting
              }
              emitMicrophoneEnabled={
                emitMicrophoneEnabled
              }
              onEmitFinish={
                isEmitting
                  ? () => {
                      emitFinishLiveRef
                        .current?.();
                    }
                  : undefined
              }
              onEmitStart={
                isEmitting
                  ? () => {
                      emitStartLiveRef
                        .current?.();
                    }
                  : undefined
              }
              onEmitToggleMicrophone={
                isEmitting
                  ? () => {
                      emitToggleMicrophoneRef
                        .current?.();
                    }
                  : undefined
              }
              onEmitSwitchCamera={
                isEmitting
                  ? () => {
                      emitSwitchCameraRef
                        .current?.();
                    }
                  : undefined
              }
            />
          }
        >
          <View
            style={{
              flex: 1,
              display: showPersistentTabs
                ? "flex"
                : "none",
            }}
          >
            <PersistentTabScreens
              activeTab={
                activeTab
              }
              requestedLiveId={
                requestedLiveId
              }
              requestedReplayId={
                requestedReplayId
              }
              onVideoViewerVisibleChange={
                setVideoViewerMode
              }
              unreadNotifications={
                unreadNotifications
              }
              onChangeTab={
                changeTab
              }
              onOpenLive={
                openLive
              }
              onOpenReplay={
                openReplay
              }
              onCloseRequestedVideo={
                goBack
              }
              onOpenUser={
                openUser
              }
              onOpenNotifications={
                openNotifications
              }
            />
          </View>

          {foregroundScreen}
        </AppOverlayLayout>
      </BlurTargetView>
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
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}