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

  .allive-map-content-icon {
    background: transparent;
    border: 0;
  }

  .allive-map-content-marker {
    width: 38px;
    height: 38px;
    border-radius: 19px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border: 2px solid rgba(255,255,255,0.92);
    color: #ffffff;
    font-size: 13px;
    font-weight: 800;
    background: rgba(10,10,10,0.90);
    box-shadow: 0 2px 14px rgba(0,0,0,0.38);
  }

  .allive-map-content-marker.is-live {
    background: #FF3B30;
  }

  .allive-map-content-marker.is-replay {
    background: #168CFF;
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
