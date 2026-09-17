// src/components/navigation/BottomNav/BottomNavMain.tsx

import {
  type AppTab,
} from "../../../navigation/navigation.types";

import {
  bottomNavItems,
} from "./bottomNav.config";

import {
  BottomNavEmit,
} from "./BottomNavEmit";

import {
  BottomNavTab,
} from "./BottomNavTab";

type Props = {
  activeTab: AppTab;

  onTabPress: (
    tab: AppTab,
  ) => void;

  emitCanStart: boolean;

  emitIsConnecting: boolean;

  onEmitStart?: () => void;

  compact: boolean;
};

export function BottomNavMain({
  activeTab,
  onTabPress,
  emitCanStart,
  emitIsConnecting,
  onEmitStart,
  compact,
}: Props) {
  return (
    <>
      {bottomNavItems.map(
        (item) => {
          if (
            item.id === "emit"
          ) {
            const startMode =
              activeTab ===
                "emit" &&
              Boolean(
                onEmitStart,
              );

            return (
              <BottomNavEmit
                key={item.id}
                startMode={
                  startMode
                }
                canStart={
                  emitCanStart
                }
                isConnecting={
                  emitIsConnecting
                }
                compact={
                  compact
                }
                onPress={() => {
                  if (
                    startMode
                  ) {
                    onEmitStart?.();

                    return;
                  }

                  onTabPress(
                    "emit",
                  );
                }}
              />
            );
          }

          return (
            <BottomNavTab
              key={item.id}
              item={item}
              isActive={
                activeTab ===
                item.id
              }
              compact={
                compact
              }
              onPress={() =>
                onTabPress(
                  item.id,
                )
              }
            />
          );
        },
      )}
    </>
  );
}