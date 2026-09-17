// src/screens/EmitScreen/web/EmitScreen.web.tsx

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Room,
  RoomEvent,
  Track,
} from "livekit-client";

import {
  X,
} from "lucide-react-native";

import {
  Pressable,
  StyleSheet,
} from "react-native";

import {
  createEmitPreviewStream,
} from "./emitCamera.web";

import {
  createLiveRoomName,
} from "./emitBroadcast.web";

import type {
  LocationPlace,
} from "../../../api/locationApi";

import {
  subscribeToLiveMetrics,
} from "../../../api/liveRealtimeApi";

import {
  useAuth,
} from "../../../auth/AuthContext";

import {
  LiveBroadcastStage,
} from "../../../components/live/broadcast";

import {
  LiveBroadcastSurface,
} from "../../../components/live/broadcast/LiveBroadcastSurface.web";

import type {
  LiveCommentModel,
} from "../../../components/live/comments/liveCommentTypes";

import {
  getBroadcasterToken,
  markLiveAsEnded,
  registerLiveInBackend,
  saveLiveReplay,
  startLiveRecording,
  stopLiveRecording,
  updateLiveMetadata,
} from "../../../components/live/liveBroadcastApi";

import {
  parseLiveRealtimeMessage,
} from "../../../components/live/liveRealtime";

import {
  attachLiveCamera,
  attachPreviewStream,
  detachLiveVideo,
  stopPreviewStream,
} from "../../../components/live/liveBroadcastVideo.web";

import {
  startLiveThumbnailCapture,
  type LiveThumbnailCaptureController,
} from "../../../components/live/thumbnail";

import {
  useBroadcastLocation,
} from "../../../components/live/useBroadcastLocation.web";

import {
  useViewerCounter,
} from "../../../components/live/useViewerCounter";

import type {
  EmitScreenProps,
} from "../emitScreen.types";

