// src/components/profile/ProfileEditPanel.tsx

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  ActivityIndicator,
  Image,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const CROP_SIZE = 280;
const AVATAR_OUTPUT_SIZE = 512;

type CropSource = {
  uri: string;
  width: number;
  height: number;
};

type Point = {
  x: number;
  y: number;
};

type Props = {
  visible: boolean;
  username: string;
  displayName: string;
  description: string;
  location: string;
  avatarUrl: string | null;
  isSavingUsername: boolean;
  error: string | null;
  onClose: () => void;
  onSaveUsername: (
    username: string,
  ) => Promise<void>;
  onUploadAvatar: (
    image: Blob,
  ) => Promise<string | null>;
  onSaveProfile: (value: {
    displayName: string;
    avatarUrl: string | null;
  }) => Promise<void>;
  onChangeMockProfile: (value: {
    displayName: string;
    description: string;
    location: string;
    avatarUrl: string | null;
  }) => void;
};

function getRenderedSize(
  source: CropSource,
  scale: number,
) {
  const coverScale =
    Math.max(
      CROP_SIZE / source.width,
      CROP_SIZE / source.height,
    ) * scale;

  return {
    width: source.width * coverScale,
    height: source.height * coverScale,
  };
}

function clampOffset(
  source: CropSource,
  scale: number,
  offset: Point,
) {
  const rendered =
    getRenderedSize(source, scale);
  const maxX =
    Math.max(0, (rendered.width - CROP_SIZE) / 2);
  const maxY =
    Math.max(0, (rendered.height - CROP_SIZE) / 2);

  return {
    x: Math.max(-maxX, Math.min(maxX, offset.x)),
    y: Math.max(-maxY, Math.min(maxY, offset.y)),
  };
}

function loadImageElement(
  uri: string,
) {
  return new Promise<HTMLImageElement>(
    (resolve, reject) => {
      const image = document.createElement("img");
      image.onload = () => resolve(image);
      image.onerror = () => reject(
        new Error("No se pudo preparar la imagen."),
      );
      image.crossOrigin = "anonymous";
      image.src = uri;
    },
  );
}

async function createCroppedAvatarBlob(
  source: CropSource,
  scale: number,
  offset: Point,
) {
  if (Platform.OS !== "web") {
    const response = await fetch(source.uri);
    return response.blob();
  }

  const image =
    await loadImageElement(source.uri);
  const canvas =
    document.createElement("canvas");
  canvas.width = AVATAR_OUTPUT_SIZE;
  canvas.height = AVATAR_OUTPUT_SIZE;

  const context =
    canvas.getContext("2d");

  if (!context) {
    throw new Error(
      "No se pudo preparar el recorte.",
    );
  }

  const rendered =
    getRenderedSize(source, scale);
  const outputScale =
    AVATAR_OUTPUT_SIZE / CROP_SIZE;
  const drawWidth =
    rendered.width * outputScale;
  const drawHeight =
    rendered.height * outputScale;
  const drawX =
    AVATAR_OUTPUT_SIZE / 2 -
    drawWidth / 2 +
    offset.x * outputScale;
  const drawY =
    AVATAR_OUTPUT_SIZE / 2 -
    drawHeight / 2 +
    offset.y * outputScale;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    drawX,
    drawY,
    drawWidth,
    drawHeight,
  );

  return new Promise<Blob>(
    (resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
            return;
          }

          reject(
            new Error(
              "No se pudo generar el avatar.",
            ),
          );
        },
        "image/jpeg",
        0.9,
      );
    },
  );
}

export function ProfileEditPanel({
  visible,
  username,
  displayName,
  description,
  location,
  avatarUrl,
  isSavingUsername,
  error,
  onClose,
  onSaveUsername,
  onUploadAvatar,
  onSaveProfile,
  onChangeMockProfile,
}: Props) {
  const [
    draftUsername,
    setDraftUsername,
  ] = useState(username);
  const [
    draftName,
    setDraftName,
  ] = useState(displayName);
  const [
    draftDescription,
    setDraftDescription,
  ] = useState(description);
  const [
    draftLocation,
    setDraftLocation,
  ] = useState(location);
  const [
    draftAvatarUrl,
    setDraftAvatarUrl,
  ] = useState(avatarUrl ?? "");
  const [
    selectedAvatarUri,
    setSelectedAvatarUri,
  ] = useState<string | null>(null);
  const [
    selectedAvatarBlob,
    setSelectedAvatarBlob,
  ] = useState<Blob | null>(null);
  const [
    avatarMenuOpen,
    setAvatarMenuOpen,
  ] = useState(false);
  const [
    cropSource,
    setCropSource,
  ] = useState<CropSource | null>(null);
  const [
    cropScale,
    setCropScale,
  ] = useState(1);
  const [
    cropOffset,
    setCropOffset,
  ] = useState<Point>({ x: 0, y: 0 });
  const [
    avatarUploading,
    setAvatarUploading,
  ] = useState(false);
  const [
    avatarError,
    setAvatarError,
  ] =
    useState<string | null>(null);

  const cropOffsetRef =
    useRef(cropOffset);
  const dragStartRef =
    useRef<Point>({ x: 0, y: 0 });

  useEffect(() => {
    cropOffsetRef.current =
      cropOffset;
  }, [cropOffset]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setDraftUsername(username);
    setDraftName(displayName);
    setDraftDescription(description);
    setDraftLocation(location);
    setDraftAvatarUrl(avatarUrl ?? "");
    setSelectedAvatarUri(null);
    setSelectedAvatarBlob(null);
    setAvatarMenuOpen(false);
    setCropSource(null);
    setCropScale(1);
    setCropOffset({ x: 0, y: 0 });
    setAvatarError(null);
  }, [
    visible,
    username,
    displayName,
    description,
    location,
    avatarUrl,
  ]);

  const panResponder =
    useMemo(
      () =>
        PanResponder.create({
          onStartShouldSetPanResponder:
            () => true,
          onMoveShouldSetPanResponder:
            () => true,
          onPanResponderGrant: () => {
            dragStartRef.current =
              cropOffsetRef.current;
          },
          onPanResponderMove: (
            _event,
            gesture,
          ) => {
            if (!cropSource) {
              return;
            }

            setCropOffset(
              clampOffset(
                cropSource,
                cropScale,
                {
                  x:
                    dragStartRef
                      .current.x +
                    gesture.dx,
                  y:
                    dragStartRef
                      .current.y +
                    gesture.dy,
                },
              ),
            );
          },
        }),
      [cropScale, cropSource],
    );

  async function pickAvatar() {
    setAvatarError(null);
    setAvatarMenuOpen(false);

    const permission =
      await ImagePicker
        .requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setAvatarError(
        "Necesitamos permiso para abrir tus fotos.",
      );
      return;
    }

    const result =
      await ImagePicker
        .launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing:
            Platform.OS !== "web",
          aspect: [1, 1],
          quality: 1,
        });

    if (result.canceled) {
      return;
    }

    const asset = result.assets[0];

    if (!asset?.uri) {
      setAvatarError(
        "No se pudo leer la imagen seleccionada.",
      );
      return;
    }

    if (Platform.OS !== "web") {
      setSelectedAvatarUri(asset.uri);
      setSelectedAvatarBlob(null);
      setDraftAvatarUrl("");
      return;
    }

    const nextSource = {
      uri: asset.uri,
      width: asset.width || CROP_SIZE,
      height: asset.height || CROP_SIZE,
    };

    setCropSource(nextSource);
    setCropScale(1);
    setCropOffset({ x: 0, y: 0 });
  }

  async function imageUriToBlob(
    uri: string,
  ) {
    const response =
      await fetch(uri);

    return response.blob();
  }

  async function confirmCrop() {
    if (!cropSource) {
      return;
    }

    setAvatarError(null);

    try {
      const blob =
        await createCroppedAvatarBlob(
          cropSource,
          cropScale,
          cropOffset,
        );
      const objectUrl =
        URL.createObjectURL(blob);

      setSelectedAvatarBlob(blob);
      setSelectedAvatarUri(objectUrl);
      setDraftAvatarUrl("");
      setCropSource(null);
    } catch (caughtError) {
      setAvatarError(
        caughtError instanceof Error
          ? caughtError.message
          : "No se pudo ajustar la foto.",
      );
    }
  }

  function removeAvatar() {
    setAvatarMenuOpen(false);
    setSelectedAvatarUri(null);
    setSelectedAvatarBlob(null);
    setDraftAvatarUrl("");
  }

  function updateCropScale(
    nextScale: number,
  ) {
    if (!cropSource) {
      return;
    }

    const clampedScale =
      Math.max(
        1,
        Math.min(3, nextScale),
      );

    setCropScale(clampedScale);
    setCropOffset(
      clampOffset(
        cropSource,
        clampedScale,
        cropOffsetRef.current,
      ),
    );
  }

  async function handleSave() {
    setAvatarError(null);
    setAvatarUploading(true);

    let nextAvatarUrl =
      draftAvatarUrl.trim() || null;

    try {
      if (selectedAvatarBlob) {
        nextAvatarUrl =
          await onUploadAvatar(
            selectedAvatarBlob,
          );
      } else if (selectedAvatarUri) {
        const blob =
          await imageUriToBlob(
            selectedAvatarUri,
          );

        nextAvatarUrl =
          await onUploadAvatar(blob);
      }

      await onSaveUsername(
        draftUsername,
      );

      const nextDisplayName =
        draftName.trim() || username;

      await onSaveProfile({
        displayName:
          nextDisplayName,
        avatarUrl: nextAvatarUrl,
      });

      onChangeMockProfile({
        displayName:
          nextDisplayName,
        description:
          draftDescription.trim(),
        location:
          draftLocation.trim(),
        avatarUrl: nextAvatarUrl,
      });

      onClose();
    } catch (caughtError) {
      setAvatarError(
        caughtError instanceof Error
          ? caughtError.message
          : "No se pudo guardar la foto.",
      );
    } finally {
      setAvatarUploading(false);
    }
  }

  const previewUrl =
    selectedAvatarUri ||
    draftAvatarUrl.trim() ||
    null;

  const saving =
    avatarUploading ||
    isSavingUsername;
  const renderedCropSize =
    cropSource
      ? getRenderedSize(
          cropSource,
          cropScale,
        )
      : null;

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable
              onPress={onClose}
              hitSlop={10}
              disabled={saving}
            >
              <Ionicons
                name="close"
                size={26}
                color="#111111"
              />
            </Pressable>

            <Text style={styles.title}>
              Editar perfil
            </Text>

            <Pressable
              onPress={() => {
                void handleSave();
              }}
              disabled={saving}
            >
              <Text
                style={[
                  styles.save,
                  saving &&
                    styles.saveDisabled,
                ]}
              >
                {saving
                  ? "Guardando"
                  : "Listo"}
              </Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={
              styles.content
            }
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.label}>
              Foto de perfil
            </Text>

            <View style={styles.avatarEditor}>
              <View style={styles.avatarPreview}>
                {previewUrl ? (
                  <Image
                    source={{
                      uri: previewUrl,
                    }}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons
                    name="person"
                    size={34}
                    color="#8E8E8E"
                  />
                )}
              </View>

              <View style={styles.avatarActions}>
                <Pressable
                  style={styles.avatarButton}
                  onPress={() => {
                    setAvatarMenuOpen(
                      (open) => !open,
                    );
                  }}
                  disabled={saving}
                >
                  <Ionicons
                    name="camera-outline"
                    size={18}
                    color="#111111"
                  />
                  <Text
                    style={
                      styles.avatarButtonText
                    }
                  >
                    Foto
                  </Text>
                  <Ionicons
                    name={
                      avatarMenuOpen
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={16}
                    color="#111111"
                  />
                </Pressable>

                {avatarMenuOpen ? (
                  <View
                    style={styles.avatarMenu}
                  >
                    <Pressable
                      style={
                        styles.avatarMenuItem
                      }
                      onPress={() => {
                        void pickAvatar();
                      }}
                    >
                      <Ionicons
                        name="image-outline"
                        size={18}
                        color="#111111"
                      />
                      <Text
                        style={
                          styles
                            .avatarMenuText
                        }
                      >
                        Seleccionar
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[
                        styles.avatarMenuItem,
                        !previewUrl &&
                          styles
                            .avatarMenuItemDisabled,
                      ]}
                      onPress={removeAvatar}
                      disabled={!previewUrl}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color={
                          previewUrl
                            ? "#ED4956"
                            : "#C7C7C7"
                        }
                      />
                      <Text
                        style={[
                          styles
                            .avatarMenuText,
                          styles
                            .avatarMenuRemoveText,
                          !previewUrl &&
                            styles
                              .avatarMenuTextDisabled,
                        ]}
                      >
                        Quitar
                      </Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>
            </View>

            <Text style={styles.helper}>
              La foto se recorta dentro del circulo para
              comentarios. En el perfil se conserva la
              imagen guardada como cabecera.
            </Text>

            {avatarUploading ? (
              <View style={styles.uploading}>
                <ActivityIndicator color="#0095F6" />
                <Text style={styles.uploadingText}>
                  Subiendo foto...
                </Text>
              </View>
            ) : null}

            {avatarError ? (
              <Text style={styles.error}>
                {avatarError}
              </Text>
            ) : null}

            <Text style={styles.label}>
              Nombre
            </Text>

            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              placeholder="Nombre visible"
              placeholderTextColor="#A0A0A0"
              style={styles.input}
            />

            <Text style={styles.label}>
              Nombre de usuario
            </Text>

            <TextInput
              value={draftUsername}
              onChangeText={setDraftUsername}
              placeholder="usuario"
              placeholderTextColor="#A0A0A0"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />

            <Text style={styles.label}>
              Descripcion
            </Text>

            <TextInput
              value={draftDescription}
              onChangeText={
                setDraftDescription
              }
              placeholder="Cuenta algo sobre tus directos..."
              placeholderTextColor="#A0A0A0"
              multiline
              maxLength={160}
              style={[
                styles.input,
                styles.descriptionInput,
              ]}
            />

            <Text style={styles.label}>
              Ubicacion
            </Text>

            <TextInput
              value={draftLocation}
              onChangeText={setDraftLocation}
              placeholder="Ciudad, pais"
              placeholderTextColor="#A0A0A0"
              style={styles.input}
            />

            {error ? (
              <Text style={styles.error}>
                {error}
              </Text>
            ) : null}
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={Boolean(cropSource)}
        animationType="fade"
        transparent
        onRequestClose={() => {
          setCropSource(null);
        }}
      >
        <View style={styles.cropBackdrop}>
          <View style={styles.cropSheet}>
            <View style={styles.cropHeader}>
              <Pressable
                hitSlop={10}
                onPress={() => {
                  setCropSource(null);
                }}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color="#111111"
                />
              </Pressable>

              <Text style={styles.cropTitle}>
                Ajustar foto
              </Text>

              <Pressable
                hitSlop={10}
                onPress={() => {
                  void confirmCrop();
                }}
              >
                <Ionicons
                  name="checkmark"
                  size={26}
                  color="#0095F6"
                />
              </Pressable>
            </View>

            <View
              style={styles.cropStage}
              {...panResponder.panHandlers}
            >
              <View style={styles.cropCircle}>
                {cropSource &&
                renderedCropSize ? (
                  <Image
                    source={{
                      uri: cropSource.uri,
                    }}
                    resizeMode="stretch"
                    style={[
                      styles.cropImage,
                      {
                        width:
                          renderedCropSize
                            .width,
                        height:
                          renderedCropSize
                            .height,
                        transform: [
                          {
                            translateX:
                              -renderedCropSize
                                .width /
                                2 +
                              cropOffset.x,
                          },
                          {
                            translateY:
                              -renderedCropSize
                                .height /
                                2 +
                              cropOffset.y,
                          },
                        ],
                      },
                    ]}
                  />
                ) : null}
              </View>
            </View>

            <View style={styles.zoomControls}>
              <Pressable
                style={styles.zoomButton}
                onPress={() => {
                  updateCropScale(
                    cropScale - 0.12,
                  );
                }}
              >
                <Ionicons
                  name="remove"
                  size={18}
                  color="#111111"
                />
              </Pressable>

              <View style={styles.zoomTrack}>
                <View
                  style={[
                    styles.zoomFill,
                    {
                      width: `${
                        ((cropScale - 1) / 2) *
                        100
                      }%`,
                    },
                  ]}
                />
              </View>

              <Pressable
                style={styles.zoomButton}
                onPress={() => {
                  updateCropScale(
                    cropScale + 0.12,
                  );
                }}
              >
                <Ionicons
                  name="add"
                  size={18}
                  color="#111111"
                />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    borderBottomWidth:
      StyleSheet.hairlineWidth,
    borderBottomColor: "#DBDBDB",
  },

  title: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "700",
  },

  save: {
    color: "#0095F6",
    fontSize: 14,
    fontWeight: "700",
  },

  saveDisabled: {
    color: "#94CFFF",
  },

  content: {
    padding: 20,
    paddingBottom: 60,
  },

  label: {
    marginTop: 18,
    marginBottom: 7,
    color: "#262626",
    fontSize: 12,
    fontWeight: "600",
  },

  avatarEditor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 12,
    zIndex: 2,
  },

  avatarPreview: {
    width: 92,
    height: 92,
    borderRadius: 46,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFEFEF",
    borderWidth: 1,
    borderColor: "#DBDBDB",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarActions: {
    flex: 1,
    position: "relative",
  },

  avatarButton: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 9,
    backgroundColor: "#EFEFEF",
  },

  avatarButtonText: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "700",
  },

  avatarMenu: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    zIndex: 5,
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 6,
  },

  avatarMenuItem: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    borderBottomWidth:
      StyleSheet.hairlineWidth,
    borderBottomColor: "#EFEFEF",
  },

  avatarMenuItemDisabled: {
    opacity: 0.55,
  },

  avatarMenuText: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "600",
  },

  avatarMenuRemoveText: {
    color: "#ED4956",
  },

  avatarMenuTextDisabled: {
    color: "#C7C7C7",
  },

  input: {
    minHeight: 46,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderRadius: 9,
    color: "#111111",
    fontSize: 14,
    backgroundColor: "#FFFFFF",
  },

  descriptionInput: {
    minHeight: 100,
    paddingTop: 12,
    textAlignVertical: "top",
  },

  helper: {
    marginTop: 7,
    color: "#8E8E8E",
    fontSize: 11,
    lineHeight: 16,
  },

  uploading: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  uploadingText: {
    color: "#737373",
    fontSize: 12,
    fontWeight: "600",
  },

  error: {
    marginTop: 18,
    color: "#ED4956",
    fontSize: 12,
    fontWeight: "600",
  },

  cropBackdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    backgroundColor: "rgba(0,0,0,0.52)",
  },

  cropSheet: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    padding: 18,
  },

  cropHeader: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  cropTitle: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "700",
  },

  cropStage: {
    width: CROP_SIZE,
    height: CROP_SIZE,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  cropCircle: {
    width: CROP_SIZE,
    height: CROP_SIZE,
    borderRadius: CROP_SIZE / 2,
    overflow: "hidden",
    backgroundColor: "#EFEFEF",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  cropImage: {
    position: "absolute",
    left: CROP_SIZE / 2,
    top: CROP_SIZE / 2,
  },

  zoomControls: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  zoomButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFEFEF",
  },

  zoomTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    backgroundColor: "#DBDBDB",
  },

  zoomFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: "#0095F6",
  },
});
