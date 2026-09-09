// src/screens/EmitScreen.web.tsx

import { Ionicons } from "@expo/vector-icons";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  Participant,
  Room,
  RoomEvent,
  Track,
} from "livekit-client";

import { colors } from "../theme/colors";

const API_URL = "http://localhost:3001";

function createLiveRoomName() {
  return `live-${Date.now()}`;
}

type LiveKitTokenResponse = {
  serverUrl: string;
  participantToken: string;
  role: "broadcaster" | "viewer";
};

type LocationState = {
  latitude: number;
  longitude: number;
  placeName: string;
};

function getParticipantRole(
  participant: Participant
) {
  const attributeRole =
    participant.attributes?.role;

  if (
    attributeRole === "viewer" ||
    attributeRole === "broadcaster"
  ) {
    return attributeRole;
  }

  if (participant.metadata) {
    try {
      const parsed = JSON.parse(
        participant.metadata
      );

      if (
        parsed?.role === "viewer" ||
        parsed?.role === "broadcaster"
      ) {
        return parsed.role;
      }
    } catch {
      // Fallback a identity.
    }
  }

  if (
    participant.identity.startsWith(
      "viewer-"
    )
  ) {
    return "viewer";
  }

  if (
    participant.identity.startsWith(
      "broadcaster-"
    )
  ) {
    return "broadcaster";
  }

  return null;
}

