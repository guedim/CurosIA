/**
 * Seed comercial (Sprint MVP-Final): productos de tienda y sponsors.
 * Idempotente vía `ON CONFLICT (slug) DO NOTHING`.
 *
 * Uso:
 *   pnpm --filter @platzi-fc/db seed:commerce
 */
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });
loadEnv({ path: '.env' });

import { getDb } from '../src/client';
import { products, sponsors, type NewProduct, type NewSponsor } from '../src/schema';

const db = getDb();

const PRODUCTS: NewProduct[] = [
  // Equipación
  {
    slug: 'camiseta-primera-equipacion-2026',
    nombre: 'Camiseta 1ª equipación 2026',
    descripcion:
      'Camiseta oficial local de la temporada 2026. Tejido transpirable y escudo bordado.',
    categoria: 'equipacion',
    priceCents: 8999,
    imageUrl: '/placeholders/product-jersey-home.jpg',
    imageAlt: 'Camiseta primera equipación',
    externalUrl: 'https://tienda.platzifc.example/camiseta-primera-equipacion-2026',
    destacado: true,
  },
  {
    slug: 'camiseta-segunda-equipacion-2026',
    nombre: 'Camiseta 2ª equipación 2026',
    descripcion:
      'Camiseta oficial visitante de la temporada 2026. Colores alternos y tejido ligero.',
    categoria: 'equipacion',
    priceCents: 8999,
    imageUrl: '/placeholders/product-jersey-away.jpg',
    imageAlt: 'Camiseta segunda equipación',
    externalUrl: 'https://tienda.platzifc.example/camiseta-segunda-equipacion-2026',
  },
  {
    slug: 'camiseta-tercera-equipacion-2026',
    nombre: 'Camiseta 3ª equipación 2026',
    descripcion: 'Edición especial inspirada en los colores históricos del club.',
    categoria: 'equipacion',
    priceCents: 9499,
    imageUrl: '/placeholders/product-jersey-third.jpg',
    imageAlt: 'Camiseta tercera equipación',
    externalUrl: 'https://tienda.platzifc.example/camiseta-tercera-equipacion-2026',
    destacado: true,
  },
  {
    slug: 'pantalon-juego-local',
    nombre: 'Pantalón de juego — local',
    descripcion: 'Pantalón corto a juego con la primera equipación.',
    categoria: 'equipacion',
    priceCents: 4499,
    imageUrl: '/placeholders/product-shorts.jpg',
    imageAlt: 'Pantalón corto de juego',
    externalUrl: 'https://tienda.platzifc.example/pantalon-juego-local',
  },
  // Training
  {
    slug: 'chandal-entrenamiento-2026',
    nombre: 'Chándal de entrenamiento 2026',
    descripcion: 'Usado por el primer equipo. Poliéster reciclado y bolsillos con cremallera.',
    categoria: 'training',
    priceCents: 11999,
    imageUrl: '/placeholders/product-tracksuit.jpg',
    imageAlt: 'Chándal de entrenamiento',
    externalUrl: 'https://tienda.platzifc.example/chandal-entrenamiento-2026',
  },
  {
    slug: 'sudadera-entrenamiento',
    nombre: 'Sudadera de entrenamiento',
    descripcion: 'Sudadera con capucha y escudo estampado. Ideal para uso diario.',
    categoria: 'training',
    priceCents: 6499,
    imageUrl: '/placeholders/product-hoodie.jpg',
    imageAlt: 'Sudadera con capucha',
    externalUrl: 'https://tienda.platzifc.example/sudadera-entrenamiento',
  },
  // Lifestyle
  {
    slug: 'polo-retro-aficionado',
    nombre: 'Polo retro aficionado',
    descripcion: 'Inspirado en la equipación histórica de 1987. Edición limitada.',
    categoria: 'lifestyle',
    priceCents: 5499,
    imageUrl: '/placeholders/product-polo.jpg',
    imageAlt: 'Polo retro',
    externalUrl: 'https://tienda.platzifc.example/polo-retro-aficionado',
    destacado: true,
  },
  {
    slug: 'gorra-clasica-escudo',
    nombre: 'Gorra clásica con escudo',
    descripcion: 'Gorra ajustable con escudo bordado.',
    categoria: 'lifestyle',
    priceCents: 2499,
    imageUrl: '/placeholders/product-cap.jpg',
    imageAlt: 'Gorra con escudo del club',
    externalUrl: 'https://tienda.platzifc.example/gorra-clasica-escudo',
  },
  // Accesorios
  {
    slug: 'bufanda-oficial',
    nombre: 'Bufanda oficial',
    descripcion: 'Bufanda tejida con los colores del club. Perfecta para los días de partido.',
    categoria: 'accesorios',
    priceCents: 1999,
    imageUrl: '/placeholders/product-scarf.jpg',
    imageAlt: 'Bufanda oficial del club',
    externalUrl: 'https://tienda.platzifc.example/bufanda-oficial',
  },
  {
    slug: 'mochila-entrenamiento',
    nombre: 'Mochila de entrenamiento',
    descripcion: 'Mochila con compartimentos para botines y equipación.',
    categoria: 'accesorios',
    priceCents: 4999,
    imageUrl: '/placeholders/product-backpack.jpg',
    imageAlt: 'Mochila de entrenamiento',
    externalUrl: 'https://tienda.platzifc.example/mochila-entrenamiento',
  },
  {
    slug: 'taza-aficionado',
    nombre: 'Taza del aficionado',
    descripcion: 'Taza cerámica con el escudo del club. Apta para microondas.',
    categoria: 'accesorios',
    priceCents: 1299,
    imageUrl: '/placeholders/product-mug.jpg',
    imageAlt: 'Taza del aficionado',
    externalUrl: 'https://tienda.platzifc.example/taza-aficionado',
  },
  // Coleccionismo
  {
    slug: 'balon-oficial-2026',
    nombre: 'Balón oficial 2026',
    descripcion: 'Réplica del balón utilizado en partidos oficiales. Talla 5 cosida a máquina.',
    categoria: 'coleccionismo',
    priceCents: 3999,
    imageUrl: '/placeholders/product-ball.jpg',
    imageAlt: 'Balón oficial del club',
    externalUrl: 'https://tienda.platzifc.example/balon-oficial-2026',
  },
  {
    slug: 'poster-plantilla-2026',
    nombre: 'Póster plantilla 2026',
    descripcion: 'Póster oficial de la plantilla 2026 con firmas impresas del primer equipo.',
    categoria: 'coleccionismo',
    priceCents: 1499,
    imageUrl: '/placeholders/product-poster.jpg',
    imageAlt: 'Póster de la plantilla',
    externalUrl: 'https://tienda.platzifc.example/poster-plantilla-2026',
  },
  {
    slug: 'llavero-escudo-metal',
    nombre: 'Llavero escudo de metal',
    descripcion: 'Llavero metálico con escudo esmaltado.',
    categoria: 'coleccionismo',
    priceCents: 899,
    imageUrl: '/placeholders/product-keyring.jpg',
    imageAlt: 'Llavero con escudo',
    externalUrl: 'https://tienda.platzifc.example/llavero-escudo-metal',
  },
];

const SPONSORS: NewSponsor[] = [
  // Principal
  {
    slug: 'platzi-academy',
    nombre: 'Platzi Academy',
    tier: 'principal',
    logoUrl: '/placeholders/sponsor-platzi.svg',
    url: 'https://platzi.com',
    descripcion:
      'Patrocinador principal del primer equipo. Aliado en formación tecnológica del club y la cantera.',
    orden: 1,
  },
  // Premium
  {
    slug: 'banco-futuro',
    nombre: 'Banco Futuro',
    tier: 'premium',
    logoUrl: '/placeholders/sponsor-banco.svg',
    url: 'https://bancofuturo.example',
    descripcion: 'Entidad financiera oficial del club y patrocinador de la tarjeta de abonado.',
    orden: 1,
  },
  {
    slug: 'nova-telecom',
    nombre: 'Nova Telecom',
    tier: 'premium',
    logoUrl: '/placeholders/sponsor-nova.svg',
    url: 'https://novatelecom.example',
    descripcion: 'Conectividad oficial del estadio y patrocinador de retransmisiones.',
    orden: 2,
  },
  {
    slug: 'energia-verde',
    nombre: 'Energía Verde',
    tier: 'premium',
    logoUrl: '/placeholders/sponsor-energia.svg',
    url: 'https://energiaverde.example',
    descripcion: 'Proveedor oficial de energía renovable para las instalaciones deportivas.',
    orden: 3,
  },
  // Partners
  {
    slug: 'aerolinea-oficial',
    nombre: 'Aerolínea Oficial',
    tier: 'partner',
    logoUrl: '/placeholders/sponsor-aerolinea.svg',
    url: 'https://aerolinea.example',
    descripcion: 'Aerolínea oficial de los desplazamientos del primer equipo.',
    orden: 1,
  },
  {
    slug: 'agua-mineral-cima',
    nombre: 'Agua Mineral Cima',
    tier: 'partner',
    logoUrl: '/placeholders/sponsor-agua.svg',
    url: 'https://aguacima.example',
    descripcion: 'Agua oficial del club y de la academia.',
    orden: 2,
  },
  {
    slug: 'clinica-deportiva-salud',
    nombre: 'Clínica Deportiva Salud',
    tier: 'partner',
    logoUrl: '/placeholders/sponsor-clinica.svg',
    url: 'https://clinicasalud.example',
    descripcion: 'Servicios médicos oficiales del primer equipo y la cantera.',
    orden: 3,
  },
  {
    slug: 'hotel-estadio',
    nombre: 'Hotel Estadio',
    tier: 'partner',
    logoUrl: '/placeholders/sponsor-hotel.svg',
    url: 'https://hotelestadio.example',
    descripcion: 'Hotel oficial del club para concentraciones locales.',
    orden: 4,
  },
];

async function main() {
  const insertedProducts = await db
    .insert(products)
    .values(PRODUCTS)
    .onConflictDoNothing({ target: products.slug })
    .returning({ id: products.id });

  const insertedSponsors = await db
    .insert(sponsors)
    .values(SPONSORS)
    .onConflictDoNothing({ target: sponsors.slug })
    .returning({ id: sponsors.id });

  console.log(
    `[seed-commerce] OK — products=${PRODUCTS.length} (${insertedProducts.length} nuevos), sponsors=${SPONSORS.length} (${insertedSponsors.length} nuevos)`,
  );
  process.exit(0);
}

main().catch((err) => {
  console.error('[seed-commerce] FAIL:', err);
  process.exit(1);
});
