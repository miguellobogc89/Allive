// src/components/navigation/BottomNav/BottomNavEmitBorder.tsx

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
  RadialGradient,
  Rect,
  Stop,
  Svg,
} from "react-native-svg";

type Size = {
  width: number;
  height: number;
};

export function BottomNavEmitBorder() {
  const [size, setSize] =
    useState<Size>({
      width: 0,
      height: 0,
    });

  const uniqueId =
    useId().replace(/:/g, "");

  const topLeftId =
    `emitTopLeft-${uniqueId}`;

  const bottomRightId =
    `emitBottomRight-${uniqueId}`;

  function handleLayout(
    event: LayoutChangeEvent,
  ) {
    const {
      width,
      height,
    } = event.nativeEvent.layout;

    setSize({
      width,
      height,
    });
  }

  const inset = 0.35;
  const borderWidth =
    Math.max(
      0,
      size.width - inset * 2,
    );
  const borderHeight =
    Math.max(
      0,
      size.height - inset * 2,
    );
  const curve =
    Math.min(
      14,
      borderWidth / 2,
      borderHeight / 2,
    );

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
      {borderWidth > 0 &&
      borderHeight > 0 ? (
        <Svg
          width={size.width}
          height={size.height}
        >
          <Defs>
            <RadialGradient
              id={topLeftId}
              cx={curve * 0.75}
              cy={inset}
              rx={34}
              ry={26}
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0"
                stopColor="#FFFFFF"
                stopOpacity={0.82}
              />
              <Stop
                offset="0.4"
                stopColor="#FFFFFF"
                stopOpacity={0.3}
              />
              <Stop
                offset="1"
                stopColor="#FFFFFF"
                stopOpacity={0}
              />
            </RadialGradient>

            <RadialGradient
              id={bottomRightId}
              cx={
                inset +
                borderWidth -
                curve * 0.75
              }
              cy={
                inset +
                borderHeight
              }
              rx={30}
              ry={24}
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0"
                stopColor="#FFFFFF"
                stopOpacity={0.28}
              />
              <Stop
                offset="0.45"
                stopColor="#FFFFFF"
                stopOpacity={0.08}
              />
              <Stop
                offset="1"
                stopColor="#FFFFFF"
                stopOpacity={0}
              />
            </RadialGradient>
          </Defs>

          <Rect
            x={inset}
            y={inset}
            width={borderWidth}
            height={borderHeight}
            rx={curve}
            fill="none"
            stroke={`url(#${topLeftId})`}
            strokeWidth={1.4}
          />

          <Rect
            x={inset}
            y={inset}
            width={borderWidth}
            height={borderHeight}
            rx={curve}
            fill="none"
            stroke={`url(#${bottomRightId})`}
            strokeWidth={1}
          />
        </Svg>
      ) : null}
    </View>
  );
}