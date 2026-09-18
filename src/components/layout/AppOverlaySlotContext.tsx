// src/components/layout/AppOverlaySlotContext.tsx

import {
  createContext,
  type ReactNode,
  useContext,
} from "react";

export type AppOverlaySlotName =
  | "header"
  | "sideActions"
  | "comments"
  | "metadata"
  | "bottomControls";

export type AppOverlaySlots = {
  header: ReactNode | null;
  sideActions: ReactNode | null;
  comments: ReactNode | null;
  metadata: ReactNode | null;
  bottomControls: ReactNode | null;
};

type AppOverlaySlotContextValue = {
  setSlot: (
    name: AppOverlaySlotName,
    content: ReactNode | null,
  ) => void;
};

export const AppOverlaySlotContext =
  createContext<AppOverlaySlotContextValue | null>(
    null,
  );

export function useAppOverlaySlotContext() {
  return useContext(
    AppOverlaySlotContext,
  );
}