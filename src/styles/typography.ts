// src/styles/typography.ts

import {
  Platform,
} from "react-native";

export const appFontFamily =
  Platform.select({
    web:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    default: "System",
  }) ?? "System";

export const typography = {
  micro: {
    fontFamily: appFontFamily,
    fontSize: 9,
    fontWeight: "700" as const,
  },
  caption: {
    fontFamily: appFontFamily,
    fontSize: 11,
    fontWeight: "600" as const,
  },
  label: {
    fontFamily: appFontFamily,
    fontSize: 12,
    fontWeight: "700" as const,
  },
  body: {
    fontFamily: appFontFamily,
    fontSize: 14,
    fontWeight: "400" as const,
  },
  bodyStrong: {
    fontFamily: appFontFamily,
    fontSize: 14,
    fontWeight: "700" as const,
  },
  title: {
    fontFamily: appFontFamily,
    fontSize: 17,
    fontWeight: "800" as const,
  },
  screenTitle: {
    fontFamily: appFontFamily,
    fontSize: 28,
    fontWeight: "900" as const,
  },
  sectionTitle: {
    fontFamily: appFontFamily,
    fontSize: 16,
    fontWeight: "900" as const,
  },
} as const;
