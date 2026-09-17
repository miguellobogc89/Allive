// src/components/navigation/BottomNav/BottomNavMain.tsx

import {
  type AppTab,
} from "../../../navigation/navigation.types";

import {
  bottomNavItems,
} from "./bottomNav.config";

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
  compact,
}: Props) {
  return (
    <>
      {bottomNavItems.map(
        (item) => (
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
        ),
      )}
    </>
  );
}