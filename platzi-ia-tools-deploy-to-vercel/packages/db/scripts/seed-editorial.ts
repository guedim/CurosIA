/**
 * Seed editorial (Sprint 4): artículos, videos, galerías y páginas
 * institucionales. Idempotente vía `ON CONFLICT (slug) DO NOTHING`.
 *
 * Uso:
 *   pnpm --filter @platzi-fc/db seed:editorial
 */
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });
loadEnv({ path: '.env' });

import { getDb } from '../src/client';
import {
  articles,
  galleries,
  pages,
  videos,
  type NewArticle,
  type NewGallery,
  type NewPage,
  type NewVideo,
} from '../src/schema';

const db = getDb();

const now = new Date();

function daysAgo(n: number): Date {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d;
}

const ARTICLES: NewArticle[] = [
  {
    slug: 'victoria-en-la-jornada-inaugural',
    titulo: 'Platzi FC abre la temporada con victoria',
    excerpt: 'El conjunto local firma un 3-1 convincente ante Real Academia en el debut liguero.',
    body: 'El Platzi FC arrancó la temporada 2026 con paso firme. Tres goles a un rival que llegó con ambición pero no supo contener al tridente ofensivo.\n\nEl primer tanto llegó a los 12 minutos con una jugada colectiva que se había ensayado toda la pretemporada. El segundo fue producto del esfuerzo individual de un canterano recién ascendido al primer equipo.\n\nEl entrenador destacó "la actitud y la lectura táctica del mediocampo" en la rueda de prensa posterior.',
    coverUrl: '/placeholders/news-01.jpg',
    coverAlt: 'Jugadores de Platzi FC celebrando un gol',
    categoria: 'equipo',
    tags: ['liga', 'debut', 'victoria'],
    autor: 'Redacción Platzi FC',
    oficial: false,
    destacado: true,
    publishedAt: daysAgo(1),
  },
  {
    slug: 'comunicado-renovacion-capitan',
    titulo: 'Comunicado oficial: renovación del capitán',
    excerpt: 'El club y el capitán acuerdan una extensión de contrato por tres temporadas más.',
    body: 'El Platzi FC comunica oficialmente que ha alcanzado un acuerdo con su capitán para extender su vinculación hasta junio de 2029.\n\nEl jugador, referente del vestuario desde hace cinco temporadas, ha manifestado su compromiso con el proyecto deportivo y la afición.\n\nLa rueda de prensa de presentación tendrá lugar el próximo viernes en la sala de prensa del estadio.',
    coverUrl: '/placeholders/news-02.jpg',
    coverAlt: 'Capitán firmando el contrato de renovación',
    categoria: 'club',
    tags: ['oficial', 'renovación', 'capitán'],
    autor: 'Departamento de Comunicación',
    oficial: true,
    destacado: true,
    publishedAt: daysAgo(2),
  },
  {
    slug: 'cantera-brilla-en-torneo-juvenil',
    titulo: 'La cantera brilla en el Torneo Juvenil Regional',
    excerpt: 'Los equipos Sub-17 y Sub-19 avanzan a semifinales con paso invicto.',
    body: 'La formación de la cantera da sus frutos. Los equipos Sub-17 y Sub-19 del Platzi FC se clasificaron a semifinales del Torneo Juvenil Regional tras ganar todos sus partidos de la fase de grupos.\n\nEl director deportivo de la base destacó la "filosofía común" que comparten todas las categorías del club.',
    coverUrl: '/placeholders/news-03.jpg',
    coverAlt: 'Jugadores juveniles celebrando',
    categoria: 'academia',
    tags: ['cantera', 'juvenil', 'torneo'],
    autor: 'Redacción Platzi FC',
    oficial: false,
    destacado: false,
    publishedAt: daysAgo(3),
  },
  {
    slug: 'platzi-fc-femenino-firma-dos-refuerzos',
    titulo: 'El femenino firma dos refuerzos de cara a la segunda vuelta',
    excerpt:
      'Una mediocentro internacional y una extremo procedente de la liga vecina refuerzan la plantilla.',
    body: 'El equipo femenino del Platzi FC anuncia la incorporación de dos jugadoras de primer nivel para encarar la recta final del campeonato.\n\nAmbas firman contratos por temporada y media, con la ambición de aspirar al título y a la clasificación europea.',
    coverUrl: '/placeholders/news-04.jpg',
    coverAlt: 'Presentación oficial de las nuevas jugadoras',
    categoria: 'femenino',
    tags: ['fichajes', 'femenino'],
    autor: 'Redacción Platzi FC',
    oficial: false,
    destacado: false,
    publishedAt: daysAgo(4),
  },
  {
    slug: 'gran-jornada-solidaria-con-la-fundacion',
    titulo: 'Gran jornada solidaria con la Fundación Platzi FC',
    excerpt: 'Más de 1.200 personas participaron en la jornada solidaria del pasado fin de semana.',
    body: 'La Fundación Platzi FC organizó la mayor jornada solidaria de la historia del club, con actividades para todas las edades y recaudación destinada a proyectos de inclusión a través del deporte.\n\nLa primera plantilla acudió al completo y firmó autógrafos durante toda la tarde.',
    coverUrl: '/placeholders/news-05.jpg',
    coverAlt: 'Jugadores compartiendo con aficionados',
    categoria: 'comunidad',
    tags: ['fundación', 'solidaridad', 'afición'],
    autor: 'Fundación Platzi FC',
    oficial: false,
    destacado: true,
    publishedAt: daysAgo(5),
  },
  {
    slug: 'nueva-camiseta-tercera-equipacion-2026',
    titulo: 'Presentada la tercera equipación para la temporada 2026',
    excerpt: 'Disponible desde hoy en la tienda oficial y en el stand del estadio.',
    body: 'La nueva tercera equipación rinde homenaje a los colores fundacionales del club y ya está disponible en la tienda oficial.\n\nEl diseño, obra del equipo creativo propio, se presentó en un acto en el estadio con presencia de los capitanes.',
    coverUrl: '/placeholders/news-06.jpg',
    coverAlt: 'Capitán vistiendo la nueva tercera equipación',
    categoria: 'tienda',
    tags: ['camiseta', 'equipación', 'tienda'],
    autor: 'Redacción Platzi FC',
    oficial: false,
    destacado: false,
    publishedAt: daysAgo(6),
  },
  {
    slug: 'entrevista-con-el-entrenador-planes-temporada',
    titulo: 'Entrevista: los planes del entrenador para la temporada',
    excerpt: 'Repasamos objetivos, estilo de juego e ilusiones en una charla de 30 minutos.',
    body: 'El entrenador del Platzi FC nos recibe en su despacho para analizar el inicio de temporada.\n\n"El objetivo es competir en todas las competiciones sin renunciar a nada", afirma al comienzo de la entrevista.\n\nAborda también la gestión de las rotaciones, la llegada de los canteranos y la evolución táctica del equipo.',
    coverUrl: '/placeholders/news-07.jpg',
    coverAlt: 'Entrenador en su despacho',
    categoria: 'equipo',
    tags: ['entrevista', 'entrenador', 'temporada'],
    autor: 'Redacción Platzi FC',
    oficial: false,
    destacado: false,
    publishedAt: daysAgo(7),
  },
  {
    slug: 'academy-abre-convocatoria-becas',
    titulo: 'Academy abre la convocatoria de becas 2026/27',
    excerpt: 'Hasta 50 plazas disponibles con descuentos de hasta el 80% en la matrícula.',
    body: 'Platzi FC Academy abre el proceso de solicitud de becas para el curso 2026/27. Las solicitudes pueden presentarse online hasta el 30 de junio.\n\nSe evaluarán criterios deportivos, académicos y socioeconómicos.',
    coverUrl: '/placeholders/news-08.jpg',
    coverAlt: 'Niños entrenando en la academia',
    categoria: 'academia',
    tags: ['academy', 'becas', 'convocatoria'],
    autor: 'Departamento Academy',
    oficial: false,
    destacado: false,
    publishedAt: daysAgo(8),
  },
  {
    slug: 'comunicado-lesion-defensa-central',
    titulo: 'Comunicado médico: lesión del defensa central',
    excerpt: 'Parte médico oficial tras la revisión del domingo por la noche.',
    body: 'El Platzi FC informa que el defensa central sufre una lesión muscular de grado II en el bíceps femoral de la pierna izquierda.\n\nSu recuperación se estima entre 3 y 4 semanas, pendiente de evolución.',
    coverUrl: '/placeholders/news-09.jpg',
    coverAlt: 'Parte médico oficial del club',
    categoria: 'club',
    tags: ['oficial', 'lesión', 'parte médico'],
    autor: 'Servicios Médicos',
    oficial: true,
    destacado: false,
    publishedAt: daysAgo(9),
  },
  {
    slug: 'llega-el-partido-mas-esperado-del-ano',
    titulo: 'Llega el partido más esperado del año',
    excerpt: 'El derbi de la jornada 8 se disputará con el estadio completamente lleno.',
    body: 'El gran clásico de la liga regional se jugará el próximo sábado con el aforo agotado desde hace semanas.\n\nEl club ha organizado actividades previas al partido, con animación en los aledaños del estadio desde tres horas antes.',
    coverUrl: '/placeholders/news-10.jpg',
    coverAlt: 'Estadio lleno en vista aérea',
    categoria: 'equipo',
    tags: ['derbi', 'partido', 'afición'],
    autor: 'Redacción Platzi FC',
    oficial: false,
    destacado: true,
    publishedAt: daysAgo(10),
  },
  {
    slug: 'nueva-alianza-con-patrocinador-tecnologico',
    titulo: 'Nueva alianza estratégica con un patrocinador tecnológico',
    excerpt:
      'El club firma un acuerdo por tres temporadas que impulsará la transformación digital.',
    body: 'Platzi FC y un referente mundial del sector tecnológico han firmado un acuerdo de patrocinio por tres temporadas.\n\nEl convenio incluye un programa de formación digital para cantera y plantilla profesional.',
    coverUrl: '/placeholders/news-11.jpg',
    coverAlt: 'Directivos del club firmando el acuerdo',
    categoria: 'club',
    tags: ['patrocinio', 'tecnología'],
    autor: 'Departamento Comercial',
    oficial: false,
    destacado: false,
    publishedAt: daysAgo(11),
  },
  {
    slug: 'el-club-inaugura-nuevo-gimnasio-de-alto-rendimiento',
    titulo: 'El club inaugura un nuevo gimnasio de alto rendimiento',
    excerpt: 'Instalaciones con tecnología puntera para preparación física y recuperación.',
    body: 'Las nuevas instalaciones, integradas en la ciudad deportiva, incluyen 600 m² de equipamiento de última generación.\n\nEl objetivo es optimizar la preparación física de las plantillas profesional y de cantera.',
    coverUrl: '/placeholders/news-12.jpg',
    coverAlt: 'Interior del nuevo gimnasio',
    categoria: 'club',
    tags: ['instalaciones', 'alto rendimiento'],
    autor: 'Redacción Platzi FC',
    oficial: false,
    destacado: false,
    publishedAt: daysAgo(14),
  },
  {
    slug: 'entradas-disponibles-para-el-proximo-partido-en-casa',
    titulo: 'Entradas disponibles para el próximo partido en casa',
    excerpt: 'Desde 12 € para abonados y 18 € en venta general. Niños hasta 12 años, gratis.',
    body: 'Ya está abierta la venta de entradas para el próximo encuentro como local. Los abonados tienen prioridad durante las primeras 48 horas.\n\nAcceso con entrada digital o impresa. Se recomienda llegar con 30 minutos de antelación.',
    coverUrl: '/placeholders/news-13.jpg',
    coverAlt: 'Taquilla del estadio',
    categoria: 'tienda',
    tags: ['entradas', 'estadio'],
    autor: 'Atención al Abonado',
    oficial: false,
    destacado: false,
    publishedAt: daysAgo(16),
  },
  {
    slug: 'comunicado-cambio-de-horario-partido-copa',
    titulo: 'Comunicado oficial: cambio de horario en el partido de copa',
    excerpt: 'Por requerimientos de retransmisión televisiva, el partido se adelanta dos horas.',
    body: 'Platzi FC comunica que, por requerimientos de la retransmisión televisiva, el partido de copa se adelanta dos horas respecto a la convocatoria original.\n\nLas entradas ya adquiridas mantienen su validez para el nuevo horario.',
    coverUrl: '/placeholders/news-14.jpg',
    coverAlt: 'Logo de la copa con horario del partido',
    categoria: 'club',
    tags: ['oficial', 'copa', 'horario'],
    autor: 'Departamento de Comunicación',
    oficial: true,
    destacado: false,
    publishedAt: daysAgo(19),
  },
  {
    slug: 'platzi-fc-colabora-con-escuelas-locales',
    titulo: 'Platzi FC colabora con escuelas locales en programa educativo',
    excerpt: 'El programa "Fútbol y Valores" llega ya a más de 40 centros educativos.',
    body: 'El programa "Fútbol y Valores" de la Fundación Platzi FC continúa su expansión. En esta temporada se incorporan 12 escuelas más, alcanzando un total de 40 centros educativos colaboradores.\n\nEl programa combina formación deportiva con módulos de valores, nutrición y uso responsable de tecnología.',
    coverUrl: '/placeholders/news-15.jpg',
    coverAlt: 'Entrenamiento en un centro escolar',
    categoria: 'comunidad',
    tags: ['fundación', 'educación', 'valores'],
    autor: 'Fundación Platzi FC',
    oficial: false,
    destacado: false,
    publishedAt: daysAgo(22),
  },
];