export function EmitScreen() {
  const roomRef =
    useRef<Room | null>(null);

  const localVideoRef =
    useRef<HTMLDivElement | null>(null);

  const previewStreamRef =
    useRef<MediaStream | null>(null);

  const previewVideoElementRef =
    useRef<HTMLVideoElement | null>(null);

  const liveVideoElementRef =
    useRef<HTMLVideoElement | null>(null);

  const liveSessionIdRef =
    useRef<string | null>(null);

  const previousViewerCountRef =
    useRef(0);

  const hasViewerCountRef =
    useRef(false);

  const viewerDeltaAnimation =
    useRef(new Animated.Value(0)).current;

  const [cameraReady, setCameraReady] =
    useState(false);

  const [cameraError, setCameraError] =
    useState<string | null>(null);

  const [isConnecting, setIsConnecting] =
    useState(false);

  const [isLive, setIsLive] =
    useState(false);

  const [
    liveRoomName,
    setLiveRoomName,
  ] = useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [viewers, setViewers] =
    useState(0);

  const [
    viewerDelta,
    setViewerDelta,
  ] = useState<number | null>(null);

  const [title, setTitle] =
    useState("");

  const [eventName, setEventName] =
    useState("");

  const [
    editingTitle,
    setEditingTitle,
  ] = useState(false);

  const [
    editingEvent,
    setEditingEvent,
  ] = useState(false);

  const [location, setLocation] =
    useState<LocationState | null>(null);

  const [
    locationStatus,
    setLocationStatus,
  ] = useState<
    "loading" | "ready" | "unavailable"
  >("loading");

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
            "El navegador no permite acceder a la cámara."
          );
        }

        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

        if (cancelled) {
          stream
            .getTracks()
            .forEach((track) => track.stop());

          return;
        }

        previewStreamRef.current =
          stream;

        attachPreviewStream(stream);

        setCameraReady(true);
      } catch (caughtError) {
        console.error(
          "Error preparando preview:",
          caughtError
        );

        setCameraError(
          "No se ha podido acceder a la cámara o al micrófono."
        );
      }
    }

    preparePreview();

    return () => {
      cancelled = true;

      roomRef.current?.disconnect();

      stopPreviewStream();

      detachLiveVideo();
    };
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude:
            position.coords.latitude,
          longitude:
            position.coords.longitude,
          placeName: "Ubicación actual",
        });

        setLocationStatus("ready");
      },
      (locationError) => {
        console.warn(
          "No se pudo obtener ubicación:",
          locationError
        );

        setLocationStatus("unavailable");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, []);

  function attachPreviewStream(
    stream: MediaStream
  ) {
    if (!localVideoRef.current) {
      return;
    }

    const video =
      document.createElement("video");

    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;
    video.srcObject = stream;

    applyVideoElementStyles(video);

    localVideoRef.current.innerHTML = "";
    localVideoRef.current.appendChild(video);

    previewVideoElementRef.current =
      video;

    void video.play().catch(
      (playError) => {
        console.warn(
          "Preview play:",
          playError
        );
      }
    );
  }

  function applyVideoElementStyles(
    element: HTMLVideoElement
  ) {
    element.style.position = "absolute";
    element.style.inset = "0";
    element.style.width = "100%";
    element.style.height = "100%";
    element.style.objectFit = "cover";
  }

  function stopPreviewStream() {
    const stream =
      previewStreamRef.current;

    if (stream) {
      stream
        .getTracks()
        .forEach((track) => {
          track.stop();
        });
    }

    previewStreamRef.current = null;

    const element =
      previewVideoElementRef.current;

    if (element) {
      element.pause();
      element.srcObject = null;
      element.remove();
    }

    previewVideoElementRef.current =
      null;
  }

  function detachLiveVideo() {
    const element =
      liveVideoElementRef.current;

    if (element) {
      element.pause();
      element.remove();
    }

    liveVideoElementRef.current =
      null;
  }

  function attachLiveCamera(
    room: Room
  ) {
    const cameraPublication =
      room.localParticipant.getTrackPublication(
        Track.Source.Camera
      );

    const cameraTrack =
      cameraPublication?.track;

    if (
      !cameraTrack ||
      !localVideoRef.current
    ) {
      throw new Error(
        "LiveKit no ha creado la pista de cámara."
      );
    }

    const element =
      cameraTrack.attach() as HTMLVideoElement;

    element.autoplay = true;
    element.playsInline = true;
    element.muted = true;

    applyVideoElementStyles(element);

    localVideoRef.current.innerHTML = "";
    localVideoRef.current.appendChild(
      element
    );

    liveVideoElementRef.current =
      element;

    void element.play().catch(
      (playError) => {
        console.warn(
          "Live preview play:",
          playError
        );
      }
    );
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
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      previewStreamRef.current =
        stream;

      attachPreviewStream(stream);

      setCameraReady(true);
      setCameraError(null);
    } catch (caughtError) {
      console.error(
        "No se pudo restaurar preview:",
        caughtError
      );

      setCameraReady(false);

      setCameraError(
        "No se ha podido volver a activar la cámara."
      );
    }
  }

  function resetViewerCounter() {
    previousViewerCountRef.current = 0;
    hasViewerCountRef.current = false;

    setViewers(0);
    setViewerDelta(null);

    viewerDeltaAnimation.setValue(0);
  }

  function applyViewerCount(
    nextCount: number
  ) {
    const previousCount =
      previousViewerCountRef.current;

    setViewers(nextCount);

    if (!hasViewerCountRef.current) {
      hasViewerCountRef.current = true;

      previousViewerCountRef.current =
        nextCount;

      return;
    }

    const delta =
      nextCount - previousCount;

    previousViewerCountRef.current =
      nextCount;

    if (delta === 0) {
      return;
    }

    setViewerDelta(delta);

    viewerDeltaAnimation.stopAnimation();
    viewerDeltaAnimation.setValue(0);

    Animated.sequence([
      Animated.timing(
        viewerDeltaAnimation,
        {
          toValue: 1,
          duration: 160,
          useNativeDriver: false,
        }
      ),
      Animated.delay(650),
      Animated.timing(
        viewerDeltaAnimation,
        {
          toValue: 0,
          duration: 220,
          useNativeDriver: false,
        }
      ),
    ]).start(() => {
      setViewerDelta(null);
    });
  }

  function updateViewerCount(
    room: Room
  ) {
    let viewerCount = 0;

    room.remoteParticipants.forEach(
      (participant) => {
        if (
          getParticipantRole(
            participant
          ) === "viewer"
        ) {
          viewerCount += 1;
        }
      }
    );

    applyViewerCount(viewerCount);
  }

  async function getBroadcasterToken(
    roomName: string
  ): Promise<LiveKitTokenResponse> {
    const response = await fetch(
      `${API_URL}/api/livekit/token`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          roomName,
          role: "broadcaster",
        }),
      }
    );

    if (!response.ok) {
      const responseBody =
        await response
          .json()
          .catch(() => null);

      throw new Error(
        responseBody?.error ??
          `No se pudo obtener el token de emisión (${response.status})`
      );
    }

    const tokenData =
      (await response.json()) as LiveKitTokenResponse;

    if (
      !tokenData.serverUrl ||
      !tokenData.participantToken
    ) {
      throw new Error(
        "La API devolvió un token LiveKit inválido."
      );
    }

    return tokenData;
  }

  async function registerLiveInBackend(
    roomName: string
  ) {
    const response = await fetch(
      `${API_URL}/api/lives`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          roomName,
          title,
          eventName,
          latitude:
            location?.latitude ?? null,
          longitude:
            location?.longitude ?? null,
          placeName:
            location?.placeName ?? null,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `No se pudo registrar el LIVE en Allive (${response.status})`
      );
    }

    const liveSession =
      await response.json();

    if (!liveSession?.id) {
      throw new Error(
        "La API no devolvió el ID del LIVE."
      );
    }

    liveSessionIdRef.current =
      liveSession.id;

    console.log(
      "Allive LIVE registrado:",
      liveSession
    );
  }

  async function updateLiveMetadata(
    nextTitle: string,
    nextEventName: string
  ) {
    const liveSessionId =
      liveSessionIdRef.current;

    if (!liveSessionId) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/lives/${liveSessionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title: nextTitle,
            eventName: nextEventName,
            latitude:
              location?.latitude ??
              null,
            longitude:
              location?.longitude ??
              null,
            placeName:
              location?.placeName ??
              null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `No se pudieron actualizar los datos del LIVE (${response.status})`
        );
      }
    } catch (caughtError) {
      console.error(caughtError);

      setError(
        "No se pudieron guardar los cambios del LIVE."
      );
    }
  }

  async function markLiveAsEnded() {
    const liveSessionId =
      liveSessionIdRef.current;

    if (!liveSessionId) {
      return;
    }

    const response = await fetch(
      `${API_URL}/api/lives/${liveSessionId}/end`,
      {
        method: "PATCH",
      }
    );

    if (!response.ok) {
      throw new Error(
        `No se pudo finalizar el LIVE en Allive (${response.status})`
      );
    }

    liveSessionIdRef.current = null;
  }

  async function startLive() {
    if (!cameraReady) {
      setError(
        "La cámara todavía no está preparada."
      );

      return;
    }

    let room: Room | null = null;

    try {
      setError(null);
      setIsConnecting(true);

      resetViewerCounter();

      const roomName =
        createLiveRoomName();

      setLiveRoomName(roomName);

      console.log(
        "Allive creando LIVE:",
        roomName
      );

      const {
        serverUrl,
        participantToken,
      } =
        await getBroadcasterToken(
          roomName
        );

      /*
       * Liberamos Camo/getUserMedia antes de
       * pedir la cámara desde LiveKit.
       */
      stopPreviewStream();

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
        updateCount
      );

      room.on(
        RoomEvent.ParticipantDisconnected,
        updateCount
      );

      room.on(
        RoomEvent.ParticipantAttributesChanged,
        updateCount
      );

      room.on(
        RoomEvent.ParticipantMetadataChanged,
        updateCount
      );

      await room.connect(
        serverUrl,
        participantToken
      );

      console.log(
        "Allive broadcaster conectado a LiveKit:",
        roomName
      );

      /*
       * Volvemos al mecanismo que ya habíamos
       * probado correctamente.
       */
      await room.localParticipant.setCameraEnabled(
        true
      );

      await room.localParticipant.setMicrophoneEnabled(
        true
      );

      console.log(
        "Allive cámara y micrófono publicados:",
        roomName
      );

      attachLiveCamera(room);

      /*
       * Solo registramos en Neon cuando LiveKit
       * ya está conectado y publicando.
       */
      await registerLiveInBackend(
        roomName
      );

      updateViewerCount(room);

      setCameraReady(true);
      setIsLive(true);

      console.log(
        "Allive LIVE iniciado correctamente:",
        roomName
      );
    } catch (caughtError) {
      console.error(
        "Error iniciando Allive LIVE:",
        caughtError
      );

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No se ha podido iniciar el LIVE."
      );

      /*
       * Si llegamos a registrar en Neon antes
       * de algún fallo posterior, lo limpiamos.
       */
      try {
        await markLiveAsEnded();
      } catch (backendError) {
        console.error(
          "No se pudo limpiar el LIVE del backend:",
          backendError
        );
      }

      if (room) {
        try {
          await room.localParticipant.setCameraEnabled(
            false
          );

          await room.localParticipant.setMicrophoneEnabled(
            false
          );
        } catch {
          // Las pistas pueden no haberse creado.
        }

        room.disconnect();
      }

      roomRef.current = null;

      detachLiveVideo();

      setLiveRoomName(null);
      setIsLive(false);

      resetViewerCounter();

      await restorePreview();
    } finally {
      setIsConnecting(false);
    }
  }

  async function finishLive() {
    const room =
      roomRef.current;

    setError(null);

    try {
      await markLiveAsEnded();
    } catch (caughtError) {
      console.error(caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No se pudo cerrar el LIVE en Allive."
      );
    }

    if (room) {
      try {
        await room.localParticipant.setCameraEnabled(
          false
        );

        await room.localParticipant.setMicrophoneEnabled(
          false
        );
      } catch (caughtError) {
        console.error(
          "Error desactivando cámara/micrófono:",
          caughtError
        );
      }

      room.disconnect();
    }

    roomRef.current = null;
    liveSessionIdRef.current = null;

    detachLiveVideo();

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
      void updateLiveMetadata(
        title,
        eventName
      );
    }
  }

  function saveEvent() {
    setEditingEvent(false);

    if (isLive) {
      void updateLiveMetadata(
        title,
        eventName
      );
    }
  }

  const deltaOpacity =
    viewerDeltaAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

  const deltaTranslateY =
    viewerDeltaAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [6, 0],
    });

  const badgeScale =
    viewerDeltaAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.08],
    });

  return (
    <View style={styles.container}>
      <div
        ref={localVideoRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
          overflow: "hidden",
        }}
      />

      {!cameraReady && !isLive && (
        <View
          style={
            styles.cameraPlaceholder
          }
        >
          <Ionicons
            name="videocam-outline"
            size={42}
            color="rgba(255,255,255,0.35)"
          />

          <Text
            style={styles.cameraText}
          >
            {cameraError ??
              (isConnecting
                ? "Iniciando LIVE..."
                : "Preparando cámara...")}
          </Text>
        </View>
      )}

      <View style={styles.top}>
        <Pressable
          style={styles.circleButton}
        >
          <Ionicons
            name="close"
            size={25}
            color={colors.text}
          />
        </Pressable>

        <View
          style={[
            styles.statusBadge,
            isLive &&
              styles.liveBadge,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              isLive &&
                styles.liveDot,
            ]}
          />

          <Text
            style={styles.statusText}
          >
            {isLive
              ? "LIVE"
              : "LISTO"}
          </Text>
        </View>

        <View
          style={
            styles.viewerBadgeWrapper
          }
        >
          <Animated.View
            style={[
              styles.viewerBadge,
              {
                transform: [
                  {
                    scale:
                      badgeScale,
                  },
                ],
              },
            ]}
          >
            <Ionicons
              name="eye-outline"
              size={16}
              color={colors.text}
            />

            <Text
              style={
                styles.viewerText
              }
            >
              {viewers}
            </Text>
          </Animated.View>

          {viewerDelta !== null && (
            <Animated.Text
              style={[
                styles.viewerDelta,
                {
                  opacity:
                    deltaOpacity,
                  transform: [
                    {
                      translateY:
                        deltaTranslateY,
                    },
                  ],
                },
              ]}
            >
              {viewerDelta > 0
                ? `+${viewerDelta}`
                : viewerDelta}
            </Animated.Text>
          )}
        </View>
      </View>

      <View
        style={styles.metadataPanel}
      >
        {editingTitle ? (
          <View
            style={styles.editorRow}
          >
            <TextInput
              autoFocus
              value={title}
              onChangeText={setTitle}
              placeholder="¿Qué está pasando?"
              placeholderTextColor="rgba(255,255,255,0.45)"
              maxLength={120}
              style={styles.titleInput}
              returnKeyType="done"
              onSubmitEditing={
                saveTitle
              }
              onBlur={saveTitle}
            />
          </View>
        ) : (
          <Pressable
            style={styles.metadataRow}
            onPress={() =>
              setEditingTitle(true)
            }
          >
            <Ionicons
              name="create-outline"
              size={19}
              color={colors.text}
            />

            <Text
              numberOfLines={2}
              style={[
                styles.titleText,
                !title &&
                  styles.placeholderText,
              ]}
            >
              {title ||
                "¿Qué está pasando?"}
            </Text>
          </Pressable>
        )}

        <View
          style={styles.separator}
        />

        {editingEvent ? (
          <View
            style={styles.editorRow}
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color={colors.text}
            />

            <TextInput
              autoFocus
              value={eventName}
              onChangeText={
                setEventName
              }
              placeholder="Nombre del evento"
              placeholderTextColor="rgba(255,255,255,0.45)"
              maxLength={120}
              style={styles.eventInput}
              returnKeyType="done"
              onSubmitEditing={
                saveEvent
              }
              onBlur={saveEvent}
            />
          </View>
        ) : (
          <Pressable
            style={styles.metadataRow}
            onPress={() =>
              setEditingEvent(true)
            }
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color={
                eventName
                  ? colors.text
                  : "rgba(255,255,255,0.65)"
              }
            />

            <Text
              numberOfLines={1}
              style={[
                styles.secondaryText,
                !eventName &&
                  styles.placeholderText,
              ]}
            >
              {eventName ||
                "Añadir evento"}
            </Text>

            <Ionicons
              name="chevron-forward"
              size={16}
              color="rgba(255,255,255,0.4)"
            />
          </Pressable>
        )}

        <View
          style={styles.separator}
        />

        <View
          style={styles.metadataRow}
        >
          <Ionicons
            name="location"
            size={18}
            color={
              locationStatus ===
              "ready"
                ? colors.text
                : "rgba(255,255,255,0.55)"
            }
          />

          <View
            style={
              styles.locationTextContainer
            }
          >
            <Text
              style={
                styles.secondaryText
              }
            >
              {locationStatus ===
              "loading"
                ? "Buscando ubicación..."
                : locationStatus ===
                    "ready"
                  ? location?.placeName
                  : "Sin ubicación"}
            </Text>

            {location && (
              <Text
                style={
                  styles.coordinates
                }
              >
                {location.latitude.toFixed(
                  4
                )}
                ,{" "}
                {location.longitude.toFixed(
                  4
                )}
              </Text>
            )}
          </View>
        </View>
      </View>

      {error && (
        <View
          style={styles.errorBox}
        >
          <Text
            style={styles.errorText}
          >
            {error}
          </Text>
        </View>
      )}

      <View style={styles.bottom}>
        {!isLive ? (
          <Pressable
            style={[
              styles.goLiveButton,
              (!cameraReady ||
                isConnecting) &&
                styles.disabledButton,
            ]}
            disabled={
              !cameraReady ||
              isConnecting
            }
            onPress={startLive}
          >
            <View
              style={
                styles.goLiveDot
              }
            />

            <Text
              style={
                styles.goLiveText
              }
            >
              {isConnecting
                ? "CONECTANDO..."
                : "EMPEZAR LIVE"}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={
              styles.finishButton
            }
            onPress={finishLive}
          >
            <View
              style={styles.stopIcon}
            />

            <Text
              style={
                styles.finishText
              }
            >
              FINALIZAR LIVE
            </Text>
          </Pressable>
        )}

        <Text style={styles.hint}>
          {isLive
            ? "Estás en directo"
            : cameraReady
              ? "La cámara está preparada · todavía no estás en directo"
              : isConnecting
                ? "Conectando con Allive..."
                : "Preparando cámara"}
        </Text>

        {isLive &&
          liveRoomName && (
            <Text
              style={styles.roomText}
            >
              {liveRoomName}
            </Text>
          )}
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#050506",
    },

    cameraPlaceholder: {
      ...StyleSheet.absoluteFill,
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      backgroundColor: "#151719",
    },

    cameraText: {
      color:
        "rgba(255,255,255,0.7)",
      fontSize: 14,
      fontWeight: "700",
    },

    top: {
      position: "absolute",
      top: 18,
      left: 18,
      right: 18,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      zIndex: 20,
    },

    circleButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        "rgba(0,0,0,0.55)",
    },

    statusBadge: {
      height: 32,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 11,
      borderRadius: 10,
      backgroundColor:
        "rgba(0,0,0,0.55)",
    },

    liveBadge: {
      backgroundColor:
        "rgba(255,59,48,0.88)",
    },

    statusDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor:
        "rgba(255,255,255,0.5)",
    },

    liveDot: {
      backgroundColor:
        colors.text,
    },

    statusText: {
      color: colors.text,
      fontSize: 11,
      fontWeight: "900",
    },

    viewerBadgeWrapper: {
      position: "relative",
      alignItems: "center",
    },

    viewerBadge: {
      height: 42,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 12,
      borderRadius: 21,
      backgroundColor:
        "rgba(0,0,0,0.55)",
    },

    viewerText: {
      color: colors.text,
      fontSize: 12,
      fontWeight: "700",
    },

    viewerDelta: {
      position: "absolute",
      top: 44,
      color: colors.text,
      fontSize: 11,
      fontWeight: "900",
      paddingHorizontal: 7,
      paddingVertical: 3,
      borderRadius: 8,
      backgroundColor:
        "rgba(0,0,0,0.72)",
    },

    metadataPanel: {
      position: "absolute",
      left: 18,
      right: 18,
      bottom: 205,
      paddingHorizontal: 15,
      paddingVertical: 5,
      borderRadius: 18,
      backgroundColor:
        "rgba(0,0,0,0.62)",
      zIndex: 20,
    },

    metadataRow: {
      minHeight: 52,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    editorRow: {
      minHeight: 52,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    titleText: {
      flex: 1,
      color: colors.text,
      fontSize: 17,
      lineHeight: 22,
      fontWeight: "800",
    },

    secondaryText: {
      flex: 1,
      color: colors.text,
      fontSize: 14,
      fontWeight: "600",
    },

    placeholderText: {
      color:
        "rgba(255,255,255,0.55)",
    },

    titleInput: {
      flex: 1,
      color: colors.text,
      fontSize: 17,
      fontWeight: "800",
      outlineStyle: "none",
    } as any,

    eventInput: {
      flex: 1,
      color: colors.text,
      fontSize: 14,
      fontWeight: "600",
      outlineStyle: "none",
    } as any,

    separator: {
      height: 1,
      backgroundColor:
        "rgba(255,255,255,0.1)",
    },

    locationTextContainer: {
      flex: 1,
    },

    coordinates: {
      marginTop: 2,
      color:
        "rgba(255,255,255,0.42)",
      fontSize: 10,
    },

    errorBox: {
      position: "absolute",
      left: 18,
      right: 18,
      bottom: 165,
      padding: 11,
      borderRadius: 12,
      backgroundColor:
        "rgba(255,59,48,0.18)",
      zIndex: 30,
    },

    errorText: {
      color: "#FF8A83",
      fontSize: 11,
      lineHeight: 16,
    },

    bottom: {
      position: "absolute",
      left: 22,
      right: 22,
      bottom: 105,
      alignItems: "center",
      zIndex: 20,
    },

    goLiveButton: {
      height: 56,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 9,
      paddingHorizontal: 30,
      borderRadius: 18,
      backgroundColor:
        colors.live,
    },

    disabledButton: {
      opacity: 0.5,
    },

    goLiveDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor:
        colors.text,
    },

    goLiveText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "900",
    },

    finishButton: {
      height: 56,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 9,
      paddingHorizontal: 28,
      borderRadius: 18,
      backgroundColor:
        "rgba(20,20,20,0.9)",
      borderWidth: 1,
      borderColor:
        "rgba(255,255,255,0.3)",
    },

    stopIcon: {
      width: 12,
      height: 12,
      borderRadius: 3,
      backgroundColor:
        colors.live,
    },

    finishText: {
      color: colors.text,
      fontSize: 13,
      fontWeight: "900",
    },

    hint: {
      marginTop: 9,
      color:
        "rgba(255,255,255,0.55)",
      fontSize: 10,
      fontWeight: "500",
    },

    roomText: {
      marginTop: 3,
      color:
        "rgba(255,255,255,0.3)",
      fontSize: 9,
    },
  });