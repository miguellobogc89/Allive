// scripts/seed-search.ts

import { hash } from "bcryptjs";

import { prisma } from "../server/db";

const DEV_PREFIX = "allive_dev_";
const DEV_EMAIL_DOMAIN = "dev.allive.local";

type SeedUser = {
  username: string;
  displayName: string;
};

type SeedLive = {
  username: string;
  title: string;
  description: string;
  eventName: string | null;
  placeName: string;
  latitude: number;
  longitude: number;
  minutesAgo: number;
};

const users: SeedUser[] = [
  { username: "lucia_travel", displayName: "Lucía Martín" },
  { username: "dani_music", displayName: "Dani Romero" },
  { username: "marta_food", displayName: "Marta López" },
  { username: "alex_futbol", displayName: "Álex García" },
  { username: "sofia_city", displayName: "Sofía Torres" },
  { username: "pablo_night", displayName: "Pablo Ruiz" },
  { username: "laura_beach", displayName: "Laura Sánchez" },
  { username: "sergio_motor", displayName: "Sergio Vega" },
  { username: "carmen_art", displayName: "Carmen Díaz" },
  { username: "marcos_live", displayName: "Marcos León" },
  { username: "ana_events", displayName: "Ana Moreno" },
  { username: "javi_street", displayName: "Javi Ramos" },
];

const lives: SeedLive[] = [
  {
    username: "lucia_travel",
    title: "Atardecer desde Triana",
    description: "Paseando junto al Guadalquivir mientras cae el sol.",
    eventName: null,
    placeName: "Triana, Sevilla",
    latitude: 37.3826,
    longitude: -6.0034,
    minutesAgo: 8,
  },
  {
    username: "dani_music",
    title: "Concierto en directo",
    description: "Música en vivo desde el centro de Sevilla.",
    eventName: "Noches de Sevilla",
    placeName: "Alameda de Hércules, Sevilla",
    latitude: 37.3993,
    longitude: -5.9942,
    minutesAgo: 14,
  },
  {
    username: "marta_food",
    title: "Probando las mejores tapas",
    description: "Ruta de tapas por el centro histórico.",
    eventName: null,
    placeName: "Centro, Sevilla",
    latitude: 37.3891,
    longitude: -5.9845,
    minutesAgo: 21,
  },
  {
    username: "alex_futbol",
    title: "Ambiente antes del partido",
    description: "La previa con los aficionados antes de entrar al estadio.",
    eventName: "Partido de fútbol",
    placeName: "Nervión, Sevilla",
    latitude: 37.384,
    longitude: -5.9705,
    minutesAgo: 4,
  },
  {
    username: "sofia_city",
    title: "Madrid ahora mismo",
    description: "Recorriendo Gran Vía en plena tarde.",
    eventName: null,
    placeName: "Gran Vía, Madrid",
    latitude: 40.4203,
    longitude: -3.7058,
    minutesAgo: 11,
  },
  {
    username: "pablo_night",
    title: "La noche empieza en Malasaña",
    description: "Bares, calles y ambiente en directo.",
    eventName: null,
    placeName: "Malasaña, Madrid",
    latitude: 40.4256,
    longitude: -3.7045,
    minutesAgo: 17,
  },
  {
    username: "laura_beach",
    title: "Playa de la Barceloneta",
    description: "Así está la playa ahora mismo.",
    eventName: null,
    placeName: "Barceloneta, Barcelona",
    latitude: 41.3784,
    longitude: 2.1925,
    minutesAgo: 6,
  },
  {
    username: "sergio_motor",
    title: "Ruta de motos por Barcelona",
    description: "Rodando por la ciudad y enseñando el ambiente.",
    eventName: "Motor Live",
    placeName: "Barcelona",
    latitude: 41.3874,
    longitude: 2.1686,
    minutesAgo: 26,
  },
  {
    username: "carmen_art",
    title: "Arte urbano en Valencia",
    description: "Descubriendo murales y artistas por las calles.",
    eventName: null,
    placeName: "El Carmen, Valencia",
    latitude: 39.4766,
    longitude: -0.3792,
    minutesAgo: 32,
  },
  {
    username: "marcos_live",
    title: "Ciudad de las Artes en directo",
    description: "Un paseo en directo por uno de los lugares más conocidos de Valencia.",
    eventName: null,
    placeName: "Valencia",
    latitude: 39.4549,
    longitude: -0.3505,
    minutesAgo: 9,
  },
  {
    username: "ana_events",
    title: "Festival en Málaga",
    description: "Entramos al festival y vemos cómo está el ambiente.",
    eventName: "Málaga Live Festival",
    placeName: "Málaga",
    latitude: 36.7213,
    longitude: -4.4214,
    minutesAgo: 3,
  },
  {
    username: "javi_street",
    title: "Centro de Málaga lleno",
    description: "Paseo por las calles del centro.",
    eventName: null,
    placeName: "Centro Histórico, Málaga",
    latitude: 36.721,
    longitude: -4.419,
    minutesAgo: 19,
  },
  {
    username: "lucia_travel",
    title: "La Giralda desde abajo",
    description: "Estamos junto a la Catedral viendo el ambiente.",
    eventName: null,
    placeName: "Catedral de Sevilla",
    latitude: 37.3861,
    longitude: -5.9926,
    minutesAgo: 36,
  },
  {
    username: "dani_music",
    title: "Músicos callejeros en Sevilla",
    description: "Nos hemos encontrado este concierto improvisado.",
    eventName: "Música callejera",
    placeName: "Plaza Nueva, Sevilla",
    latitude: 37.3886,
    longitude: -5.9954,
    minutesAgo: 13,
  },
  {
    username: "marta_food",
    title: "Mercado de Triana en directo",
    description: "Comida, puestos y ambiente desde el mercado.",
    eventName: null,
    placeName: "Mercado de Triana, Sevilla",
    latitude: 37.385,
    longitude: -6.0038,
    minutesAgo: 28,
  },
  {
    username: "alex_futbol",
    title: "Celebración en las calles",
    description: "Los aficionados están celebrando por todo el centro.",
    eventName: "Celebración fútbol",
    placeName: "Puerta del Sol, Madrid",
    latitude: 40.4169,
    longitude: -3.7035,
    minutesAgo: 2,
  },
  {
    username: "sofia_city",
    title: "Retiro en directo",
    description: "Una vuelta por el parque para ver cómo está esta tarde.",
    eventName: null,
    placeName: "Parque del Retiro, Madrid",
    latitude: 40.4153,
    longitude: -3.6844,
    minutesAgo: 42,
  },
  {
    username: "pablo_night",
    title: "Fiesta en Barcelona",
    description: "Entramos en una de las zonas con más ambiente.",
    eventName: "Barcelona Night",
    placeName: "El Born, Barcelona",
    latitude: 41.3852,
    longitude: 2.1824,
    minutesAgo: 7,
  },
  {
    username: "laura_beach",
    title: "Atardecer en Cádiz",
    description: "El sol está cayendo sobre La Caleta.",
    eventName: null,
    placeName: "La Caleta, Cádiz",
    latitude: 36.5297,
    longitude: -6.305,
    minutesAgo: 15,
  },
  {
    username: "sergio_motor",
    title: "Coches clásicos en exposición",
    description: "Una concentración de clásicos que acaba de empezar.",
    eventName: "Classic Motor Show",
    placeName: "Sevilla",
    latitude: 37.403,
    longitude: -5.975,
    minutesAgo: 23,
  },
  {
    username: "carmen_art",
    title: "Exposición en directo",
    description: "Visitamos una exposición temporal y vemos las nuevas obras.",
    eventName: "Arte Ahora",
    placeName: "Madrid",
    latitude: 40.4138,
    longitude: -3.6921,
    minutesAgo: 31,
  },
  {
    username: "marcos_live",
    title: "Tormenta llegando a Sevilla",
    description: "El cielo está cambiando muy rápido. Lo vemos en directo.",
    eventName: null,
    placeName: "Sevilla",
    latitude: 37.3898,
    longitude: -5.976,
    minutesAgo: 1,
  },
  {
    username: "ana_events",
    title: "Feria gastronómica",
    description: "Muchísimos puestos y comida de toda Andalucía.",
    eventName: "Sabores de Andalucía",
    placeName: "Córdoba",
    latitude: 37.8882,
    longitude: -4.7794,
    minutesAgo: 18,
  },
  {
    username: "javi_street",
    title: "Qué está pasando en Plaza de España",
    description: "Hay muchísima gente y música ahora mismo.",
    eventName: null,
    placeName: "Plaza de España, Sevilla",
    latitude: 37.3772,
    longitude: -5.9869,
    minutesAgo: 5,
  },
];

