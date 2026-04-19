-- =============================================================================
-- Platzi FC - Schema deportivo en PostgreSQL
-- =============================================================================
-- Cubre las tablas de los Sprints 2 y 3 del plan.md:
--   Sprint 2: seasons, competitions, teams, matches, match_events
--   Sprint 3: players, player_season_stats, staff, standings
--
-- Convenciones:
--   - IDs UUID con gen_random_uuid() (requiere extensión pgcrypto)
--   - snake_case en nombres de tabla y columna
--   - FKs con ON DELETE RESTRICT salvo cuando la dependencia es de composición
--   - JSONB para datos semi-estructurados (stats, alineaciones, redes)
--   - Campos que viven en Sanity referenciados por *_sanity_ref (text)
--
-- Aplicación sugerida: Supabase SQL Editor → pegar este archivo → Run
-- =============================================================================


CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- =============================================================================
-- 1) seasons (Temporada)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.seasons (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre          TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    fecha_inicio    DATE NOT NULL,
    fecha_fin       DATE NOT NULL,
    estado          TEXT NOT NULL DEFAULT 'activa'
                    CHECK (estado IN ('activa', 'archivada')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT seasons_fechas_ok CHECK (fecha_fin >= fecha_inicio)
);

CREATE INDEX IF NOT EXISTS seasons_estado_idx ON public.seasons (estado);

-- =============================================================================
-- 2) competitions (Competición)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.competitions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre          TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    tipo            TEXT NOT NULL
                    CHECK (tipo IN ('liga', 'copa', 'amistoso', 'internacional')),
    pais            TEXT,
    region          TEXT,
    logo_url        TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS competitions_tipo_idx ON public.competitions (tipo);

-- =============================================================================
-- 3) teams (Equipo)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.teams (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre          TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    tipo            TEXT NOT NULL
                    CHECK (tipo IN ('club_principal', 'rival', 'cantera', 'femenino')),
    escudo_url      TEXT,
    pais            TEXT,
    ciudad          TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS teams_tipo_idx ON public.teams (tipo);

-- =============================================================================
-- 4) matches (Partido)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.matches (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug                TEXT NOT NULL UNIQUE,
    season_id           UUID NOT NULL REFERENCES public.seasons(id)       ON DELETE RESTRICT,
    competition_id      UUID NOT NULL REFERENCES public.competitions(id)  ON DELETE RESTRICT,
    home_team_id        UUID NOT NULL REFERENCES public.teams(id)         ON DELETE RESTRICT,
    away_team_id        UUID NOT NULL REFERENCES public.teams(id)         ON DELETE RESTRICT,
    estadio_sanity_ref  TEXT,
    jornada             INTEGER,
    fecha_hora          TIMESTAMPTZ NOT NULL,
    estado              TEXT NOT NULL DEFAULT 'programado'
                        CHECK (estado IN ('programado', 'en_vivo', 'finalizado', 'suspendido', 'cancelado')),
    marcador_local      INTEGER,
    marcador_visita     INTEGER,
    asistencia          INTEGER,
    arbitro             TEXT,
    broadcasting_refs   JSONB NOT NULL DEFAULT '[]'::jsonb,
    alineacion_local    JSONB NOT NULL DEFAULT '[]'::jsonb,
    alineacion_visita   JSONB NOT NULL DEFAULT '[]'::jsonb,
    stats               JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT matches_distinct_teams CHECK (home_team_id <> away_team_id),
    CONSTRAINT matches_score_consistency CHECK (
        (estado IN ('programado', 'cancelado', 'suspendido')
            AND marcador_local IS NULL AND marcador_visita IS NULL)
        OR (estado IN ('en_vivo', 'finalizado')
            AND marcador_local IS NOT NULL AND marcador_visita IS NOT NULL)
    )
);

CREATE INDEX IF NOT EXISTS matches_season_idx       ON public.matches (season_id);
CREATE INDEX IF NOT EXISTS matches_competition_idx  ON public.matches (competition_id);
CREATE INDEX IF NOT EXISTS matches_home_team_idx    ON public.matches (home_team_id);
CREATE INDEX IF NOT EXISTS matches_away_team_idx    ON public.matches (away_team_id);
CREATE INDEX IF NOT EXISTS matches_fecha_hora_idx   ON public.matches (fecha_hora DESC);
CREATE INDEX IF NOT EXISTS matches_estado_idx       ON public.matches (estado);

