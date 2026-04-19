/**
 * Seed del Sprint V1-3: tiers de membresía y eventos de comunidad.
 * Idempotente vía `ON CONFLICT (slug) DO NOTHING`.
 *
 *   pnpm --filter @platzi-fc/db seed:fans
 */
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });
loadEnv({ path: '.env' });

import { getDb } from '../src/client';
import {
  communityEvents,
  memberships,
  type NewCommunityEvent,
  type NewMembership,
} from '../src/schema';

const db = getDb();

const now = new Date();

function daysFromNow(n: number): Date {
  const d = new Date(now);
  d.setDate(d.getDate() + n);
  return d;
}

function hoursFromDate(base: Date, h: number): Date {
  const d = new Date(base);
  d.setHours(d.getHours() + h);
  return d;
}

const MEMBERSHIPS: NewMembership[] = [
  {
    slug: 'fan-basico',
    tier: 'fan',
    nombre: 'Fan',
    descripcion:
      'La puerta de entrada al universo Platzi FC. Ideal para seguir al club con ventajas básicas.',
    priceCents: 1500,
    currency: 'EUR',
    benefits: [
      'Boletín quincenal exclusivo',
      'Descuento del 5% en la tienda oficial',
      'Acceso anticipado a contenidos audiovisuales',
      'Invitación a un sorteo mensual',
    ],
    heroUrl: '/placeholders/membership-fan.jpg',
    externalCheckoutUrl: 'https://socios.platzifc.example/fan',
    orden: 1,
    activo: true,
  },
  {
    slug: 'socio-anual',
    tier: 'socio',
    nombre: 'Socio',
    descripcion:
      'La experiencia clásica de socio. Acceso preferente a entradas y descuentos ampliados.',
    priceCents: 6900,
    currency: 'EUR',
    benefits: [
      'Todo lo del plan Fan',
      'Preventa de entradas 48h antes',
      'Descuento del 10% en tienda y restaurantes socios',
      'Carnet físico personalizado',
      'Invitación a un entrenamiento abierto al año',
    ],
    heroUrl: '/placeholders/membership-socio.jpg',
    externalCheckoutUrl: 'https://socios.platzifc.example/socio',
    orden: 2,
    activo: true,
  },
  {
    slug: 'socio-premium',
    tier: 'premium',
    nombre: 'Premium',
    descripcion:
      'Experiencia premium con acceso a la sala de socios y encuentros exclusivos con la plantilla.',
    priceCents: 14900,
    currency: 'EUR',
    benefits: [
      'Todo lo del plan Socio',
      'Acceso a la sala de socios los días de partido',
      'Visita anual guiada a la ciudad deportiva',
      'Meet & greet semestral con la plantilla',
      'Regalo de bienvenida con pack oficial',
    ],
    heroUrl: '/placeholders/membership-premium.jpg',
    externalCheckoutUrl: 'https://socios.platzifc.example/premium',
    orden: 3,
    activo: true,
  },
  {
    slug: 'legend-club',
    tier: 'legend',
    nombre: 'Legend',
    descripcion:
      'El nivel más exclusivo del club. Plazas limitadas, experiencias únicas y vínculo directo con la entidad.',
    priceCents: 49900,
    currency: 'EUR',
    benefits: [
      'Todo lo del plan Premium',
      'Asiento preferente en Tribuna principal',
      'Invitación a la cena anual del club',
      'Saque de honor en un partido oficial',
      'Acceso a palco VIP en partidos señalados',
      'Atención personalizada por el equipo de socios',
    ],
    heroUrl: '/placeholders/membership-legend.jpg',
    externalCheckoutUrl: 'https://socios.platzifc.example/legend',
    orden: 4,
    activo: true,
  },
];

const EVENT_BASE_A = daysFromNow(5);
EVENT_BASE_A.setHours(17, 0, 0, 0);
const EVENT_BASE_B = daysFromNow(12);
EVENT_BASE_B.setHours(11, 0, 0, 0);
const EVENT_BASE_C = daysFromNow(20);
EVENT_BASE_C.setHours(10, 0, 0, 0);
const EVENT_BASE_D = daysFromNow(30);
EVENT_BASE_D.setHours(18, 30, 0, 0);
const EVENT_BASE_E = daysFromNow(45);
EVENT_BASE_E.setHours(9, 30, 0, 0);
const EVENT_BASE_F = daysFromNow(-10);
EVENT_BASE_F.setHours(18, 0, 0, 0);