async function main() {
  console.log("Creando datos DEV para buscador...");

  const passwordHash = await hash("AlliveDev123!", 10);

  const createdUsers = new Map<string, string>();

  for (const user of users) {
    const email = `${DEV_PREFIX}${user.username}@${DEV_EMAIL_DOMAIN}`;

    const dbUser = await prisma.user.upsert({
      where: {
        username: user.username,
      },
      update: {
        displayName: user.displayName,
      },
      create: {
        username: user.username,
        displayName: user.displayName,
        email,
        password_hash: passwordHash,
      },
    });

    createdUsers.set(user.username, dbUser.id);
  }

  await prisma.liveSession.deleteMany({
    where: {
      roomName: {
        startsWith: DEV_PREFIX,
      },
    },
  });

  const now = Date.now();

  for (let index = 0; index < lives.length; index += 1) {
    const live = lives[index];
    const creatorId = createdUsers.get(live.username);

    if (!creatorId) {
      throw new Error(
        `No existe el usuario DEV ${live.username}`,
      );
    }

    const startedAt = new Date(
      now - live.minutesAgo * 60 * 1000,
    );

    await prisma.liveSession.create({
      data: {
        roomName: `${DEV_PREFIX}live_${index + 1}`,
        creatorId,
        status: "LIVE",
        title: live.title,
        description: live.description,
        eventName: live.eventName,
        placeName: live.placeName,
        latitude: live.latitude,
        longitude: live.longitude,
        startedAt,
      },
    });
  }

  console.log("");
  console.log(`Usuarios DEV: ${users.length}`);
  console.log(`Directos DEV: ${lives.length}`);
  console.log("");
  console.log("Seed terminado.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });