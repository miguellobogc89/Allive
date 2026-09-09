// src/maps/web/loadLeaflet.ts

import {
  MAP_WEB_STYLE_ID,
  mapWebCss,
} from "../styles/mapWebCss";
import type { LeafletGlobal } from "./leafletTypes";

declare global {
  interface Window {
    L?: LeafletGlobal;
  }
}

const LEAFLET_CSS_ID = "allive-leaflet-css";
const LEAFLET_SCRIPT_ID = "allive-leaflet-script";

function ensureLeafletCss() {
  if (!document.getElementById(LEAFLET_CSS_ID)) {
    const link = document.createElement("link");
    link.id = LEAFLET_CSS_ID;
    link.rel = "stylesheet";
    link.href =
      "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
  }

  if (!document.getElementById(MAP_WEB_STYLE_ID)) {
    const style = document.createElement("style");
    style.id = MAP_WEB_STYLE_ID;
    style.textContent = mapWebCss;
    document.head.appendChild(style);
  }
}

export async function loadLeaflet(): Promise<LeafletGlobal> {
  if (window.L) {
    ensureLeafletCss();
    return window.L;
  }

  ensureLeafletCss();

  const existingScript = document.getElementById(
    LEAFLET_SCRIPT_ID,
  ) as HTMLScriptElement | null;

  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener("load", () => {
        if (window.L) {
          resolve(window.L);
          return;
        }

        reject(new Error("Leaflet no quedó disponible"));
      });

      existingScript.addEventListener("error", () => {
        reject(new Error("No se pudo cargar Leaflet"));
      });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = LEAFLET_SCRIPT_ID;
    script.src =
      "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;

    script.onload = () => {
      if (window.L) {
        resolve(window.L);
        return;
      }

      reject(new Error("Leaflet no quedó disponible"));
    };

    script.onerror = () => {
      reject(new Error("No se pudo cargar Leaflet"));
    };

    document.head.appendChild(script);
  });
}
