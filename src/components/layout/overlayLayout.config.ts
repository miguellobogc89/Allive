// src/components/layout/overlayLayout.config.ts

export const appOverlayLayout = {
  referenceWidth: 400,

  scale: {
    min: 0.9,
    max: 1.08,
  },

  horizontalMargin: 16,

  header: {
    height: 58,
    topGap: 8,
  },

  sideActions: {
    width: 52,
    maxHeight: 260,
    maxHeightRatio: 0.36,
    bottomGap: 12,
  },

  comments: {
    height: 150,
    gap: 8,
  },

  metadata: {
    height: 104,
    gap: 10,
  },

  bottomControls: {
    height: 64,
    bottomGap: 10,
  },
} as const;