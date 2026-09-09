// src/components/live/broadcast-overlay/LiveStatusPulse.tsx
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { colors } from "../../../styles";

export function LiveStatusPulse({ isLive }: { isLive: boolean }) {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!isLive) { pulse.stopAnimation(); pulse.setValue(0); return; }
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [isLive, pulse]);
  if (!isLive) return null;
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.9] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] });
  return <View style={styles.container} pointerEvents="none">
    <Animated.View style={[styles.ring, { opacity, transform: [{ scale }] }]} />
    <View style={styles.dot} />
  </View>;
}
const styles = StyleSheet.create({
  container:{width:28,height:28,alignItems:"center",justifyContent:"center"},
  ring:{position:"absolute",width:16,height:16,borderRadius:8,backgroundColor:colors.liveStrong},
  dot:{width:12,height:12,borderRadius:6,backgroundColor:colors.liveStrong},
});