const VIDEOS: NewVideo[] = [
  {
    slug: 'resumen-platzi-vs-real-academia',
    titulo: 'Resumen: Platzi FC 3-1 Real Academia',
    descripcion: 'Los mejores momentos del debut liguero.',
    coverUrl: '/placeholders/video-01.jpg',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    plataforma: 'youtube',
    duracionSeg: 185,
    categoria: 'resumen',
    publishedAt: daysAgo(1),
  },
  {
    slug: 'rueda-prensa-entrenador-jornada-inaugural',
    titulo: 'Rueda de prensa post-partido del entrenador',
    descripcion: 'Análisis del partido y mensaje a la afición.',
    coverUrl: '/placeholders/video-02.jpg',
    embedUrl: 'https://www.youtube.com/embed/9bZkp7q19f0',
    plataforma: 'youtube',
    duracionSeg: 720,
    categoria: 'rueda_prensa',
    publishedAt: daysAgo(1),
  },
  {
    slug: 'entrevista-exclusiva-capitan',
    titulo: 'Entrevista exclusiva con el capitán',
    descripcion: 'Hablamos del momento del equipo y los retos de la temporada.',
    coverUrl: '/placeholders/video-03.jpg',
    embedUrl: 'https://player.vimeo.com/video/76979871',
    plataforma: 'vimeo',
    duracionSeg: 1080,
    categoria: 'entrevista',
    publishedAt: daysAgo(4),
  },
  {
    slug: 'dia-entrenamiento-cantera-sub17',
    titulo: 'Un día en la cantera: Sub-17 entrenando',
    descripcion: 'Así se prepara el futuro del club.',
    coverUrl: '/placeholders/video-04.jpg',
    embedUrl: 'https://www.youtube.com/embed/M7lc1UVf-VE',
    plataforma: 'youtube',
    duracionSeg: 360,
    categoria: 'cantera',
    publishedAt: daysAgo(7),
  },
  {
    slug: 'jornada-solidaria-resumen',
    titulo: 'Jornada solidaria: resumen de la tarde',
    descripcion: 'La afición y la plantilla, unidas por una buena causa.',
    coverUrl: '/placeholders/video-05.jpg',
    embedUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk',
    plataforma: 'youtube',
    duracionSeg: 240,
    categoria: 'comunidad',
    publishedAt: daysAgo(5),
  },
];

