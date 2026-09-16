/*
 * Script manual de prueba.
 *
 * Uso:
 *
 * npx tsx server/liveRecording/testParallelRecording.ts ROOM_NAME LIVE_SESSION_ID
 *
 * El LIVE debe estar emitiendo antes de ejecutar el script.
 *
 * El script:
 * 1. localiza broadcaster + pistas,
 * 2. inicia Track Egress de vídeo y audio,
 * 3. espera 20 segundos,
 * 4. detiene ambos,
 * 5. imprime los datos para comprobar R2.
 */

import "dotenv/config";

import {
  startParallelRecording,
  stopParallelRecording,
} from "./index";

async function main() {
  const roomName =
    process.argv[2];

  const liveSessionId =
    process.argv[3];

  if (
    !roomName ||
    !liveSessionId
  ) {
    throw new Error(
      "Uso: npx tsx server/liveRecording/testParallelRecording.ts ROOM_NAME LIVE_SESSION_ID",
    );
  }

  console.log(
    "Iniciando grabación passthrough...",
  );

  const recording =
    await startParallelRecording(
      roomName,
      liveSessionId,
    );

  console.log(
    "Grabación iniciada:",
    JSON.stringify(
      recording,
      null,
      2,
    ),
  );

  console.log(
    "Grabando durante 20 segundos...",
  );

  await new Promise(
    (resolve) => {
      setTimeout(
        resolve,
        20_000,
      );
    },
  );

  console.log(
    "Deteniendo grabación...",
  );

  const stopResults =
    await stopParallelRecording(
      recording,
    );

  console.log(
    "Resultado stop:",
    JSON.stringify(
      stopResults,
      null,
      2,
    ),
  );

  console.log(
    "Prueba terminada. Comprueba live-replays-raw/ en R2.",
  );
}

main().catch(
  (error) => {
    console.error(
      "Error en prueba de grabación paralela:",
      error,
    );

    process.exitCode = 1;
  },
);
