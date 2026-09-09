// src/screens/LiveViewerScreen.web.tsx

import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { LiveVideoSurface } from "../components/live/LiveVideoSurface.web";
import { LiveViewerOverlay } from "../components/live/LiveViewerOverlay";
import type { ActiveLive } from "../components/live/types";
import { colors } from "../styles";

const API_URL = "http://localhost:3001";
const REFRESH_INTERVAL_MS = 5000;

export function LiveViewerScreen() {
  const [lives, setLives] = useState<ActiveLive[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewerCount, setViewerCount] = useState(0);

  const activeLive = lives[currentIndex] ?? null;

  const loadActiveLives = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/lives/active`);
      if (!response.ok) throw new Error(`No se pudieron consultar los LIVE activos (${response.status})`);

      const nextLives = (await response.json()) as ActiveLive[];
      if (!Array.isArray(nextLives)) throw new Error("Respuesta inválida del servidor.");

      setLives((previousLives) => {
        if (nextLives.length === 0) return [];
        const currentLive = previousLives[currentIndex];
        if (!currentLive) return nextLives;

        const stillActiveIndex = nextLives.findIndex((live) => live.id === currentLive.id);
        if (stillActiveIndex === -1) return nextLives;

        if (stillActiveIndex !== currentIndex) {
          const reordered = [...nextLives];
          const [stillActiveLive] = reordered.splice(stillActiveIndex, 1);
          reordered.splice(Math.min(currentIndex, reordered.length), 0, stillActiveLive);
          return reordered;
        }

        return nextLives;
      });

      setCurrentIndex((index) => nextLives.length === 0 ? 0 : Math.min(index, nextLives.length - 1));
    } catch (error) {
      console.error("Allive NOW refresh error:", error);
    }
  }, [currentIndex]);

  useEffect(() => {
    loadActiveLives();
    const interval = window.setInterval(loadActiveLives, REFRESH_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [loadActiveLives]);

  const goToPreviousLive = useCallback(() => {
    setCurrentIndex((index) => lives.length <= 1 ? index : index <= 0 ? lives.length - 1 : index - 1);
  }, [lives.length]);

  const goToNextLive = useCallback(() => {
    setCurrentIndex((index) => lives.length <= 1 ? index : index >= lives.length - 1 ? 0 : index + 1);
  }, [lives.length]);

  return (
    <View style={styles.container}>
      <LiveVideoSurface live={activeLive} onViewerCountChange={setViewerCount} />
      {activeLive ? (
        <LiveViewerOverlay
          live={activeLive}
          viewerCount={viewerCount}
          currentIndex={currentIndex}
          totalLives={lives.length}
          onPreviousLive={goToPreviousLive}
          onNextLive={goToNextLive}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: "relative", backgroundColor: colors.background },
});
