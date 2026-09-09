// src/components/live/useViewerCounter.ts

import { useRef, useState } from "react";
import { Animated } from "react-native";

import type { Participant, Room } from "livekit-client";

function getParticipantRole(participant: Participant) {
  const attributeRole = participant.attributes?.role;

  if (attributeRole === "viewer" || attributeRole === "broadcaster") {
    return attributeRole;
  }

  if (participant.metadata) {
    try {
      const parsed = JSON.parse(participant.metadata);

      if (parsed?.role === "viewer" || parsed?.role === "broadcaster") {
        return parsed.role;
      }
    } catch {
      // Fallback a identity.
    }
  }

  if (participant.identity.startsWith("viewer-")) {
    return "viewer";
  }

  if (participant.identity.startsWith("broadcaster-")) {
    return "broadcaster";
  }

  return null;
}

export function useViewerCounter() {
  const previousViewerCountRef = useRef(0);
  const hasViewerCountRef = useRef(false);
  const viewerDeltaAnimation = useRef(new Animated.Value(0)).current;

  const [viewers, setViewers] = useState(0);
  const [viewerDelta, setViewerDelta] = useState<number | null>(null);

  function resetViewerCounter() {
    previousViewerCountRef.current = 0;
    hasViewerCountRef.current = false;

    setViewers(0);
    setViewerDelta(null);

    viewerDeltaAnimation.setValue(0);
  }

  function applyViewerCount(nextCount: number) {
    const previousCount = previousViewerCountRef.current;

    setViewers(nextCount);

    if (!hasViewerCountRef.current) {
      hasViewerCountRef.current = true;
      previousViewerCountRef.current = nextCount;
      return;
    }

    const delta = nextCount - previousCount;

    previousViewerCountRef.current = nextCount;

    if (delta === 0) {
      return;
    }

    setViewerDelta(delta);

    viewerDeltaAnimation.stopAnimation();
    viewerDeltaAnimation.setValue(0);

    Animated.sequence([
      Animated.timing(viewerDeltaAnimation, {
        toValue: 1,
        duration: 160,
        useNativeDriver: false,
      }),
      Animated.delay(650),
      Animated.timing(viewerDeltaAnimation, {
        toValue: 0,
        duration: 220,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setViewerDelta(null);
    });
  }

  function updateViewerCount(room: Room) {
    let viewerCount = 0;

    room.remoteParticipants.forEach((participant) => {
      if (getParticipantRole(participant) === "viewer") {
        viewerCount += 1;
      }
    });

    applyViewerCount(viewerCount);
  }

  const deltaOpacity = viewerDeltaAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const deltaTranslateY = viewerDeltaAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [6, 0],
  });

  const badgeScale = viewerDeltaAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  return {
    viewers,
    viewerDelta,
    viewerAnimations: {
      badgeScale,
      deltaOpacity,
      deltaTranslateY,
    },
    resetViewerCounter,
    updateViewerCount,
  };
}
