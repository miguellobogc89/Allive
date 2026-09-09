// src/components/live/thumbnail/captureLiveThumbnail.web.ts

const THUMBNAIL_WIDTH = 640;
const THUMBNAIL_HEIGHT = 360;
const THUMBNAIL_QUALITY = 0.72;

type BrowserImageCapture = {
  grabFrame: () => Promise<ImageBitmap>;
};

type BrowserImageCaptureConstructor = new (
  track: MediaStreamTrack,
) => BrowserImageCapture;

function getImageCaptureConstructor() {
  return (
    globalThis as typeof globalThis & {
      ImageCapture?: BrowserImageCaptureConstructor;
    }
  ).ImageCapture;
}

function getSourceCrop(
  image: ImageBitmap,
) {
  const sourceAspect = image.width / image.height;
  const targetAspect = THUMBNAIL_WIDTH / THUMBNAIL_HEIGHT;

  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = image.width;
  let sourceHeight = image.height;

  if (sourceAspect > targetAspect) {
    sourceWidth = image.height * targetAspect;
    sourceX = (image.width - sourceWidth) / 2;
  } else if (sourceAspect < targetAspect) {
    sourceHeight = image.width / targetAspect;
    sourceY = (image.height - sourceHeight) / 2;
  }

  return {
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
  };
}

function createWebPBlob(
  canvas: HTMLCanvasElement,
) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob(
      resolve,
      "image/webp",
      THUMBNAIL_QUALITY,
    );
  });
}

export async function captureLiveThumbnail(
  mediaStreamTrack: MediaStreamTrack,
): Promise<Blob> {
  if (
    mediaStreamTrack.kind !== "video" ||
    mediaStreamTrack.readyState !== "live"
  ) {
    throw new Error(
      "La pista de camara para miniaturas no esta activa.",
    );
  }

  const ImageCaptureConstructor =
    getImageCaptureConstructor();

  if (!ImageCaptureConstructor) {
    throw new Error(
      "El navegador no soporta ImageCapture para generar miniaturas del LIVE.",
    );
  }

  const imageCapture =
    new ImageCaptureConstructor(
      mediaStreamTrack,
    );

  const image =
    await imageCapture.grabFrame();

  try {
    const canvas =
      document.createElement("canvas");

    canvas.width = THUMBNAIL_WIDTH;
    canvas.height = THUMBNAIL_HEIGHT;

    const context =
      canvas.getContext("2d");

    if (!context) {
      throw new Error(
        "No se pudo crear el canvas de miniatura.",
      );
    }

    const {
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
    } = getSourceCrop(image);

    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      THUMBNAIL_WIDTH,
      THUMBNAIL_HEIGHT,
    );

    const blob =
      await createWebPBlob(canvas);

    if (!blob) {
      throw new Error(
        "No se pudo generar la miniatura WebP.",
      );
    }

    return blob;
  } finally {
    image.close();
  }
}
