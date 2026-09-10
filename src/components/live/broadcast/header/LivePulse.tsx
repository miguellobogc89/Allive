// src/components/live/broadcast/header/LivePulse.tsx

import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  View,
} from "react-native";

export function LivePulse() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [pulse]);

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.85],
  });

  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.ring,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      />
      <View style={styles.dot} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF3048",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3048",
  },
});
