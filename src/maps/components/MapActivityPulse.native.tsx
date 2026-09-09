// src/maps/components/MapActivityPulse.native.tsx

import { useEffect, useRef } from "react";
import { Animated, Pressable, View } from "react-native";
import { Marker } from "react-native-maps";

import { mapStyles } from "../styles/mapStyles";
import type { MappedLive } from "../types/mapTypes";

type MapActivityPulseProps = {
  live: MappedLive;
  onPress: (live: MappedLive) => void;
};

export function MapActivityPulse({
  live,
  onPress,
}: MapActivityPulseProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [progress]);

  const pulseStyle = {
    opacity: progress.interpolate({
      inputRange: [0, 0.75, 1],
      outputRange: [0.5, 0, 0],
    }),
    transform: [
      {
        scale: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.55, 1.35],
        }),
      },
    ],
  };

  return (
    <Marker
      coordinate={{
        latitude: live.latitude,
        longitude: live.longitude,
      }}
      tracksViewChanges={false}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`LIVE de ${live.creator.username}`}
        onPress={() => onPress(live)}
        style={mapStyles.pulseMarker}
      >
        <Animated.View
          style={[mapStyles.pulseOuter, pulseStyle]}
        />
        <View style={mapStyles.pulseCore} />
      </Pressable>
    </Marker>
  );
}