-- =============================================================================
-- 5) players (Jugador)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.players (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug                TEXT NOT NULL UNIQUE,
    nombre              TEXT NOT NULL,
    apellido            TEXT NOT NULL,
    dorsal              INTEGER,
    posicion            TEXT NOT NULL
                        CHECK (posicion IN ('portero', 'defensa', 'mediocampista', 'delantero')),
    fecha_nacimiento    DATE,
    nacionalidad        TEXT,
    altura_cm           INTEGER CHECK (altura_cm IS NULL OR altura_cm BETWEEN 140 AND 230),
    peso_kg             INTEGER CHECK (peso_kg IS NULL OR peso_kg BETWEEN 40 AND 150),
    pie_habil           TEXT CHECK (pie_habil IS NULL OR pie_habil IN ('derecho', 'izquierdo', 'ambidiestro')),
    foto_url            TEXT,
    biografia_sanity_ref TEXT,
    estado              TEXT NOT NULL DEFAULT 'activo'
                        CHECK (estado IN ('activo', 'lesionado', 'cedido', 'retirado')),
    team_id             UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    historial_clubes    JSONB NOT NULL DEFAULT '[]'::jsonb,
    redes_sociales      JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS players_team_idx      ON public.players (team_id);
CREATE INDEX IF NOT EXISTS players_posicion_idx  ON public.players (posicion);
CREATE INDEX IF NOT EXISTS players_estado_idx    ON public.players (estado);
-- Dorsal único por equipo (entre jugadores del mismo team_id), ignorando NULLs
CREATE UNIQUE INDEX IF NOT EXISTS players_team_dorsal_uidx
    ON public.players (team_id, dorsal)
    WHERE team_id IS NOT NULL AND dorsal IS NOT NULL;

-- =============================================================================
-- 6) staff
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.staff (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug                TEXT NOT NULL UNIQUE,
    nombre              TEXT NOT NULL,
    rol                 TEXT NOT NULL,
    foto_url            TEXT,
    biografia_sanity_ref TEXT,
    team_id             UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS staff_team_idx ON public.staff (team_id);
CREATE INDEX IF NOT EXISTS staff_rol_idx  ON public.staff (rol);

-- =============================================================================
-- 7) match_events (Eventos del partido)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.match_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id        UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    team_id         UUID REFERENCES public.teams(id)   ON DELETE SET NULL,
    player_id       UUID REFERENCES public.players(id) ON DELETE SET NULL,
    minuto          INTEGER NOT NULL CHECK (minuto >= 0 AND minuto <= 130),
    minuto_extra    INTEGER CHECK (minuto_extra IS NULL OR minuto_extra >= 0),
    tipo            TEXT NOT NULL
                    CHECK (tipo IN (
                        'gol', 'gol_penal', 'gol_en_contra',
                        'amarilla', 'doble_amarilla', 'roja',
                        'sustitucion', 'penal_fallado', 'var'
                    )),
    descripcion     TEXT,
    metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS match_events_match_idx   ON public.match_events (match_id);
CREATE INDEX IF NOT EXISTS match_events_player_idx  ON public.match_events (player_id);
CREATE INDEX IF NOT EXISTS match_events_team_idx    ON public.match_events (team_id);

-- =============================================================================
-- 8) player_season_stats (Stats agregadas por jugador, temporada y competición)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.player_season_stats (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id           UUID NOT NULL REFERENCES public.players(id)      ON DELETE CASCADE,
    season_id           UUID NOT NULL REFERENCES public.seasons(id)      ON DELETE RESTRICT,
    competition_id      UUID REFERENCES public.competitions(id)          ON DELETE RESTRICT,
    partidos_jugados    INTEGER NOT NULL DEFAULT 0 CHECK (partidos_jugados >= 0),
    minutos             INTEGER NOT NULL DEFAULT 0 CHECK (minutos >= 0),
    goles               INTEGER NOT NULL DEFAULT 0 CHECK (goles >= 0),
    asistencias         INTEGER NOT NULL DEFAULT 0 CHECK (asistencias >= 0),
    amarillas           INTEGER NOT NULL DEFAULT 0 CHECK (amarillas >= 0),
    rojas               INTEGER NOT NULL DEFAULT 0 CHECK (rojas >= 0),
    stats               JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Una fila por (jugador, temporada, competición). NULL en competition_id = total de la temporada.
CREATE UNIQUE INDEX IF NOT EXISTS player_season_stats_uidx
    ON public.player_season_stats (player_id, season_id, COALESCE(competition_id, '00000000-0000-0000-0000-000000000000'::uuid));

CREATE INDEX IF NOT EXISTS player_season_stats_season_idx
    ON public.player_season_stats (season_id);

-- =============================================================================
-- 9) standings (Clasificación por equipo, temporada y competición)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.standings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_id       UUID NOT NULL REFERENCES public.seasons(id)       ON DELETE RESTRICT,
    competition_id  UUID NOT NULL REFERENCES public.competitions(id)  ON DELETE RESTRICT,
    team_id         UUID NOT NULL REFERENCES public.teams(id)         ON DELETE RESTRICT,
    posicion        INTEGER CHECK (posicion IS NULL OR posicion > 0),
    pj              INTEGER NOT NULL DEFAULT 0 CHECK (pj >= 0),
    pg              INTEGER NOT NULL DEFAULT 0 CHECK (pg >= 0),
    pe              INTEGER NOT NULL DEFAULT 0 CHECK (pe >= 0),
    pp              INTEGER NOT NULL DEFAULT 0 CHECK (pp >= 0),
    gf              INTEGER NOT NULL DEFAULT 0 CHECK (gf >= 0),
    gc              INTEGER NOT NULL DEFAULT 0 CHECK (gc >= 0),
    dg              INTEGER GENERATED ALWAYS AS (gf - gc) STORED,
    pts             INTEGER NOT NULL DEFAULT 0 CHECK (pts >= 0),
    forma           JSONB NOT NULL DEFAULT '[]'::jsonb,  -- ["G","G","E","P","G"]
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT standings_partidos_coherentes CHECK (pj = pg + pe + pp),
    CONSTRAINT standings_unique UNIQUE (season_id, competition_id, team_id)
);

CREATE INDEX IF NOT EXISTS standings_competition_idx ON public.standings (competition_id, season_id, posicion);

-- =============================================================================
-- Trigger: mantener updated_at al actualizar filas
-- =============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN
        SELECT unnest(ARRAY[
            'seasons', 'competitions', 'teams', 'matches',
            'players', 'staff', 'player_season_stats', 'standings'
        ])
    LOOP
        EXECUTE format(
            'DROP TRIGGER IF EXISTS %I_set_updated_at ON public.%I;', t, t
        );
        EXECUTE format(
            'CREATE TRIGGER %I_set_updated_at BEFORE UPDATE ON public.%I
             FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();', t, t
        );
    END LOOP;
END $$;

-- =============================================================================
-- Comentarios (útiles en Supabase Dashboard)
-- =============================================================================
COMMENT ON TABLE public.seasons              IS 'Temporadas deportivas del club';
COMMENT ON TABLE public.competitions         IS 'Torneos / competiciones (liga, copa, amistoso, internacional)';
COMMENT ON TABLE public.teams                IS 'Equipos: club principal, rivales, cantera, femenino';
COMMENT ON TABLE public.matches              IS 'Partidos con marcador, estado y datos contextuales';
COMMENT ON TABLE public.match_events         IS 'Eventos del partido (goles, tarjetas, sustituciones)';
COMMENT ON TABLE public.players              IS 'Jugadores con ficha estructural';
COMMENT ON TABLE public.staff                IS 'Cuerpo técnico y staff del club';
COMMENT ON TABLE public.player_season_stats  IS 'Estadísticas agregadas de jugador por temporada (y opcionalmente competición)';
COMMENT ON TABLE public.standings            IS 'Clasificación por equipo en una competición y temporada';
