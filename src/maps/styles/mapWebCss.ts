// src/maps/styles/mapWebCss.ts

export const MAP_WEB_STYLE_ID = "allive-map-web-styles";

export const mapWebCss = `
  .allive-leaflet-map {
    width: 100%;
    height: 100%;
    background: #0b1117;
  }

  .allive-map-pulse-icon {
    background: transparent;
    border: 0;
  }

  .allive-map-pulse {
    position: relative;
    width: 34px;
    height: 34px;
  }

  .allive-map-pulse::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: #ff334f;
    opacity: 0.34;
    animation: allive-map-pulse 1.8s ease-out infinite;
  }

  .allive-map-pulse::after {
    content: "";
    position: absolute;
    left: 10px;
    top: 10px;
    width: 14px;
    height: 14px;
    box-sizing: border-box;
    border: 2px solid #ffffff;
    border-radius: 50%;
    background: #ff334f;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.36);
  }

  @keyframes allive-map-pulse {
    0% {
      transform: scale(0.55);
      opacity: 0.55;
    }
    75% {
      transform: scale(1.35);
      opacity: 0;
    }
    100% {
      transform: scale(1.35);
      opacity: 0;
    }
  }

  .leaflet-control-attribution {
    font-size: 9px;
  }
`;
