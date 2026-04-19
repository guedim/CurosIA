# Platzi FC - Estructura del Proyecto Web

## Alcance

Plan de trabajo enfocado solo en la estructura del proyecto (IA / arquitectura de contenido) para la web oficial de un club ficticio llamado **Platzi FC**, tomando como referencia patrones comunes en sitios de clubes profesionales.

**Fuera de alcance:** diseño visual, copies, wireframes, UI kit, backlog detallado, historias de usuario y cronogramas.

---

## 1) Sitemap completo

- **Inicio**
- **Partidos**
  - Calendario (Proximos)
  - Resultados (Pasados)
  - Partido (detalle)
    - Resumen
    - Estadisticas
    - Alineaciones
    - Minuto a minuto
    - Galeria / Video
    - Entradas (CTA)
- **Equipo**
  - Primer Equipo
    - Plantilla (lista)
    - Jugador (perfil)
    - Cuerpo Tecnico
  - Femenino (si aplica)
    - Plantilla / Jugador / Staff
  - Cantera / Academia
    - Equipos por categoria
    - Jugador (perfil cantera)
- **Competicion**
  - Competicion (landing por torneo)
    - Tabla / Clasificacion
    - Calendario del torneo
    - Estadisticas del torneo
- **Noticias**
  - Ultimas noticias
  - Categorias (Club / Equipo / Academia / Femenino / Comunidad / Tienda)
  - Noticia (detalle)
  - Comunicados oficiales
- **Media**
  - Videos
    - Video (detalle)
  - Fotos / Galerias
    - Galeria (detalle)
  - Podcast / Audio (opcional)
- **Entradas**
  - Comprar entradas (landing)
  - Partido (ticketing especifico)
  - Abonos / Membresias
  - Informacion de estadio / Accesos
- **Tienda**
  - Inicio tienda (destacados)
  - Categorias
  - Producto (detalle)
  - Carrito / Checkout (si se integra en el sitio)
- **Club**
  - Historia
  - Identidad (escudo, valores, himno)
  - Directiva
  - Estadio (mapa, como llegar, accesibilidad)
  - Fundacion / Impacto social
  - Transparencia / Documentos
  - Contacto
- **Fans**
  - Membresia (beneficios)
  - Comunidad / Eventos
  - Newsletter / Alertas
  - FAQ
- **Sponsors**
  - Patrocinadores (landing)
  - Partner (detalle / activaciones)
- **Academy (Platzi FC Lab)**
  - Programas / Cursos
  - Inscripcion
  - Alumni / Historias
- **Legal**
  - Terminos
  - Privacidad
  - Cookies (preferencias)
  - Accesibilidad (declaracion)
- **Utilidades (sistemicas)**
  - Busqueda (resultados)
  - 404 / 500
  - Selector de idioma / region (si aplica)

---

## 2) Especificacion por seccion / pagina

> Para mantener el documento compacto, se agrupa por tipo de pagina o template.

### Inicio

- **Proposito:** puerta de entrada editorial y comercial del club.
- **Publico objetivo:** fans generales, prensa, compradores de entradas y merch.
- **Bloques principales:**
  - Hero con proximo partido y CTA
  - Resultados recientes
  - Noticias destacadas
  - Posicion / tabla destacada
  - Modulos de Entradas, Tienda y Video destacado
  - Sponsors
  - Newsletter

### Partidos (Calendario / Resultados)

- **Proposito:** consultar fixtures y resultados por temporada y competicion.
- **Publico objetivo:** fans, medios, analistas.
- **Bloques principales:**
  - Filtros (temporada, competicion, local/visita)
  - Listado por fecha
  - Tarjetas de partido
  - CTA de entradas para futuros partidos
  - Enlaces a detalle

### Partido (Detalle)