export function EmitScreen({
  onStatusChange,
  onStartLiveReady,
  onClose,
}: EmitScreenProps) {
  const roomRef =
    useRef<Room | null>(
      null,
    );

  const localVideoRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const previewStreamRef =
    useRef<MediaStream | null>(
      null,
    );

  const finishLivePromiseRef =
    useRef<Promise<void> | null>(
      null,
    );

  const finishedLiveSessionIdRef =
    useRef<string | null>(
      null,
    );

  const previewVideoElementRef =
    useRef<HTMLVideoElement | null>(
      null,
    );

  const liveVideoElementRef =
    useRef<HTMLVideoElement | null>(
      null,
    );

  const liveSessionIdRef =
    useRef<string | null>(
      null,
    );

  const thumbnailCaptureRef =
    useRef<LiveThumbnailCaptureController | null>(
      null,
    );

  const { token } =
    useAuth();

  const [
    cameraReady,
    setCameraReady,
  ] = useState(false);

  const [
    cameraError,
    setCameraError,
  ] = useState<string | null>(
    null,
  );

  const [
    isConnecting,
    setIsConnecting,
  ] = useState(false);

  const [
    isLive,
    setIsLive,
  ] = useState(false);

  const [
    finishModalVisible,
    setFinishModalVisible,
  ] = useState(false);

  const [
    isSavingReplay,
    setIsSavingReplay,
  ] = useState(false);

  const [
    liveSessionId,
    setLiveSessionId,
  ] = useState<
    string | null
  >(null);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  const [
    title,
    setTitle,
  ] = useState("");

  const [
    eventName,
    setEventName,
  ] = useState("");

  const [
    comments,
    setComments,
  ] = useState<
    LiveCommentModel[]
  >([]);

  const [
    likes,
    setLikes,
  ] = useState(0);

  const [
    selectedLocationPlace,
    setSelectedLocationPlace,
  ] =
    useState<LocationPlace | null>(
      null,
    );

  const { location } =
    useBroadcastLocation();

  const {
    viewers,
    resetViewerCounter,
    updateViewerCount,
  } = useViewerCounter();

  let liveLocation =
    location;

  if (
    location &&
    selectedLocationPlace
  ) {
    liveLocation = {
      latitude:
        selectedLocationPlace.latitude,
      longitude:
        selectedLocationPlace.longitude,
      placeName:
        selectedLocationPlace.name,
    };
  }

  let displayedLocationName:
    | string
    | null = null;

  if (location) {
    displayedLocationName =
      location.placeName;
  }

  if (
    selectedLocationPlace
  ) {
    displayedLocationName =
      selectedLocationPlace.name;
  }

  let locationCoordinates:
    | {
        latitude: number;
        longitude: number;
      }
    | null = null;

  if (location) {
    locationCoordinates = {
      latitude:
        location.latitude,
      longitude:
        location.longitude,
    };
  }

  useEffect(() => {
    if (!onStatusChange) {
      return;
    }

    onStatusChange({
      isLive,
      isConnecting,
      cameraReady,
    });
  }, [
    cameraReady,
    isConnecting,
    isLive,
    onStatusChange,
  ]);

  useEffect(() => {
    if (onStartLiveReady) {
      onStartLiveReady(
        () => {
          void startLive();
        },
      );
    }

    return () => {
      if (
        onStartLiveReady
      ) {
        onStartLiveReady(
          null,
        );
      }
    };
  }, [
    cameraReady,
    eventName,
    isConnecting,
    isLive,
    liveLocation,
    onStartLiveReady,
    title,
    token,
  ]);

  useEffect(() => {
    if (!liveSessionId) {
      setLikes(0);
      return;
    }

    return subscribeToLiveMetrics(
      (update) => {
        if (
          update.liveId !==
            liveSessionId ||
          typeof update.likeCount !==
            "number"
        ) {
          return;
        }

        setLikes(
          update.likeCount,
        );
      },
    );
  }, [
    liveSessionId,
  ]);

  useEffect(() => {
    let cancelled =
      false;

    async function preparePreview() {
      try {
        setCameraError(
          null,
        );

        if (
          !navigator
            .mediaDevices ||
          !navigator
            .mediaDevices
            .getUserMedia
        ) {
          throw new Error(
            "El navegador no permite acceder a la cámara.",
          );
        }

        const stream =
          await createEmitPreviewStream();

        if (cancelled) {
          stream
            .getTracks()
            .forEach(
              (track) => {
                track.stop();
              },
            );

          return;
        }

        previewStreamRef.current =
          stream;

        if (
          localVideoRef.current
        ) {
          previewVideoElementRef.current =
            attachPreviewStream(
              localVideoRef.current,
              stream,
            );
        }

        setCameraReady(
          true,
        );
      } catch (
        caughtError
      ) {
        console.error(
          "Error preparando preview:",
          caughtError,
        );

        setCameraError(
          "No se ha podido acceder a la cámara o al micrófono.",
        );
      }
    }

    void preparePreview();

    return () => {
      cancelled = true;

      stopThumbnailCapture();

      if (
        roomRef.current
      ) {
        roomRef.current.disconnect();
      }

      clearPreview();
      clearLiveVideo();
    };
  }, []);

  function clearPreview() {
    stopPreviewStream(
      previewStreamRef.current,
      previewVideoElementRef.current,
    );

    previewStreamRef.current =
      null;

    previewVideoElementRef.current =
      null;
  }

  function clearLiveVideo() {
    detachLiveVideo(
      liveVideoElementRef.current,
    );

    liveVideoElementRef.current =
      null;
  }

  function stopThumbnailCapture() {
    if (
      thumbnailCaptureRef.current
    ) {
      thumbnailCaptureRef.current.stop();
    }

    thumbnailCaptureRef.current =
      null;
  }

  async function restorePreview() {
    if (
      !navigator
        .mediaDevices ||
      !navigator
        .mediaDevices
        .getUserMedia
    ) {
      setCameraReady(
        false,
      );

      return;
    }

    try {
      const stream =
        await createEmitPreviewStream();

      previewStreamRef.current =
        stream;

      if (
        localVideoRef.current
      ) {
        previewVideoElementRef.current =
          attachPreviewStream(
            localVideoRef.current,
            stream,
          );
      }

      setCameraReady(
        true,
      );

      setCameraError(
        null,
      );
    } catch (
      caughtError
    ) {
      console.error(
        "No se pudo restaurar preview:",
        caughtError,
      );

      setCameraReady(
        false,
      );

      setCameraError(
        "No se ha podido volver a activar la cámara.",
      );
    }
  }

  async function endRegisteredLive() {
    const currentLiveSessionId =
      liveSessionIdRef.current;

    const authToken =
      token;

    if (
      !currentLiveSessionId
    ) {
      return;
    }

    if (!authToken) {
      throw new Error(
        "La sesión de usuario ya no está disponible.",
      );
    }

    await markLiveAsEnded(
      currentLiveSessionId,
      authToken,
    );

    liveSessionIdRef.current =
      null;
  }

  async function stopCurrentRecording() {
    const currentLiveSessionId =
      liveSessionIdRef.current;

    const authToken =
      token;

    if (
      !currentLiveSessionId ||
      !authToken
    ) {
      return;
    }

    try {
      await stopLiveRecording(
        currentLiveSessionId,
        authToken,
      );

      console.log(
        "Grabación LIVE detenida.",
      );
    } catch (
      caughtError
    ) {
      console.error(
        "No se pudo detener la grabación:",
        caughtError,
      );
    }
  }

  async function saveLiveMetadata(
    nextTitle: string,
    nextEventName: string,
  ) {
    const currentLiveSessionId =
      liveSessionIdRef.current;

    const authToken =
      token;

    if (
      !currentLiveSessionId
    ) {
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
        currentLiveSessionId,
        {
          title:
            nextTitle,
          eventName:
            nextEventName,
          location:
            liveLocation,
        },
        authToken,
      );
    } catch (
      caughtError
    ) {
      console.error(
        caughtError,
      );

      let message =
        "No se pudieron guardar los cambios del LIVE.";

      if (
        caughtError instanceof
        Error
      ) {
        message =
          caughtError.message;
      }

      setError(
        message,
      );
    }
  }

  async function startLive() {
    if (
      isConnecting ||
      isLive
    ) {
      return;
    }

    const authToken =
      token;

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

    let room:
      | Room
      | null = null;

    try {
      setError(null);
      setIsConnecting(
        true,
      );
      setComments([]);

      resetViewerCounter();

      const roomName =
        createLiveRoomName();

      const {
        serverUrl,
        participantToken,
      } =
        await getBroadcasterToken(
          roomName,
          authToken,
        );

      clearPreview();

      setCameraReady(
        false,
      );

      room =
        new Room({
          adaptiveStream:
            false,
          dynacast:
            false,
        });

      roomRef.current =
        room;

      const updateCount =
        () => {
          if (room) {
            updateViewerCount(
              room,
            );
          }
        };

      const handleRealtimeData =
        (
          payload:
            Uint8Array,
        ) => {
          const message =
            parseLiveRealtimeMessage(
              payload,
            );

          if (
            !message ||
            message.type !==
              "live-comment"
          ) {
            return;
          }

          setComments(
            (current) => {
              const exists =
                current.some(
                  (
                    comment,
                  ) =>
                    comment.id ===
                    message
                      .comment
                      .id,
                );

              if (exists) {
                return current;
              }

              return [
                ...current,
                message.comment,
              ];
            },
          );
        };

      room.on(
        RoomEvent
          .ParticipantConnected,
        updateCount,
      );

      room.on(
        RoomEvent
          .ParticipantDisconnected,
        updateCount,
      );

      room.on(
        RoomEvent
          .ParticipantAttributesChanged,
        updateCount,
      );

      room.on(
        RoomEvent
          .ParticipantMetadataChanged,
        updateCount,
      );

      room.on(
        RoomEvent
          .DataReceived,
        handleRealtimeData,
      );

      await room.connect(
        serverUrl,
        participantToken,
      );

      await room
        .localParticipant
        .setCameraEnabled(
          true,
        );

const cameraPublication =
  room.localParticipant
    .getTrackPublication(
      Track.Source.Camera,
    );

const cameraTrack =
  cameraPublication
    ?.track
    ?.mediaStreamTrack;

if (cameraTrack) {
  console.log(
    "📹 Calidad cámara LIVE:",
    cameraTrack.getSettings(),
  );
}

      await room
        .localParticipant
        .setMicrophoneEnabled(
          true,
        );

      if (
        !localVideoRef.current
      ) {
        throw new Error(
          "No se ha podido preparar el preview del LIVE.",
        );
      }

      liveVideoElementRef.current =
        attachLiveCamera(
          room,
          localVideoRef.current,
        );

      const registeredLiveSessionId =
        await registerLiveInBackend(
          roomName,
          {
            title,
            eventName,
            location:
              liveLocation,
          },
          authToken,
        );

      liveSessionIdRef.current =
        registeredLiveSessionId;

      setLiveSessionId(
        registeredLiveSessionId,
      );

      try {
        const recording =
          await startLiveRecording(
            registeredLiveSessionId,
            authToken,
          );

        console.log(
          "Grabación LIVE iniciada:",
          recording,
        );
      } catch (
        recordingError
      ) {

        console.error(
          "No se pudo iniciar la grabación del LIVE:",
          recordingError,
        );
      }

            const currentLiveSessionId =
        liveSessionIdRef.current;

      if (
        currentLiveSessionId
      ) {
        stopThumbnailCapture();

        thumbnailCaptureRef.current =
          startLiveThumbnailCapture({
            liveSessionId:
              currentLiveSessionId,

            getMediaStreamTrack:
              () => {
                const activeRoom =
                  roomRef.current;

                if (!activeRoom) {
                  return null;
                }

                const publication =
                  activeRoom
                    .localParticipant
                    .getTrackPublication(
                      Track.Source.Camera,
                    );

                return (
                  publication
                    ?.track
                    ?.mediaStreamTrack ??
                  null
                );
              },

            authToken,
          });
      }

      updateViewerCount(
        room,
      );

      setCameraReady(
        true,
      );

      setIsLive(
        true,
      );

      void saveLiveMetadata(
        title,
        eventName,
      );
    } catch (
      caughtError
    ) {
      console.error(
        "Error iniciando Allive LIVE:",
        caughtError,
      );

      let message =
        "No se ha podido iniciar el LIVE.";

      if (
        caughtError instanceof
        Error
      ) {
        message =
          caughtError.message;
      }

      setError(
        message,
      );

      stopThumbnailCapture();

      await stopCurrentRecording();

      try {
        await endRegisteredLive();
      } catch (
        backendError
      ) {
        console.error(
          "No se pudo limpiar el LIVE del backend:",
          backendError,
        );
      }

      if (room) {
        try {
          await room
            .localParticipant
            .setCameraEnabled(
              false,
            );

          await room
            .localParticipant
            .setMicrophoneEnabled(
              false,
            );
        } catch {
          // Las pistas pueden no haberse creado.
        }

        room.disconnect();
      }

      roomRef.current =
        null;

      clearLiveVideo();

      setLiveSessionId(
        null,
      );

      setIsLive(
        false,
      );

      setComments([]);

      setLikes(0);

      resetViewerCounter();

      await restorePreview();
    } finally {
      setIsConnecting(
        false,
      );
    }
  }

  async function handleSaveReplay() {
    
    const currentLiveSessionId =
      finishedLiveSessionIdRef.current;

    const authToken =
      token;

      console.log(
  "💾 SAVE REPLAY CLICK:",
  {
    currentLiveSessionId,
    hasAuthToken:
      Boolean(authToken),
    isSavingReplay,
    finishedRef:
      finishedLiveSessionIdRef.current,
  },
);

    if (
      !currentLiveSessionId ||
      !authToken ||
      isSavingReplay
    ) {
      return;
    }

    try {
      setIsSavingReplay(
        true,
      );

      if (
        finishLivePromiseRef.current
      ) {
        await finishLivePromiseRef.current;
      }

      await saveLiveReplay(
        currentLiveSessionId,
        authToken,
      );


      finishedLiveSessionIdRef.current =
        null;

      setFinishModalVisible(
        false,
      );
    } catch (
      caughtError
    ) {
      console.error(
        "No se pudo guardar el REPLAY:",
        caughtError,
      );

      let message =
        "No se pudo guardar el vídeo.";

      if (
        caughtError instanceof
        Error
      ) {
        message =
          caughtError.message;
      }

      setError(
        message,
      );
    } finally {
      setIsSavingReplay(
        false,
      );
    }
  }

  async function finishLive() {
    setFinishModalVisible(
      true,
    );

    const room =
      roomRef.current;

    const currentLiveSessionId =
      liveSessionIdRef.current;

    finishedLiveSessionIdRef.current =
      currentLiveSessionId;

    setError(null);

    stopThumbnailCapture();

    await stopCurrentRecording();

    try {
      await endRegisteredLive();
    } catch (
      caughtError
    ) {
      console.error(
        caughtError,
      );

      let message =
        "No se pudo cerrar el LIVE en Allive.";

      if (
        caughtError instanceof
        Error
      ) {
        message =
          caughtError.message;
      }

      setError(
        message,
      );
    }

    if (room) {
      try {
        await room
          .localParticipant
          .setCameraEnabled(
            false,
          );

        await room
          .localParticipant
          .setMicrophoneEnabled(
            false,
          );
      } catch (
        caughtError
      ) {
        console.error(
          "Error desactivando cámara/micrófono:",
          caughtError,
        );
      }

      room.disconnect();
    }

    roomRef.current =
      null;

    liveSessionIdRef.current =
      null;

    clearLiveVideo();

    setLiveSessionId(
      null,
    );

    setIsLive(
      false,
    );

    setComments([]);

    setLikes(0);

    resetViewerCounter();

    await restorePreview();
  }


  return (
    <LiveBroadcastStage
      media={
        <LiveBroadcastSurface
          ref={
            localVideoRef
          }
          cameraReady={
            cameraReady
          }
          cameraError={
            cameraError
          }
        />
      }
      overlay={{
        isLive,
        isConnecting,
        cameraReady,
        viewers,
        likes,
        comments,
        error,
        title,
        eventName,

        locationName:
          displayedLocationName,

        locationCoordinates,

        selectedLocationPlace,

        onChangeLocationPlace:
          setSelectedLocationPlace,

        onChangeTitle:
          setTitle,

        onChangeEventName:
          setEventName,

        onSaveMetadata:
          () => {
            void saveLiveMetadata(
              title,
              eventName,
            );
          },

        onStartLive:
          startLive,

        onFinishLive:
          () => {
            const finishPromise =
              finishLive();

            finishLivePromiseRef.current =
              finishPromise;

            void finishPromise.finally(
              () => {
                if (
                  finishLivePromiseRef.current ===
                  finishPromise
                ) {
                  finishLivePromiseRef.current =
                    null;
                }
              },
            );
          },
      }}
      finishModal={{
        visible:
          finishModalVisible,

        saving:
          isSavingReplay,

        discarding:
          false,

        onSave: () => {
          void handleSaveReplay();
        },

        onDiscard: () => {
          finishedLiveSessionIdRef.current =
            null;

          setFinishModalVisible(
            false,
          );
        },
      }}
    >
      {!isLive &&
        !finishModalVisible && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Salir de emisión"
            hitSlop={10}
            onPress={
              onClose
            }
            style={({ pressed }) => [
              localStyles.closeButton,
              pressed &&
                localStyles.closeButtonPressed,
            ]}
          >
            <X
              size={23}
              color="#FFFFFF"
              strokeWidth={2.4}
            />
          </Pressable>
        )}
    </LiveBroadcastStage>
  );
}

const localStyles =
  StyleSheet.create({
    closeButton: {
      position: "absolute",

      top: 16,
      right: 16,

      width: 42,
      height: 42,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 21,

      backgroundColor:
        "rgba(12,13,16,0.48)",

      zIndex: 100,
    },

    closeButtonPressed: {
      opacity: 0.7,

      transform: [
        {
          scale: 0.94,
        },
      ],
    },
  });
