// src/api/apiConfig.ts

import {
  Platform,
} from "react-native";

const LOCAL_API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3001"
    : "http://localhost:3001";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  LOCAL_API_URL;