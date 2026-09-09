// src/components/live/thumbnail/captureLiveThumbnail.web.ts

const THUMBNAIL_WIDTH = 640;
const THUMBNAIL_HEIGHT = 360;
const THUMBNAIL_QUALITY = 0.72;

export async function captureLiveThumbnail(
  video: HTMLVideoElement,
): Promise<Blob> {
  if (
    video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
    video.videoWidth <= 0 ||
    video.videoHeight <= 0
  ) {
    throw new Error("El vídeo todavía no tiene un frame disponible.");
  }

  const canvas = document.createElement("canvas");

  canvas.width = THUMBNAIL_WIDTH;
  canvas.height = THUMBNAIL_HEIGHT;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("No se pudo crear el canvas de miniatura.");
  }

  const sourceAspect = video.videoWidth / video.videoHeight;
  const targetAspect = THUMBNAIL_WIDTH / THUMBNAIL_HEIGHT;

  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = video.videoWidth;
  let sourceHeight = video.videoHeight;

  if (sourceAspect > targetAspect) {
    sourceWidth = video.videoHeight * targetAspect;
    sourceX = (video.videoWidth - sourceWidth) / 2;
  } else if (sourceAspect < targetAspect) {
    sourceHeight = video.videoWidth / targetAspect;
    sourceY = (video.videoHeight - sourceHeight) / 2;
  }

  context.drawImage(
    video,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    THUMBNAIL_WIDTH,
    THUMBNAIL_HEIGHT,
  );

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(
      resolve,
      "image/webp",
      THUMBNAIL_QUALITY,
    );
  });

  if (!blob) {
    throw new Error("No se pudo generar la miniatura WebP.");
  }

  return blob;
}