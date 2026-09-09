// src/components/live/LiveVideoSurface.web.tsx

import {
  Participant,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
  Track,
} from "livekit-client";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, layout, radius, spacing, typography } from "../../styles";
import type { ActiveLive } from "./types";

const API_URL = "http://localhost:3001";

type Props = {
  live: ActiveLive | null;
  onViewerCountChange?: (count: number) => void;
};

type LiveKitTokenResponse = {
  serverUrl: string;
  participantToken: string;
  role: "broadcaster" | "viewer";
};

function getParticipantRole(participant: Participant) {
  const attributeRole = participant.attributes?.role;
  if (attributeRole === "viewer" || attributeRole === "broadcaster") return attributeRole;

  if (participant.metadata) {
    try {
      const parsed = JSON.parse(participant.metadata);
      if (parsed?.role === "viewer" || parsed?.role === "broadcaster") return parsed.role;
    } catch {
      // Fallback a identity.
    }
  }

  if (participant.identity.startsWith("viewer-")) return "viewer";
  if (participant.identity.startsWith("broadcaster-")) return "broadcaster";
  return null;
}

async function getViewerToken(roomName: string): Promise<LiveKitTokenResponse> {
  const response = await fetch(`${API_URL}/api/livekit/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomName, role: "viewer" }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `No se pudo obtener el token de espectador (${response.status})`);
  }

  const data = (await response.json()) as LiveKitTokenResponse;
  if (!data.serverUrl || !data.participantToken) throw new Error("La API devolvió un token LiveKit inválido.");
  return data;
}

export function LiveVideoSurface({ live, onViewerCountChange }: Props) {
  const roomRef = useRef<Room | null>(null);
  const connectionVersionRef = useRef(0);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const audioContainerRef = useRef<HTMLDivElement | null>(null);

  const [status, setStatus] = useState("Buscando LIVE...");
  const [hasVideo, setHasVideo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    connectionVersionRef.current += 1;
    const connectionVersion = connectionVersionRef.current;
    let disposed = false;

    const clearMedia = () => {
      if (videoContainerRef.current) videoContainerRef.current.innerHTML = "";
      if (audioContainerRef.current) audioContainerRef.current.innerHTML = "";
      setHasVideo(false);
    };

    const updateViewerCount = (room: Room) => {
      let count = 1;
      room.remoteParticipants.forEach((participant) => {
        if (getParticipantRole(participant) === "viewer") count += 1;
      });
      onViewerCountChange?.(count);
    };

    const previousRoom = roomRef.current;
    if (previousRoom) previousRoom.disconnect();
    roomRef.current = null;
    clearMedia();
    onViewerCountChange?.(0);

    if (!live) {
      setStatus("No hay LIVE activos");
      return;
    }

    async function connect() {
      try {
        setError(null);
        setStatus("Conectando...");
        const { serverUrl, participantToken } = await getViewerToken(live!.roomName);

        if (disposed || connectionVersion !== connectionVersionRef.current) return;

        const room = new Room({ adaptiveStream: true, dynacast: true });
        roomRef.current = room;

        const isCurrent = () =>
          !disposed &&
          connectionVersion === connectionVersionRef.current &&
          roomRef.current === room;

        const refreshViewerCount = () => {
          if (isCurrent()) updateViewerCount(room);
        };

        const attachTrack = (
          track: RemoteTrack,
          _publication: RemoteTrackPublication,
          participant: RemoteParticipant
        ) => {
          if (!isCurrent()) return;

          console.log("Allive viewer received track:", track.kind, participant.identity, getParticipantRole(participant));

          if (track.kind === Track.Kind.Video) {
            const element = track.attach() as HTMLVideoElement;
            element.autoplay = true;
            element.playsInline = true;
            element.muted = true;
            element.style.position = "absolute";
            element.style.inset = "0";
            element.style.width = "100%";
            element.style.height = "100%";
            element.style.objectFit = "cover";

            if (videoContainerRef.current) {
              videoContainerRef.current.innerHTML = "";
              videoContainerRef.current.appendChild(element);
            }

            element.play().catch((playError) => console.error("Allive video play error:", playError));
            setHasVideo(true);
            setStatus("LIVE");
          }

          if (track.kind === Track.Kind.Audio) {
            const element = track.attach();
            element.autoplay = true;

            if (audioContainerRef.current) {
              audioContainerRef.current.innerHTML = "";
              audioContainerRef.current.appendChild(element);
            }
          }
        };

        // ÚNICO punto de attach. No recorrer remoteParticipants para adjuntar tracks.
        room.on(RoomEvent.TrackSubscribed, attachTrack);
        room.on(RoomEvent.TrackUnsubscribed, (track) => {
          track.detach().forEach((element) => element.remove());
        });
        room.on(RoomEvent.ParticipantConnected, refreshViewerCount);
        room.on(RoomEvent.ParticipantDisconnected, refreshViewerCount);
        room.on(RoomEvent.ParticipantAttributesChanged, refreshViewerCount);
        room.on(RoomEvent.ParticipantMetadataChanged, refreshViewerCount);

        room.on(RoomEvent.Disconnected, () => {
          if (!isCurrent()) return;
          setHasVideo(false);
          setStatus("LIVE finalizado");
          onViewerCountChange?.(0);
        });

        await room.connect(serverUrl, participantToken, { autoSubscribe: true });

        if (!isCurrent()) {
          room.disconnect();
          return;
        }

        setStatus("Conectado · esperando vídeo");
        updateViewerCount(room);
      } catch (caughtError) {
        if (disposed || connectionVersion !== connectionVersionRef.current) return;

        console.error("Allive NOW connection error:", caughtError);
        setError(caughtError instanceof Error ? caughtError.message : "No se ha podido conectar al LIVE.");
        setStatus("No disponible");
      }
    }

    connect();

    return () => {
      disposed = true;
      if (connectionVersion === connectionVersionRef.current) connectionVersionRef.current += 1;

      const room = roomRef.current;
      if (room) room.disconnect();
      roomRef.current = null;
      clearMedia();
    };
  }, [live?.id, live?.roomName, onViewerCountChange]);

  return (
    <View style={styles.container}>
      <div ref={videoContainerRef} style={videoStyle} />
      <div ref={audioContainerRef} />

      {!hasVideo && (
        <View style={styles.waiting}>
          <Text style={styles.status}>{status}</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const videoStyle = {
  position: "absolute" as const,
  inset: 0,
  width: "100%",
  height: "100%",
  backgroundColor: colors.background,
  overflow: "hidden",
};

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFill, backgroundColor: colors.background },
  waiting: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center" },
  status: { color: colors.textMuted, ...typography.label },
  errorBox: {
    position: "absolute",
    left: layout.liveErrorHorizontal,
    right: layout.liveErrorHorizontal,
    bottom: layout.liveErrorBottom,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.dangerSurface,
  },
  errorText: { color: colors.dangerText, ...typography.caption, fontWeight: "400" },
});
