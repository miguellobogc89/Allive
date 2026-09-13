// src/styles/tokens.ts

import {
  colors,
} from "./colors";

import {
  controls,
} from "./controls";

import {
  iconSizes,
} from "./icons";

import {
  layout,
} from "./layout";

import {
  radius,
} from "./radius";

import {
  spacing,
} from "./spacing";

import {
  typography,
} from "./typography";

export const tokens = {
  color: {
    background: {
      app: colors.background,
      camera: colors.cameraBackground,
      black: colors.pureBlack,
      now: "#020609",
      profile: "#06101A",
      search: "#F7F7F5",
    },

    surface: {
      default: colors.surface,
      elevated: colors.surfaceElevated,
      nowCard: "#111820",
      searchCard: "#FFFFFF",
      searchSubtle: "#E8E8E5",
    },

    text: {
      primary: colors.text,
      secondary: colors.textSecondary,
      muted: colors.textMuted,
      onOverlay: colors.textOnOverlay,
      onOverlaySecondary:
        colors.textOnOverlaySecondary,
      onOverlayMuted:
        colors.textOnOverlayMuted,
      onOverlayPlaceholder:
        colors.textOnOverlayPlaceholder,
      onOverlaySubtle:
        colors.textOnOverlaySubtle,
      onOverlayFaint:
        colors.textOnOverlayFaint,
      nowTabInactive:
        "rgba(255,255,255,0.44)",
      nowCardTitle:
        "rgba(255,255,255,0.90)",
      nowEmptyDescription:
        "rgba(255,255,255,0.5)",
      liveViewerEmptyDescription:
        "rgba(255,255,255,0.58)",
      searchPrimary: "#292927",
      searchMuted: "#858580",
    },

    border: {
      default: colors.border,
      onOverlay: colors.borderOnOverlay,
      onOverlaySubtle:
        colors.borderOnOverlaySubtle,
      dividerOnOverlay:
        colors.dividerOnOverlay,
    },

    live: {
      primary: colors.live,
      strong: colors.liveStrong,
      soft: colors.liveSoft,
      now: "#FF2147",
      broadcast: "#FF3048",
      profile: "#E83B3B",
    },

    replay: {
      primary: "#168CFF",
    },

    accent: {
      primary: colors.accent,
      strong: colors.accentStrong,
      soft: colors.accentSoft,
      glow: colors.accentGlow,
      nowTab: "#22F0DE",
    },

    overlay: {
      default: colors.overlay,
      chrome: colors.overlayChrome,
      strong: colors.overlayStrong,
      soft: colors.overlaySoft,
      raised: colors.overlayRaised,
      raisedStrong:
        colors.overlayRaisedStrong,
      mapChrome: colors.overlayMapChrome,
      mapCluster: colors.overlayMapCluster,
      viewerBadge:
        colors.overlayViewerBadge,
      delta: colors.overlayDelta,
      nowAudience:
        "rgba(10,16,22,0.72)",
      nowTextShadow:
        "rgba(0,0,0,0.7)",
    },

    gradient: {
      nowCardFallback: [
        "#334A5C",
        "#16232D",
        "#070B0E",
      ],
      nowCardOverlay: [
        "rgba(0,0,0,0.00)",
        "rgba(0,0,0,0.04)",
        "rgba(0,0,0,0.32)",
        "rgba(0,0,0,0.92)",
      ],
    },

    danger: {
      surface: colors.dangerSurface,
      text: colors.dangerText,
    },

    map: {
      land: colors.mapLand,
      background: colors.mapBackground,
      sea: colors.mapSea,
    },
  },

  type: {
    micro: typography.micro,
    caption: typography.caption,
    label: typography.label,
    body: typography.body,
    bodyStrong: typography.bodyStrong,
    title: typography.title,
    screenTitle: typography.screenTitle,
    sectionTitle: typography.sectionTitle,

    now: {
      tab: {
        fontSize: 15,
        fontWeight: "800" as const,
      },
      statusBadge: {
        fontSize: 10,
        fontWeight: "900" as const,
        letterSpacing: 0.5,
      },
      audienceBadge: {
        fontSize: 11,
        fontWeight: "800" as const,
      },
      cardPlace: {
        fontSize: 13,
        lineHeight: 17,
        fontWeight: "800" as const,
      },
      cardTitle: {
        fontSize: 13,
        lineHeight: 17,
        fontWeight: "600" as const,
      },
      emptyTitle: {
        fontSize: 18,
        fontWeight: "800" as const,
      },
      emptyDescription: {
        fontSize: 14,
        lineHeight: 20,
      },
    },

    liveViewer: {
      emptyTitle: {
        fontSize: 17,
        fontWeight: "600" as const,
      },
      emptyDescription: {
        fontSize: 14,
        fontWeight: "400" as const,
      },
    },
  },

  space: {
    ...spacing,
    now: {
      gridHorizontal: 10,
      gridColumnGap: 8,
      gridTop: 10,
      gridBottom: 28,
      headerHorizontal: 22,
      headerBottom: 12,
      headerActionsGap: 8,
      tabsHorizontal: 36,
      tabIndicatorTop: 11,
      cardInset: 11,
      cardTopInset: 9,
      cardTitleTop: 2,
      emptyHorizontal: 36,
      emptyDescriptionTop: 8,
    },
    liveViewer: {
      emptyHorizontal: 32,
      emptyDescriptionTop: 6,
    },
  },

  radius: {
    ...radius,
    now: {
      card: 15,
      statusBadge: 7,
      audienceBadge: 999,
      tabIndicator: 2,
    },
  },

  icon: {
    ...iconSizes,
    now: {
      search: 26,
      audience: 12,
    },
  },

  control: {
    ...controls,
    now: {
      headerHeight: 78,
      logoWidth: 112,
      logoHeight: 46,
      iconButton: 36,
      tabsHeight: 48,
      tabMinWidth: 82,
      tabHeight: 40,
      tabIndicatorWidth: 34,
      tabIndicatorHeight: 3,
      statusBadgeMinHeight: 24,
      audienceBadgeMinHeight: 24,
    },
  },

  layout: {
    ...layout,
  },

  shadow: {
    nowCardText: {
      color: "rgba(0,0,0,0.7)",
      offset: {
        width: 0,
        height: 1,
      },
      radius: 2,
    },
  },
} as const;
