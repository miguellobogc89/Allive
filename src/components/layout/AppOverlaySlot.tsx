// src/components/layout/AppOverlaySlot.tsx

import {
  type ReactNode,
  useEffect,
} from "react";

import {
  type AppOverlaySlotName,
  useAppOverlaySlotContext,
} from "./AppOverlaySlotContext";

type AppOverlaySlotProps = {
  name: AppOverlaySlotName;
  children: ReactNode;
};

export function AppOverlaySlot({
  name,
  children,
}: AppOverlaySlotProps) {
  const context =
    useAppOverlaySlotContext();

  useEffect(() => {
    if (!context) {
      return;
    }

    context.setSlot(
      name,
      children,
    );

    return () => {
      context.setSlot(
        name,
        null,
      );
    };
  }, [
    context,
    name,
    children,
  ]);

  return null;
}