const COMMUNITY_EVENTS: NewCommunityEvent[] = [
  {
    slug: 'puertas-abiertas-ciudad-deportiva',
    titulo: 'Puertas abiertas en la ciudad deportiva',
    descripcion:
      'Visita guiada gratuita a la ciudad deportiva: campos de entrenamiento, gimnasio de alto rendimiento y museo del club.',
    tipo: 'puertas_abiertas',
    location: 'Ciudad Deportiva Platzi FC',
    startsAt: EVENT_BASE_A,
    endsAt: hoursFromDate(EVENT_BASE_A, 2),
    capacidad: 300,
    coverUrl: '/placeholders/event-01.jpg',
    coverAlt: 'Afición visitando la ciudad deportiva en una jornada previa',
    requiereInscripcion: true,
    externalRsvpUrl: 'https://eventos.platzifc.example/puertas-abiertas',
    destacado: true,
  },
  {
    slug: 'firma-autografos-plantilla',
    titulo: 'Firma de autógrafos con la plantilla',
    descripcion:
      'Sesión de firmas con la primera plantilla en la tienda oficial del estadio. Entrada libre hasta completar aforo.',
    tipo: 'firma_autografos',
    location: 'Tienda oficial - Platzi Arena',
    startsAt: EVENT_BASE_B,
    endsAt: hoursFromDate(EVENT_BASE_B, 2),
    capacidad: 200,
    coverUrl: '/placeholders/event-02.jpg',
    coverAlt: 'Jugadores firmando autógrafos en una sesión anterior',
    requiereInscripcion: false,
    destacado: true,
  },
  {
    slug: 'clinic-tecnico-cantera',
    titulo: 'Clinic técnico para niñas y niños de la cantera',
    descripcion:
      'Sesión abierta con el cuerpo técnico de cantera para niñas y niños entre 8 y 12 años. Material e inscripción incluidos.',
    tipo: 'clinic',
    location: 'Campo 3 - Ciudad Deportiva',
    startsAt: EVENT_BASE_C,
    endsAt: hoursFromDate(EVENT_BASE_C, 3),
    capacidad: 80,
    coverUrl: '/placeholders/event-03.jpg',
    coverAlt: 'Niñas y niños en un clinic de la cantera',
    requiereInscripcion: true,
    externalRsvpUrl: 'https://eventos.platzifc.example/clinic-cantera',
    destacado: false,
  },
  {
    slug: 'gala-solidaria-fundacion-2026',
    titulo: 'Gala solidaria Fundación Platzi FC',
    descripcion:
      'Gala benéfica anual con subasta, actuaciones y mesas temáticas. Lo recaudado financia el programa "Fútbol y Valores".',
    tipo: 'solidario',
    location: 'Palacio de Congresos',
    startsAt: EVENT_BASE_D,
    endsAt: hoursFromDate(EVENT_BASE_D, 4),
    capacidad: 500,
    coverUrl: '/placeholders/event-04.jpg',
    coverAlt: 'Gala solidaria del año anterior',
    requiereInscripcion: true,
    externalRsvpUrl: 'https://eventos.platzifc.example/gala-solidaria',
    destacado: true,
  },
  {
    slug: 'desayuno-penas-oficiales',
    titulo: 'Desayuno con las peñas oficiales',
    descripcion:
      'Encuentro informal de la directiva con representantes de las peñas oficiales del club.',
    tipo: 'encuentro_aficion',
    location: 'Sala VIP - Platzi Arena',
    startsAt: EVENT_BASE_E,
    endsAt: hoursFromDate(EVENT_BASE_E, 2),
    capacidad: 120,
    coverUrl: '/placeholders/event-05.jpg',
    coverAlt: 'Desayuno en la sala VIP',
    requiereInscripcion: true,
    externalRsvpUrl: 'https://eventos.platzifc.example/desayuno-penas',
    destacado: false,
  },
  {
    slug: 'firma-autografos-capitan-2026-03',
    titulo: 'Firma exclusiva con el capitán (edición marzo)',
    descripcion:
      'Evento histórico: sesión exclusiva con el capitán tras su renovación. Entrega de libro conmemorativo incluida.',
    tipo: 'firma_autografos',
    location: 'Tienda oficial - Platzi Arena',
    startsAt: EVENT_BASE_F,
    endsAt: hoursFromDate(EVENT_BASE_F, 2),
    capacidad: 150,
    coverUrl: '/placeholders/event-06.jpg',
    coverAlt: 'Capitán firmando autógrafos',
    requiereInscripcion: false,
    destacado: false,
  },
];

async function main() {
  console.log('[seed-fans] Iniciando...');

  const insertedMemberships = await db
    .insert(memberships)
    .values(MEMBERSHIPS)
    .onConflictDoNothing({ target: memberships.slug })
    .returning({ slug: memberships.slug });

  const insertedEvents = await db
    .insert(communityEvents)
    .values(COMMUNITY_EVENTS)
    .onConflictDoNothing({ target: communityEvents.slug })
    .returning({ slug: communityEvents.slug });

  console.log(
    `[seed-fans] OK — memberships=${MEMBERSHIPS.length} (${insertedMemberships.length} nuevos), ` +
      `community_events=${COMMUNITY_EVENTS.length} (${insertedEvents.length} nuevos)`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed-fans] FAIL:', err);
    process.exit(1);
  });
