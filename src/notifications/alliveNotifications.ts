import { Platform } from "react-native";

import { registerNotificationDeviceToken } from "../api/notificationsApi";

export type NotificationNavigationTarget = {
  type: "LIVE" | "USER";
  id: string;
  notificationId?: string;
};

type ListenerOptions = {
  onReceived: () => void;
  onResponse: (
    target: NotificationNavigationTarget,
  ) => void;
};

type ExpoNotificationsModule =
  typeof import("expo-notifications");
type ExpoConstantsModule =
  typeof import("expo-constants");

let notificationModules:
  | {
      Notifications: ExpoNotificationsModule;
      Constants: ExpoConstantsModule["default"];
    }
  | null = null;

function parseTarget(
  data: Record<string, unknown> | undefined,
): NotificationNavigationTarget | null {
  const targetType = data?.targetType;
  const targetId = data?.targetId;
  const notificationId =
    data?.notificationId;

  if (
    (targetType === "LIVE" ||
      targetType === "USER") &&
    typeof targetId === "string" &&
    targetId.length > 0
  ) {
    return {
      type: targetType,
      id: targetId,
      notificationId:
        typeof notificationId === "string"
          ? notificationId
          : undefined,
    };
  }

  return null;
}

async function loadNativeModules() {
  if (Platform.OS === "web") {
    return null;
  }

  if (!notificationModules) {
    const [
      Notifications,
      ConstantsModule,
    ] = await Promise.all([
      import("expo-notifications"),
      import("expo-constants"),
    ]);

    notificationModules = {
      Notifications,
      Constants:
        ConstantsModule.default,
    };

    Notifications.setNotificationHandler(
      {
        handleNotification:
          async () => ({
            shouldPlaySound: false,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
          }),
      },
    );
  }

  return notificationModules;
}

function getProjectId(
  Constants: ExpoConstantsModule["default"],
) {
  return (
    Constants.expoConfig?.extra?.eas
      ?.projectId ??
    Constants.easConfig?.projectId
  );
}

export async function registerForAllivePushNotifications(
  authToken: string,
) {
  const modules =
    await loadNativeModules();

  if (!modules) {
    return {
      status: "unsupported" as const,
    };
  }

  const { Notifications, Constants } =
    modules;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(
      "allive",
      {
        name: "Allive",
        importance:
          Notifications.AndroidImportance
            .MAX,
        vibrationPattern: [
          0, 180, 120, 180,
        ],
        lightColor: "#FF3B30",
      },
    );
  }

  const permissions =
    await Notifications.getPermissionsAsync();

  let finalStatus =
    permissions.status;

  if (finalStatus !== "granted") {
    const requested =
      await Notifications.requestPermissionsAsync();

    finalStatus = requested.status;
  }

  if (finalStatus !== "granted") {
    return {
      status: "denied" as const,
    };
  }

  const projectId =
    getProjectId(Constants);

  if (!projectId) {
    return {
      status: "missing-project-id" as const,
    };
  }

  const token =
    await Notifications.getExpoPushTokenAsync(
      {
        projectId,
      },
    );

  await registerNotificationDeviceToken(
    authToken,
    {
      expoPushToken: token.data,
      platform: Platform.OS,
    },
  );

  return {
    status: "registered" as const,
    expoPushToken: token.data,
  };
}

export function addAlliveNotificationListeners({
  onReceived,
  onResponse,
}: ListenerOptions) {
  if (Platform.OS === "web") {
    return () => undefined;
  }

  let cancelled = false;
  let cleanup = () => undefined;

  void loadNativeModules().then(
    (modules) => {
      if (!modules || cancelled) {
        return;
      }

      const { Notifications } = modules;
      const lastResponse =
        Notifications.getLastNotificationResponse();

      const initialTarget = parseTarget(
        lastResponse?.notification.request
          .content.data,
      );

      if (initialTarget) {
        onResponse(initialTarget);
      }

      const receivedSubscription =
        Notifications.addNotificationReceivedListener(
          () => {
            onReceived();
          },
        );

      const responseSubscription =
        Notifications.addNotificationResponseReceivedListener(
          (response) => {
            const target = parseTarget(
              response.notification.request
                .content.data,
            );

            if (target) {
              onResponse(target);
            }
          },
        );

      cleanup = () => {
        receivedSubscription.remove();
        responseSubscription.remove();
      };
    },
  );

  return () => {
    cancelled = true;
    cleanup();
  };
}

export function setAlliveBadgeCount(
  count: number,
) {
  if (Platform.OS === "web") {
    return;
  }

  void loadNativeModules()
    .then((modules) =>
      modules?.Notifications.setBadgeCountAsync(
        count,
      ),
    )
    .catch(() => undefined);
}
