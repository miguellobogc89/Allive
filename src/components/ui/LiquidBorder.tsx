// src/components/ui/LiquidBorder.tsx

import {
  useId,
  useState,
} from "react";
import {
  type LayoutChangeEvent,
  View,
} from "react-native";
import {
  Defs,
  Path,
  RadialGradient,
  Stop,
  Svg,
} from "react-native-svg";

type LiquidBorderProps = {
  radius?: number;
  strength?: number;
};

type Size = {
  width: number;
  height: number;
};

export function LiquidBorder({
  radius = 999,
  strength = 1,
}: LiquidBorderProps) {
  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  const uniqueId = useId().replace(/:/g, "");
  const topLeftGradientId = `topLeft-${uniqueId}`;
  const bottomRightGradientId = `bottomRight-${uniqueId}`;

  function handleLayout(event: LayoutChangeEvent) {
    const { width, height } = event.nativeEvent.layout;

    setSize({ width, height });
  }

  const inset = 0.35;
  const width = Math.max(0, size.width - inset * 2);
  const height = Math.max(0, size.height - inset * 2);
  const curve = Math.min(radius, width / 2, height / 2);

  const path =
    width > 0 && height > 0
      ? [
          `M ${inset + curve} ${inset}`,
          `H ${inset + width - curve}`,
          `A ${curve} ${curve} 0 0 1 ${inset + width} ${inset + curve}`,
          `V ${inset + height - curve}`,
          `A ${curve} ${curve} 0 0 1 ${inset + width - curve} ${inset + height}`,
          `H ${inset + curve}`,
          `A ${curve} ${curve} 0 0 1 ${inset} ${inset + height - curve}`,
          `V ${inset + curve}`,
          `A ${curve} ${curve} 0 0 1 ${inset + curve} ${inset}`,
          "Z",
        ].join(" ")
      : "";

  return (
    <View
      pointerEvents="none"
      onLayout={handleLayout}
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }}
    >
      {path ? (
        <Svg width={size.width} height={size.height}>
          <Defs>
            <RadialGradient
              id={topLeftGradientId}
              cx={curve * 0.9}
              cy={inset}
              rx={Math.max(curve * 3.2, 90)}
              ry={Math.max(height * 1.8, 60)}
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0"
                stopColor="#FFFFFF"
                stopOpacity={0.78 * strength}
              />
              <Stop
                offset="0.35"
                stopColor="#FFFFFF"
                stopOpacity={0.3 * strength}
              />
              <Stop
                offset="1"
                stopColor="#FFFFFF"
                stopOpacity={0}
              />
            </RadialGradient>

            <RadialGradient
              id={bottomRightGradientId}
              cx={inset + width - curve * 0.9}
              cy={inset + height}
              rx={Math.max(curve * 3.2, 90)}
              ry={Math.max(height * 1.8, 60)}
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0"
                stopColor="#FFFFFF"
                stopOpacity={0.3 * strength}
              />
              <Stop
                offset="0.4"
                stopColor="#FFFFFF"
                stopOpacity={0.1 * strength}
              />
              <Stop
                offset="1"
                stopColor="#FFFFFF"
                stopOpacity={0}
              />
            </RadialGradient>
          </Defs>

          <Path
            d={path}
            fill="none"
            stroke={`url(#${topLeftGradientId})`}
            strokeWidth={1.5}
          />

          <Path
            d={path}
            fill="none"
            stroke={`url(#${bottomRightGradientId})`}
            strokeWidth={1.2}
          />
        </Svg>
      ) : null}
    </View>
  );
}