const GALLERIES: NewGallery[] = [
  {
    slug: 'jornada-inaugural-liga-2026',
    titulo: 'Jornada inaugural: así se vivió en el estadio',
    descripcion: 'Las mejores imágenes del primer partido oficial de la temporada.',
    coverUrl: '/placeholders/gallery-01-cover.jpg',
    images: [
      {
        url: '/placeholders/gallery-01-01.jpg',
        alt: 'Afición antes del partido',
        credito: 'Platzi FC Media',
      },
      {
        url: '/placeholders/gallery-01-02.jpg',
        alt: 'Equipo saltando al campo',
        credito: 'Platzi FC Media',
      },
      {
        url: '/placeholders/gallery-01-03.jpg',
        alt: 'Celebración del primer gol',
        credito: 'Platzi FC Media',
      },
      {
        url: '/placeholders/gallery-01-04.jpg',
        alt: 'Bandera gigante de la grada',
        credito: 'Platzi FC Media',
      },
      {
        url: '/placeholders/gallery-01-05.jpg',
        alt: 'Capitán levantando los brazos',
        credito: 'Platzi FC Media',
      },
    ],
    publishedAt: daysAgo(1),
  },
  {
    slug: 'presentacion-tercera-equipacion',
    titulo: 'Presentación oficial de la tercera equipación',
    descripcion: 'Los capitanes protagonizan el acto de presentación.',
    coverUrl: '/placeholders/gallery-02-cover.jpg',
    images: [
      { url: '/placeholders/gallery-02-01.jpg', alt: 'Equipación sobre percha' },
      { url: '/placeholders/gallery-02-02.jpg', alt: 'Capitana luciendo la nueva camiseta' },
      { url: '/placeholders/gallery-02-03.jpg', alt: 'Detalle del escudo bordado' },
      { url: '/placeholders/gallery-02-04.jpg', alt: 'Grupo de capitanes' },
    ],
    publishedAt: daysAgo(6),
  },
  {
    slug: 'jornada-solidaria-fundacion',
    titulo: 'Jornada solidaria de la Fundación',
    descripcion: 'Actividades, firmas y encuentros con la afición.',
    coverUrl: '/placeholders/gallery-03-cover.jpg',
    images: [
      { url: '/placeholders/gallery-03-01.jpg', alt: 'Afición en la zona de actividades' },
      { url: '/placeholders/gallery-03-02.jpg', alt: 'Jugadores firmando autógrafos' },
      { url: '/placeholders/gallery-03-03.jpg', alt: 'Partidillo solidario' },
      { url: '/placeholders/gallery-03-04.jpg', alt: 'Entrega de material a familias' },
      { url: '/placeholders/gallery-03-05.jpg', alt: 'Foto de grupo final' },
      { url: '/placeholders/gallery-03-06.jpg', alt: 'Atardecer en el estadio' },
    ],
    publishedAt: daysAgo(5),
  },
];

