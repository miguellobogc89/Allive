// src/screens/EmitScreen.web.tsx

import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Room, RoomEvent } from "livekit-client";
import { useAuth } from "../auth/AuthContext";

import { LiveBroadcastControls } from "../components/live/LiveBroadcastControls";
import { LiveBroadcastError } from "../components/live/LiveBroadcastError";
import { LiveBroadcastHeader } from "../components/live/LiveBroadcastHeader";
import { LiveBroadcastMetadataPanel } from "../components/live/LiveBroadcastMetadataPanel";
import { LiveBroadcastSurface } from "../components/live/LiveBroadcastSurface.web";
import {
  startLiveThumbnailCapture,
  type LiveThumbnailCaptureController,
} from "../components/live/thumbnail";
import {
  getBroadcasterToken,
  markLiveAsEnded,
  registerLiveInBackend,
  updateLiveMetadata,
} from "../components/live/liveBroadcastApi";
import {
  attachLiveCamera,
  attachPreviewStream,
  detachLiveVideo,
  getAttachedVideoTrack,
  stopPreviewStream,
} from "../components/live/liveBroadcastVideo.web";
import { useBroadcastLocation } from "../components/live/useBroadcastLocation.web";
import { useViewerCounter } from "../components/live/useViewerCounter";
import { colors } from "../styles";

function createLiveRoomName() {
  return `live-${Date.now()}`;
}

