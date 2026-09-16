// src/screens/EmitScreen/web/emitCamera.web.ts

export async function createEmitPreviewStream() {
  if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {
    throw new Error(
      "El navegador no permite acceder a la cámara.",
    );
  }

  return navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
}