const PAGES: NewPage[] = [
  {
    slug: 'club/historia',
    titulo: 'Historia del Platzi FC',
    intro: 'Más de tres décadas transformando el fútbol desde la base, la pasión y la comunidad.',
    body: 'El Platzi FC nace en 1992 como una iniciativa de un grupo de aficionados locales que quería devolver al fútbol su raíz comunitaria.\n\nEn sus primeros años el club compitió en categorías regionales. Con el trabajo sostenido de directiva, cuerpo técnico y afición, logró ascensos consecutivos hasta asentarse en la liga nacional.\n\nLa década de 2010 supuso la consolidación del proyecto deportivo y la inauguración de la ciudad deportiva, pilar de la formación de cantera hasta hoy.\n\nEn la actualidad, el club mantiene equipos masculino, femenino y de cantera en todas las categorías, compitiendo también a nivel regional internacional.',
    heroUrl: '/placeholders/page-historia.jpg',
    heroAlt: 'Fotografía antigua del primer equipo del Platzi FC',
    seoDescription:
      'Historia del Platzi FC desde su fundación en 1992 hasta la actualidad: hitos, ascensos y consolidación.',
  },
  {
    slug: 'club/identidad',
    titulo: 'Identidad de marca',
    intro: 'Escudo, colores, valores y el manifiesto que guía cada decisión del club.',
    body: 'Nuestro escudo combina los símbolos fundacionales del club con una tipografía moderna revisada en 2018.\n\nLos colores corporativos son el verde Platzi (PANTONE 369 C) y el blanco, con el negro como acento para contextos digitales.\n\nNuestros valores son la **comunidad**, la **excelencia**, la **integridad** y la **pasión**. Cada iniciativa deportiva, editorial o comercial se mide en función de estos pilares.\n\nEl manifiesto de identidad de marca completo puede consultarse en la sección de descargas de este portal (disponible para socios y medios).',
    heroUrl: '/placeholders/page-identidad.jpg',
    heroAlt: 'Escudo del Platzi FC sobre fondo verde corporativo',
    seoDescription:
      'Identidad de marca del Platzi FC: escudo, colores, valores y manifiesto institucional.',
  },
  {
    slug: 'club/estadio',
    titulo: 'Estadio Platzi Arena',
    intro: 'Nuestro hogar: 28.500 localidades, césped híbrido y la mejor atmósfera de la liga.',
    body: 'El Platzi Arena fue inaugurado en 2004 y ampliado en 2016 hasta su capacidad actual de 28.500 localidades.\n\nCuenta con césped híbrido, instalaciones premium para socios y abonados, zona familiar libre de humo y alimentos, área de accesibilidad con guía de servicios y parking para bicicletas y VMP.\n\nEstá ubicado en la Avenida del Deporte, 12, junto a las estaciones de metro Platzi Norte y Platzi Sur (líneas 3 y 7). El acceso en transporte público está recomendado en todos los partidos.\n\nLos días de partido abrimos las puertas 90 minutos antes del inicio. Se recomienda llegar con antelación.',
    heroUrl: '/placeholders/page-estadio.jpg',
    heroAlt: 'Vista aérea del estadio Platzi Arena con el estadio lleno',
    seoDescription:
      'Estadio Platzi Arena: capacidad, servicios, ubicación y recomendaciones para los días de partido.',
  },
  {
    slug: 'entradas/abonos',
    titulo: 'Abonos Platzi FC',
    intro: 'Tarifas, ventajas y proceso de renovación de los abonos de temporada.',
    body: 'Los abonos de la temporada 2026 ya están disponibles. Ofrecemos tres categorías que se adaptan al tipo de asistente y a su zona preferida del estadio.\n\n**Fondos** — Acceso a toda la temporada de liga y dos partidos de copa doméstica. Precio: desde **220 €/temporada**.\n\n**Lateral** — Asientos cubiertos en zonas laterales, con ventajas adicionales en la tienda oficial. Precio: desde **350 €/temporada**.\n\n**Tribuna** — Experiencia premium con acceso a la sala de socios y descuentos en hostelería local. Precio: desde **540 €/temporada**.\n\nLa renovación puede realizarse online o en taquillas con cita previa. Los nuevos abonos se activan sujetos a disponibilidad de asientos.\n\nPara dudas, llama al +34 900 123 456 o escribe a **socios@platzifc.com**.',
    heroUrl: '/placeholders/page-abonos.jpg',
    heroAlt: 'Aficionados del Platzi FC con su carnet de abonado',
    seoDescription:
      'Abonos de temporada del Platzi FC: tarifas por categoría, ventajas y proceso de renovación.',
  },
  {
    slug: 'entradas/estadio',
    titulo: 'Entradas por partido',
    intro: 'Zonas, accesibilidad, recomendaciones y compra en taquillas del Platzi Arena.',
    body: 'Las entradas por partido salen a la venta siete días antes del inicio del encuentro y pueden adquirirse en la web oficial, en taquillas del estadio o en puntos autorizados.\n\n**Zonas y precios orientativos**\n\n- Fondos: desde 18 € por partido\n- Lateral cubierto: desde 28 € por partido\n- Tribuna principal: desde 42 € por partido\n- Zona familiar (libre de humo): desde 22 € por partido\n\n**Accesibilidad**\n\nEl Platzi Arena cuenta con zona reservada para personas con movilidad reducida, con acompañante gratuito. Reserva con al menos 48 horas de antelación en **accesibilidad@platzifc.com**.\n\n**Horarios de taquilla**\n\nDe lunes a viernes, 10:00–18:00. Los días de partido, las taquillas abren 2 horas antes del inicio.\n\n**Recomendaciones**\n\nLleva documento de identidad, llega con antelación y consulta los accesos recomendados en la web el día del partido.',
    heroUrl: '/placeholders/page-estadio-entradas.jpg',
    heroAlt: 'Taquillas del estadio Platzi Arena',
    seoDescription:
      'Entradas por partido del Platzi FC: zonas, precios, accesibilidad y horarios de taquilla.',
  },
  {
    slug: 'club/contacto',
    titulo: 'Contacto',
    intro: 'Los canales oficiales de atención al socio, prensa y colaboraciones.',
    body: '**Atención al socio y abonado**\n\nTeléfono: +34 900 123 456 (L-V de 9 a 18h)\nEmail: socios@platzifc.com\n\n**Prensa y comunicación**\n\nEmail: prensa@platzifc.com\nPara acreditaciones de partido, solicitar con 72 horas de antelación.\n\n**Patrocinios y comercial**\n\nEmail: comercial@platzifc.com\n\n**Fundación Platzi FC**\n\nEmail: fundacion@platzifc.com\n\n**Dirección postal**\n\nCiudad Deportiva Platzi FC, Avenida del Deporte 12, 00000 Platziville.',
    heroUrl: '/placeholders/page-contacto.jpg',
    heroAlt: 'Oficinas del Platzi FC',
    seoDescription:
      'Canales oficiales de contacto del Platzi FC: atención al socio, prensa, comercial y Fundación.',
  },
];

async function main() {
  console.log('[seed-editorial] Iniciando...');

  const db2 = db;

  const insertedArticles = await db2
    .insert(articles)
    .values(ARTICLES)
    .onConflictDoNothing({ target: articles.slug })
    .returning({ slug: articles.slug });

  const insertedVideos = await db2
    .insert(videos)
    .values(VIDEOS)
    .onConflictDoNothing({ target: videos.slug })
    .returning({ slug: videos.slug });

  const insertedGalleries = await db2
    .insert(galleries)
    .values(GALLERIES)
    .onConflictDoNothing({ target: galleries.slug })
    .returning({ slug: galleries.slug });

  const insertedPages = await db2
    .insert(pages)
    .values(PAGES)
    .onConflictDoNothing({ target: pages.slug })
    .returning({ slug: pages.slug });

  console.log(
    `[seed-editorial] OK — articles=${ARTICLES.length} (${insertedArticles.length} nuevos), ` +
      `videos=${VIDEOS.length} (${insertedVideos.length} nuevos), ` +
      `galleries=${GALLERIES.length} (${insertedGalleries.length} nuevos), ` +
      `pages=${PAGES.length} (${insertedPages.length} nuevos)`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed-editorial] FAIL:', err);
    process.exit(1);
  });
