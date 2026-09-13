// src/components/navigation/BottomNav/bottomNav.config.ts
import { type ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import { type AppTab } from "../../../navigation/navigation.types";

export type BottomNavItem = {
  id: AppTab;
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
};

export const bottomNavItems: BottomNavItem[] = [
  { id: "now", label: "NOW", icon: "play-circle-outline" },
  { id: "map", label: "MAPA", icon: "map-outline" },
  { id: "emit", label: "EMITIR", icon: "radio-outline" },
  { id: "search", label: "BUSCAR", icon: "search-outline" },
  { id: "profile", label: "TÚ", icon: "person-outline" },
];