- **Proposito:** centralizar prepartido, partido en vivo y postpartido.
- **Publico objetivo:** fans recurrentes, prensa, perfiles orientados a data.
- **Bloques principales:**
  - Marcador y estado del partido
  - Contexto (competicion, jornada, estadio)
  - CTA de entradas (si aplica)
  - Tabs: Resumen / Stats / Alineaciones / Minuto a minuto / Media
  - Eventos del partido
  - Comparativa de estadisticas
  - Contenido relacionado

### Equipo (Plantilla / Staff)

- **Proposito:** presentar la estructura deportiva del club.
- **Publico objetivo:** fans, scouts, prensa.
- **Bloques principales:**
  - Filtros (posicion, dorsal, nacionalidad)
  - Cards de jugadores
  - Staff list
  - CTA de seguimiento / notificaciones
  - Enlaces a perfiles individuales

### Jugador (Perfil)

- **Proposito:** exponer la ficha estructurada del jugador.
- **Publico objetivo:** fans, prensa.
- **Bloques principales:**
  - Header con foto, nombre, dorsal y posicion
  - Datos clave / bio estructural
  - Estadisticas por temporada
  - Ultimos partidos
  - Media relacionada
  - Noticias del jugador

### Competicion (Landing por torneo)

- **Proposito:** ofrecer una vista integral por torneo.
- **Publico objetivo:** fans y prensa.
- **Bloques principales:**
  - Selector de temporada
  - Tabla / clasificacion
  - Calendario del torneo
  - Resultados del club
  - Top stats
  - CTA hacia partidos

### Noticias (Listado)

- **Proposito:** distribuir contenido editorial y SEO.
- **Publico objetivo:** fans, prensa, buscadores.
- **Bloques principales:**
  - Destacado principal
  - Busqueda y filtros
  - Grid de noticias
  - Modulo de comunicados oficiales

### Noticia (Detalle)

- **Proposito:** consumo de contenido y descubrimiento de piezas relacionadas.
- **Publico objetivo:** fans, prensa, SEO.
- **Bloques principales:**
  - Titulo y metadata
  - Cuerpo modular desde CMS
  - Embeds de media
  - Articulos relacionados
  - CTA a newsletter
  - Compartir

### Media (Videos / Galerias)

- **Proposito:** servir como biblioteca audiovisual del club.
- **Publico objetivo:** fans y audiencias sociales.
- **Bloques principales:**
  - Filtros por tipo, temporada y competicion
  - Reproductor o visor
  - Playlists / galerias relacionadas
  - CTA de suscripcion

### Entradas

- **Proposito:** convertir visitas en compra de tickets o abonos.
- **Publico objetivo:** compradores.
- **Bloques principales:**
  - Listado / buscador de partidos
  - CTA de compra
  - Informacion de zonas y accesos
  - FAQ
  - Politicas
  - Accesibilidad del estadio

### Tienda

- **Proposito:** habilitar venta o derivacion a e-commerce.
- **Publico objetivo:** fans compradores.
- **Bloques principales:**
  - Productos destacados
  - Categorias
  - Filtros
  - Ficha de producto
  - Recomendaciones
  - CTA de compra

### Club

- **Proposito:** cubrir capa institucional, reputacional y de servicio.
- **Publico objetivo:** prensa, sponsors, fans, entidades.
- **Bloques principales:**
  - Navegacion secundaria interna
  - Secciones CMS
  - Documentos descargables
  - Contacto
  - Informacion de estadio y accesibilidad

### Fans

- **Proposito:** fidelizacion, comunidad y captura de first-party data.
- **Publico objetivo:** fans recurrentes.
- **Bloques principales:**
  - Beneficios de membresia
  - Niveles / planes
  - Eventos de comunidad
  - Newsletter
  - FAQ / centro de ayuda

### Sponsors

- **Proposito:** visibilizar partners y soportar relacion comercial.
- **Publico objetivo:** marcas, sponsors, fans.
- **Bloques principales:**
  - Grid de sponsors por tier
  - Inventario de activos (estructura)
  - Activaciones / casos
  - CTA de contacto comercial

### Academy (Platzi FC Lab)

- **Proposito:** exponer oferta formativa o de cantera.
- **Publico objetivo:** aspirantes, padres, comunidad.
- **Bloques principales:**
  - Programas
  - Requisitos
  - Inscripcion
  - Calendario
  - Contacto

### Busqueda global

- **Proposito:** facilitar acceso transversal a contenido y entidades.
- **Publico objetivo:** todos los usuarios.
- **Bloques principales:**
  - Barra de busqueda
  - Tabs por tipo de resultado
  - Filtros / facets
  - Ordenamiento
  - Resultados agrupados

---

## 3) Data models minimos

### Temporada

- id
- nombre
- fecha_inicio
- fecha_fin
- estado (activa / archivada)
- slug

### Competicion

- id
- nombre
- tipo (liga / copa / amistoso)
- pais / region
- logo_url
- slug

### Equipo (Team)

- id
- nombre
- tipo (club principal / rival / cantera)
- escudo_url
- pais
- ciudad
- slug

### Partido (Match)

- id
- temporada_id
- competicion_id
- jornada
- fecha_hora
- estadio_id
- equipo_local_id
- equipo_visita_id
- estado (programado / en_vivo / finalizado / suspendido)
- marcador_local
- marcador_visita
- asistencia
- arbitro (opcional)
- broadcasting_refs
- alineacion_local[]
- alineacion_visita[]
- eventos[]
- stats (key/value)

### Jugador (Player)

- id
- nombre
- apellido
- dorsal
- posicion
- fecha_nacimiento
- nacionalidad
- altura
- peso
- pie_habil
- foto_url
- biografia_bloques
- estado (activo / lesionado / cedido)
- equipo_id
- historial_clubes[]
- stats_por_temporada[]
- redes_sociales[]
- slug

### Staff

- id
- nombre
- rol
- foto_url
- biografia_bloques
- equipo_id
- slug

### Tabla / Clasificacion

- id
- temporada_id
- competicion_id
- filas[]
  - equipo_id
  - pj
  - pg
  - pe
  - pp
  - gf
  - gc
  - dg
  - pts
  - forma[]

### Noticia (Article)

- id
- titulo
- slug
- fecha_publicacion
- autor_ref
- categoria
- etiquetas[]
- extracto_struct
- body_bloques
- media_destacada_id
- relacionados[]
- seo
  - title
  - description
  - canonical
- estado (borrador / publicado)

### Comunicado oficial

- mismos campos base de Noticia
- oficial (boolean)
- archivos_adjuntos[]

### MediaAsset

- id
- tipo (imagen / video / audio)
- url
- alt_text
- creditos
- duracion
- dimensiones
- etiquetas[]
- fecha

### Video

- id
- titulo
- slug
- plataforma
- embed_ref
- categorias[]
- fecha
- related_match_id

### Galeria

- id
- titulo
- slug
- items[]
- related_match_id

### Estadio (Venue)

- id
- nombre
- direccion
- ciudad
- pais
- capacidad
- mapa_embed_ref
- accesibilidad_bloques
- slug

### TicketProduct

- id
- tipo (partido / abono / membresia)
- match_id
- temporada_id
- nombre
- descripcion_bloques
- proveedor_checkout_url
- zonas[]
- politicas_bloques

### ShopProduct

- id
- nombre
- slug
- categoria
- descripcion_bloques
- imagenes[]
- variantes[]
- proveedor_checkout_url
- tags[]
- related_player_id

### Sponsor

- id
- nombre
- tier
- logo_url
- url
- vigencia_desde
- vigencia_hasta
- activaciones_bloques
- slug

### MembershipPlan

- id
- nombre
- nivel
- beneficios_bloques
- precio_ref
- proveedor_checkout_url
- slug

### FanEvent

- id
- nombre
- fecha_hora
- lugar
- tipo
- descripcion_bloques
- registro_url
- capacidad_ref

### Config / Taxonomias

- categorias_noticias
- etiquetas
- paises
- posiciones
- roles_staff
- tipos_media
- tipos_evento

---

## 4) Navegacion

### Header

- **Inicio**
- **Partidos**
  - Calendario
  - Resultados
  - Competicion
- **Equipo**
  - Primer Equipo
  - Femenino (si aplica)
  - Cantera / Academia
- **Noticias**
  - Ultimas
  - Categorias
  - Comunicados
- **Media**
  - Videos
  - Fotos
- **Entradas**
  - Comprar
  - Abonos / Membresias
  - Info Estadio
- **Tienda**
- **Club**
  - Historia
  - Estadio
  - Fundacion
  - Transparencia
  - Contacto
- **Acciones utilitarias:** Buscar, Idioma, Login / Perfil (si aplica)

### Footer

- Enlaces rapidos
- Redes sociales
- Newsletter
- Sponsors
- Contacto / Prensa
- Legal
- Accesibilidad
- Mapa del sitio

### Navegacion secundaria por seccion

- **Noticias:** Ultimas / Categorias / Comunicados / Newsletter
- **Equipo:** Plantilla / Staff / Stats / Cantera / Femenino
- **Partidos:** Proximos / Resultados / Por competicion / Por temporada
- **Club:** Historia / Estadio / Fundacion / Directiva / Transparencia / Contacto
- **Media:** Videos / Galerias / Por temporada / Por tipo

---

## 5) Funcionalidades clave por fase

### MVP

- CMS para noticias, media basica y paginas institucionales
- Calendario y resultados
- Detalle de partido basico
- Plantilla y perfiles de jugador / staff
- Tabla / clasificacion por competicion
- Entradas con CTA a proveedor externo
- Tienda con catalogo y CTA a e-commerce externo
- Busqueda simple
- SEO tecnico base (metas, sitemap, robots, schema basico)

### V1

- Match center ampliado (stats, alineaciones, eventos)
- Selectores por temporada y competicion persistentes
- Biblioteca media con taxonomias robustas
- Internacionalizacion
- Alertas y newsletter opt-in
- Modulo Fans / Membresia con login opcional
- Integraciones de analitica y consentimiento

### V2

- Live match center real-time
- Cuenta de fan con preferencias
- Personalizacion de homepage
- Integracion profunda de ticketing / e-commerce
- Experiencias historicas y contenido evergreen ampliado
- Workflows editoriales avanzados y automatizacion de contenido relacionado

---

## 6) Buenas practicas observadas en webs de clubes pro

### Arquitectura de contenido

- Separar contenido **evergreen** (club, historia, estadio, fundacion) del contenido **de temporada** (partidos, roster, stats).
- Mantener URLs estables y usar filtros / selectores para temporada y competicion.

### SEO

- Implementar schema para equipo, partido, noticia y video.
- Crear hubs por entidad (jugador, partido, competicion) para fortalecer enlazado interno.

### Accesibilidad

- Navegacion por teclado y focus visibles.
- Tablas accesibles con headers correctos.
- Alt text y soporte consistente para media.

### Rendimiento

- Optimizar home y partido como paginas criticas.
- Lazy-load en media no esencial.
- Caching y revalidacion para contenido deportivo cambiante.

### Internacionalizacion

- Preparar contenido localizable, no solo UI traducible.
- Considerar formatos de fecha, moneda y terminologia deportiva por region.

### CMS y governance

- Definir taxonomias controladas desde el inicio.
- Separar workflows para noticias y comunicados oficiales.
- Usar bloques reusables para mantener consistencia editorial.

### Busqueda y filtros

- Filtros relevantes al dominio deportivo: temporada, competicion, jornada, posicion, nacionalidad.
- Ordenamientos consistentes por fecha, relevancia o actualidad.

---

## Nota final

Esta estructura replica patrones comunes de sitios oficiales de clubes profesionales: fuerte prioridad al calendario / resultados, hubs por entidades deportivas, capas institucionales separadas del contenido de temporada, y puntos de conversion claros para entradas, tienda y membresias.
