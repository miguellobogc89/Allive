// src/components/navigation/BottomNav/bottomNav.config.ts

import {
  Flame,
  Search,
  SquarePlay,
  UserRound,
  Video,
  type LucideIcon,
} from "lucide-react-native";

import { type AppTab } from "../../../navigation/navigation.types";

export type BottomNavItem = {
  id: AppTab;
  label: string;
  Icon: LucideIcon;
};

export const bottomNavItems: BottomNavItem[] = [
  {
    id: "now",
    label: "Now",
    Icon: SquarePlay,
  },
  {
    id: "hot",
    label: "Hot",
    Icon: Flame,
  },
  {
    id: "emit",
    label: "Emitir",
    Icon: Video,
  },
  {
    id: "search",
    label: "Buscar",
    Icon: Search,
  },
  {
    id: "profile",
    label: "Perfil",
    Icon: UserRound,
  },
];