// src/components/navigation/BottomNav/BottomNav.tsx
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { type AppTab } from "../../../navigation/navigation.types";
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
};

export function BottomNav({ activeTab, onTabPress, emitCanStart = true, emitIsConnecting = false, onEmitStart }: BottomNavProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { height: 66 + insets.bottom, paddingBottom: Math.max(insets.bottom, 8) }]}>
      {bottomNavItems.map((item) => {
        if (item.id === "emit") {
          const startMode = activeTab === "emit" && Boolean(onEmitStart);
          return (
            <BottomNavEmit
              key={item.id}
              startMode={startMode}
              canStart={emitCanStart}
              isConnecting={emitIsConnecting}
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

        return <BottomNavTab key={item.id} item={item} isActive={activeTab === item.id} onPress={() => onTabPress(item.id)} />;
      })}
    </View>
  );
}