export function EmitScreen() {
  const roomRef = useRef<Room | null>(null);
  const localVideoRef = useRef<HTMLDivElement | null>(null);
  const previewStreamRef = useRef<MediaStream | null>(null);
  const previewVideoElementRef = useRef<HTMLVideoElement | null>(null);
  const liveVideoElementRef = useRef<HTMLVideoElement | null>(null);
  const liveSessionIdRef = useRef<string | null>(null);

  const thumbnailCaptureRef =
    useRef<LiveThumbnailCaptureController | null>(null);

  const { token } = useAuth();

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [liveRoomName, setLiveRoomName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [eventName, setEventName] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingEvent, setEditingEvent] = useState(false);

  const { location, locationStatus } = useBroadcastLocation();

  const {
    viewers,
    viewerDelta,
    viewerAnimations,
    resetViewerCounter,
    updateViewerCount,
  } = useViewerCounter();

  useEffect(() => {
    let cancelled = false;

    async function preparePreview() {
      try {
        setCameraError(null);

        if (
          !navigator.mediaDevices ||
          !navigator.mediaDevices.getUserMedia
        ) {
          throw new Error(
            "El navegador no permite acceder a la cámara.",
          );
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        previewStreamRef.current = stream;

        if (localVideoRef.current) {
          previewVideoElementRef.current = attachPreviewStream(
            localVideoRef.current,
            stream,
          );
        }

        setCameraReady(true);
      } catch (caughtError) {
        console.error(
          "Error preparando preview:",
          caughtError,
        );

        setCameraError(
          "No se ha podido acceder a la cámara o al micrófono.",
        );
      }
    }

    preparePreview();

    return () => {
      cancelled = true;

      stopThumbnailCapture();

      roomRef.current?.disconnect();

      clearPreview();
      clearLiveVideo();
    };
  }, []);

  function clearPreview() {
    stopPreviewStream(
      previewStreamRef.current,
      previewVideoElementRef.current,
    );

    previewStreamRef.current = null;
    previewVideoElementRef.current = null;
  }

  function clearLiveVideo() {
    detachLiveVideo(liveVideoElementRef.current);

    liveVideoElementRef.current = null;
  }

  function stopThumbnailCapture() {
    thumbnailCaptureRef.current?.stop();
    thumbnailCaptureRef.current = null;
  }

  async function restorePreview() {
    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setCameraReady(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      previewStreamRef.current = stream;

      if (localVideoRef.current) {
        previewVideoElementRef.current = attachPreviewStream(
          localVideoRef.current,
          stream,
        );
      }

      setCameraReady(true);
      setCameraError(null);
    } catch (caughtError) {
      console.error(
        "No se pudo restaurar preview:",
        caughtError,
      );

      setCameraReady(false);

      setCameraError(
        "No se ha podido volver a activar la cámara.",
      );
    }
  }

  async function endRegisteredLive() {
    const liveSessionId = liveSessionIdRef.current;
    const authToken = token;

    if (!liveSessionId) {
      return;
    }

    if (!authToken) {
      throw new Error(
        "La sesión de usuario ya no está disponible.",
      );
    }

    await markLiveAsEnded(
      liveSessionId,
      authToken,
    );

    liveSessionIdRef.current = null;
  }

  async function saveLiveMetadata(
    nextTitle: string,
    nextEventName: string,
  ) {
    const liveSessionId = liveSessionIdRef.current;
    const authToken = token;

    if (!liveSessionId) {
      return;
    }

    if (!authToken) {
      setError(
        "La sesión de usuario ya no está disponible.",
      );

      return;
    }

    try {
      await updateLiveMetadata(
        liveSessionId,
        {
          title: nextTitle,
          eventName: nextEventName,
          location,
        },
        authToken,
      );
    } catch (caughtError) {
      console.error(caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No se pudieron guardar los cambios del LIVE.",
      );
    }
  }

  async function startLive() {
    const authToken = token;

    if (!authToken) {
      setError(
        "Debes iniciar sesión para emitir.",
      );

      return;
    }

    if (!cameraReady) {
      setError(
        "La cámara todavía no está preparada.",
      );

      return;
    }

    let room: Room | null = null;

    try {
      setError(null);
      setIsConnecting(true);

      resetViewerCounter();

      const roomName = createLiveRoomName();

      setLiveRoomName(roomName);

      console.log(
        "Allive creando LIVE:",
        roomName,
      );

      const {
        serverUrl,
        participantToken,
      } = await getBroadcasterToken(
        roomName,
        authToken,
      );

      /*
       * Liberamos Camo/getUserMedia antes de
       * pedir la cámara desde LiveKit.
       */
      clearPreview();
      setCameraReady(false);

      room = new Room({
        adaptiveStream: false,
        dynacast: false,
      });

      roomRef.current = room;

      const updateCount = () => {
        if (room) {
          updateViewerCount(room);
        }
      };

      room.on(
        RoomEvent.ParticipantConnected,
        updateCount,
      );

      room.on(
        RoomEvent.ParticipantDisconnected,
        updateCount,
      );

      room.on(
        RoomEvent.ParticipantAttributesChanged,
        updateCount,
      );

      room.on(
        RoomEvent.ParticipantMetadataChanged,
        updateCount,
      );

      await room.connect(
        serverUrl,
        participantToken,
      );

      console.log(
        "Allive broadcaster conectado a LiveKit:",
        roomName,
      );

      /*
       * Publicamos cámara y micrófono.
       */
      await room.localParticipant.setCameraEnabled(
        true,
      );

      await room.localParticipant.setMicrophoneEnabled(
        true,
      );

      console.log(
        "Allive cámara y micrófono publicados:",
        roomName,
      );

      if (!localVideoRef.current) {
        throw new Error(
          "No se ha podido preparar el preview del LIVE.",
        );
      }

      liveVideoElementRef.current =
        attachLiveCamera(
          room,
          localVideoRef.current,
        );

      /*
       * Solo registramos en Neon cuando LiveKit
       * ya está conectado y publicando.
       */
      liveSessionIdRef.current =
        await registerLiveInBackend(
          roomName,
          {
            title,
            eventName,
            location,
          },
          authToken,
        );

      /*
       * Iniciamos el sistema independiente de thumbnails
       * cuando ya existen tanto el LIVE en Neon como
       * el elemento de vídeo real del broadcaster.
       */
      const liveSessionId =
        liveSessionIdRef.current;

      if (liveSessionId) {
        const liveVideoElement =
          liveVideoElementRef.current;

        if (!liveVideoElement) {
          throw new Error(
            "No se ha encontrado el preview activo del LIVE.",
          );
        }

        const mediaStreamTrack =
          getAttachedVideoTrack(
            liveVideoElement,
          );

        stopThumbnailCapture();

        thumbnailCaptureRef.current =
          startLiveThumbnailCapture({
            liveSessionId,
            mediaStreamTrack,
            authToken,
          });
      }

      updateViewerCount(room);

      setCameraReady(true);
      setIsLive(true);

      console.log(
        "Allive LIVE iniciado correctamente:",
        roomName,
      );
    } catch (caughtError) {
      console.error(
        "Error iniciando Allive LIVE:",
        caughtError,
      );

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No se ha podido iniciar el LIVE.",
      );

      /*
       * Detenemos primero cualquier captura pendiente
       * antes de destruir el vídeo o cerrar el LIVE.
       */
      stopThumbnailCapture();

      /*
       * Si llegamos a registrar en Neon antes
       * de algún fallo posterior, lo limpiamos.
       */
      try {
        await endRegisteredLive();
      } catch (backendError) {
        console.error(
          "No se pudo limpiar el LIVE del backend:",
          backendError,
        );
      }

      if (room) {
        try {
          await room.localParticipant.setCameraEnabled(
            false,
          );

          await room.localParticipant.setMicrophoneEnabled(
            false,
          );
        } catch {
          // Las pistas pueden no haberse creado.
        }

        room.disconnect();
      }

      roomRef.current = null;

      clearLiveVideo();

      setLiveRoomName(null);
      setIsLive(false);

      resetViewerCounter();

      await restorePreview();
    } finally {
      setIsConnecting(false);
    }
  }

  async function finishLive() {
    const room = roomRef.current;

    setError(null);

    /*
     * Primero paramos el temporizador para impedir
     * una nueva subida mientras cerramos el LIVE.
     */
    stopThumbnailCapture();

    try {
      await endRegisteredLive();
    } catch (caughtError) {
      console.error(caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No se pudo cerrar el LIVE en Allive.",
      );
    }

    if (room) {
      try {
        await room.localParticipant.setCameraEnabled(
          false,
        );

        await room.localParticipant.setMicrophoneEnabled(
          false,
        );
      } catch (caughtError) {
        console.error(
          "Error desactivando cámara/micrófono:",
          caughtError,
        );
      }

      room.disconnect();
    }

    roomRef.current = null;
    liveSessionIdRef.current = null;

    clearLiveVideo();

    setLiveRoomName(null);
    setIsLive(false);

    resetViewerCounter();

    /*
     * Al terminar volvemos al estado LISTO:
     * cámara visible, pero sin emitir.
     */
    await restorePreview();
  }

  function saveTitle() {
    setEditingTitle(false);

    if (isLive) {
      void saveLiveMetadata(
        title,
        eventName,
      );
    }
  }

  function saveEvent() {
    setEditingEvent(false);

    if (isLive) {
      void saveLiveMetadata(
        title,
        eventName,
      );
    }
  }

  return (
    <View style={styles.container}>
      <LiveBroadcastSurface
        ref={localVideoRef}
        cameraReady={cameraReady}
        cameraError={cameraError}
      />

      <LiveBroadcastHeader
        isLive={isLive}
        viewers={viewers}
        viewerDelta={viewerDelta}
        badgeScale={
          viewerAnimations.badgeScale
        }
        deltaOpacity={
          viewerAnimations.deltaOpacity
        }
        deltaTranslateY={
          viewerAnimations.deltaTranslateY
        }
      />

      <LiveBroadcastMetadataPanel
        title={title}
        eventName={eventName}
        editingTitle={editingTitle}
        editingEvent={editingEvent}
        location={location}
        locationStatus={locationStatus}
        onChangeTitle={setTitle}
        onChangeEventName={setEventName}
        onEditTitle={() =>
          setEditingTitle(true)
        }
        onEditEvent={() =>
          setEditingEvent(true)
        }
        onSaveTitle={saveTitle}
        onSaveEvent={saveEvent}
      />

      <LiveBroadcastError
        message={error}
      />

      <LiveBroadcastControls
        isLive={isLive}
        isConnecting={isConnecting}
        cameraReady={cameraReady}
        liveRoomName={liveRoomName}
        onStartLive={startLive}
        onFinishLive={finishLive}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      colors.cameraBackground,
  },
});
