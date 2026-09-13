// src/components/navigation/BottomNav/BottomNavEmit.tsx
import { Pressable, Text, View } from "react-native";
import { styles } from "./bottomNav.styles";

type BottomNavEmitProps = { startMode: boolean; canStart: boolean; isConnecting: boolean; onPress: () => void };

export function BottomNavEmit({ startMode, canStart, isConnecting, onPress }: BottomNavEmitProps) {
  const disabled = startMode && (!canStart || isConnecting);
  const label = startMode ? (isConnecting ? "INICIANDO" : canStart ? "INICIAR" : "PREPARANDO") : "EMITIR";

  return (
    <Pressable style={[styles.emitWrapper, startMode && styles.emitWrapperActive]} disabled={disabled} onPress={onPress}>
      <View style={[styles.emitButton, startMode && styles.emitButtonStart, disabled && styles.emitButtonDisabled]}>
        <View style={styles.emitInner}><View style={styles.emitDot} /></View>
      </View>
      <Text style={styles.emitLabel}>{label}</Text>
    </Pressable>
  );
}
