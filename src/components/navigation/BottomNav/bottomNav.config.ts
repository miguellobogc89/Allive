// src/components/navigation/BottomNav/bottomNav.config.ts

import { Ionicons } from "@expo/vector-icons";
import { type ComponentProps } from "react";
import { type AppTab } from "../../../navigation/navigation.types";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

export type BottomNavItem = {
  id: AppTab;
  label: string;
  icon: IoniconName;
  activeIcon: IoniconName;
};

export const bottomNavItems: BottomNavItem[] = [
  {
    id: "now",
    label: "NOW",
    icon: "home-outline",
    activeIcon: "home",
  },
  {
    id: "map",
    label: "MAPA",
    icon: "map-outline",
    activeIcon: "map",
  },
  {
    id: "emit",
    label: "EMITIR",
    icon: "videocam-outline",
    activeIcon: "videocam",
  },
  {
    id: "search",
    label: "BUSCAR",
    icon: "search-outline",
    activeIcon: "search",
  },
  {
    id: "profile",
    label: "TÚ",
    icon: "person-outline",
    activeIcon: "person",
  },
];