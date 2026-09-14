// scripts/delete-empty-mock-lives.ts

import {
  prisma,
} from "../server/db";

async function main() {
  const emptyMockLives =
    await prisma.liveSession.findMany({
      where: {
        roomName: {
          startsWith:
            "allive_dev_",
        },

        OR: [
          {
            thumbnailUrl:
              null,
          },
          {
            thumbnailUrl:
              "",
          },
        ],
      },

      select: {
        id: true,
        roomName: true,
        title: true,
      },
    });

  if (
    emptyMockLives.length === 0
  ) {
    console.log(
      "No hay LIVE mock sin thumbnail.",
    );

    return;
  }

  console.log(
    "Se eliminarán estos LIVE mock:",
  );

  for (
    const live of emptyMockLives
  ) {
    console.log(
      `- ${live.roomName}: ${live.title ?? "Sin título"}`,
    );
  }

  const result =
    await prisma.liveSession.deleteMany({
      where: {
        id: {
          in: emptyMockLives.map(
            (live) =>
              live.id,
          ),
        },
      },
    });

  console.log(
    `LIVE mock eliminados: ${result.count}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });