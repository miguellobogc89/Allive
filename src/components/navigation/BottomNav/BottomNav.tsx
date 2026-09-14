// src/components/navigation/BottomNav/BottomNav.tsx

import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { type AppTab } from "../../../navigation/navigation.types";
import { spacing, surfaces } from "../../../styles";
import { bottomNavItems } from "./bottomNav.config";
import { BottomNavEmit } from "./BottomNavEmit";
import { BottomNavTab } from "./BottomNavTab";
import { styles } from "./bottomNav.styles";

type BottomNavProps = {
  activeTab: AppTab;
  onTabPress: (tab: AppTab) => void;
  emitCanStart?: boolean;
  emitIsConnecting?: boolean;
  onEmitStart?: () => void;
  compact?: boolean;
};

export function BottomNav({
  activeTab,
  onTabPress,
  emitCanStart = true,
  emitIsConnecting = false,
  onEmitStart,
  compact = false,
}: BottomNavProps) {
  const insets = useSafeAreaInsets();
  const pillHeight = compact ? 54 : 64;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        compact && styles.containerCompact,
        {
          height:
            pillHeight +
            insets.bottom +
            spacing.md,
          paddingBottom:
            insets.bottom + spacing.xs,
        },
      ]}
    >
      <View
        style={[
          surfaces.liquidDark,
          styles.pill,
          compact && styles.pillCompact,
        ]}
      >
        {bottomNavItems.map((item) => {
          if (item.id === "emit") {
            const startMode =
              activeTab === "emit" &&
              Boolean(onEmitStart);

            return (
              <BottomNavEmit
                key={item.id}
                startMode={startMode}
                canStart={emitCanStart}
                isConnecting={emitIsConnecting}
                compact={compact}
                onPress={() => {
                  if (startMode) {
                    onEmitStart?.();
                    return;
                  }

                  onTabPress("emit");
                }}
              />
            );
          }

          return (
            <BottomNavTab
              key={item.id}
              item={item}
              isActive={activeTab === item.id}
              compact={compact}
              onPress={() => onTabPress(item.id)}
            />
          );
        })}
      </View>
    </View>
  );
}