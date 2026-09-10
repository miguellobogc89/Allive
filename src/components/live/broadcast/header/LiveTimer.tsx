// src/components/live/broadcast/header/LiveTimer.tsx

import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text } from "react-native";

function formatElapsed(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function LiveTimer() {
  const startedAt = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    startedAt.current = Date.now();
    setElapsed(0);

    const intervalId = window.setInterval(() => {
      setElapsed(
        Math.floor(
          (Date.now() - startedAt.current) / 1000,
        ),
      );
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <Text style={styles.text}>
      {formatElapsed(elapsed)}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
});
