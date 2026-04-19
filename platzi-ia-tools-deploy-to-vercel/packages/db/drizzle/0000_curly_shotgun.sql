-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "seasons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"slug" text NOT NULL,
	"fecha_inicio" date NOT NULL,
	"fecha_fin" date NOT NULL,
	"estado" text DEFAULT 'activa' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "seasons_slug_key" UNIQUE("slug"),
	CONSTRAINT "seasons_estado_check" CHECK (estado = ANY (ARRAY['activa'::text, 'archivada'::text])),
	CONSTRAINT "seasons_fechas_ok" CHECK (fecha_fin >= fecha_inicio)
);
--> statement-breakpoint
ALTER TABLE "seasons" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "competitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"slug" text NOT NULL,
	"tipo" text NOT NULL,
	"pais" text,
	"region" text,
	"logo_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "competitions_slug_key" UNIQUE("slug"),
	CONSTRAINT "competitions_tipo_check" CHECK (tipo = ANY (ARRAY['liga'::text, 'copa'::text, 'amistoso'::text, 'internacional'::text]))
);
--> statement-breakpoint
ALTER TABLE "competitions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"slug" text NOT NULL,
	"tipo" text NOT NULL,
	"escudo_url" text,
	"pais" text,
	"ciudad" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "teams_slug_key" UNIQUE("slug"),
	CONSTRAINT "teams_tipo_check" CHECK (tipo = ANY (ARRAY['club_principal'::text, 'rival'::text, 'cantera'::text, 'femenino'::text]))
);
--> statement-breakpoint
ALTER TABLE "teams" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"season_id" uuid NOT NULL,
	"competition_id" uuid NOT NULL,
	"home_team_id" uuid NOT NULL,
	"away_team_id" uuid NOT NULL,
	"estadio_sanity_ref" text,
	"jornada" integer,
	"fecha_hora" timestamp with time zone NOT NULL,
	"estado" text DEFAULT 'programado' NOT NULL,
	"marcador_local" integer,
	"marcador_visita" integer,
	"asistencia" integer,
	"arbitro" text,
	"broadcasting_refs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"alineacion_local" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"alineacion_visita" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"stats" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "matches_slug_key" UNIQUE("slug"),
	CONSTRAINT "matches_distinct_teams" CHECK (home_team_id <> away_team_id),
	CONSTRAINT "matches_estado_check" CHECK (estado = ANY (ARRAY['programado'::text, 'en_vivo'::text, 'finalizado'::text, 'suspendido'::text, 'cancelado'::text])),
	CONSTRAINT "matches_score_consistency" CHECK (((estado = ANY (ARRAY['programado'::text, 'cancelado'::text, 'suspendido'::text])) AND (marcador_local IS NULL) AND (marcador_visita IS NULL)) OR ((estado = ANY (ARRAY['en_vivo'::text, 'finalizado'::text])) AND (marcador_local IS NOT NULL) AND (marcador_visita IS NOT NULL)))
);
--> statement-breakpoint
ALTER TABLE "matches" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"nombre" text NOT NULL,
	"apellido" text NOT NULL,
	"dorsal" integer,
	"posicion" text NOT NULL,
	"fecha_nacimiento" date,
	"nacionalidad" text,
	"altura_cm" integer,
	"peso_kg" integer,
	"pie_habil" text,
	"foto_url" text,
	"biografia_sanity_ref" text,
	"estado" text DEFAULT 'activo' NOT NULL,
	"team_id" uuid,
	"historial_clubes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"redes_sociales" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "players_slug_key" UNIQUE("slug"),
	CONSTRAINT "players_altura_cm_check" CHECK ((altura_cm IS NULL) OR ((altura_cm >= 140) AND (altura_cm <= 230))),
	CONSTRAINT "players_estado_check" CHECK (estado = ANY (ARRAY['activo'::text, 'lesionado'::text, 'cedido'::text, 'retirado'::text])),
	CONSTRAINT "players_peso_kg_check" CHECK ((peso_kg IS NULL) OR ((peso_kg >= 40) AND (peso_kg <= 150))),
	CONSTRAINT "players_pie_habil_check" CHECK ((pie_habil IS NULL) OR (pie_habil = ANY (ARRAY['derecho'::text, 'izquierdo'::text, 'ambidiestro'::text]))),
	CONSTRAINT "players_posicion_check" CHECK (posicion = ANY (ARRAY['portero'::text, 'defensa'::text, 'mediocampista'::text, 'delantero'::text]))
);
--> statement-breakpoint
ALTER TABLE "players" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"nombre" text NOT NULL,
	"rol" text NOT NULL,
	"foto_url" text,
	"biografia_sanity_ref" text,
	"team_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "staff_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "staff" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "match_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"team_id" uuid,
	"player_id" uuid,
	"minuto" integer NOT NULL,
	"minuto_extra" integer,
	"tipo" text NOT NULL,
	"descripcion" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "match_events_minuto_check" CHECK ((minuto >= 0) AND (minuto <= 130)),
	CONSTRAINT "match_events_minuto_extra_check" CHECK ((minuto_extra IS NULL) OR (minuto_extra >= 0)),
	CONSTRAINT "match_events_tipo_check" CHECK (tipo = ANY (ARRAY['gol'::text, 'gol_penal'::text, 'gol_en_contra'::text, 'amarilla'::text, 'doble_amarilla'::text, 'roja'::text, 'sustitucion'::text, 'penal_fallado'::text, 'var'::text]))
);
--> statement-breakpoint
ALTER TABLE "match_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "player_season_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"season_id" uuid NOT NULL,
	"competition_id" uuid,
	"partidos_jugados" integer DEFAULT 0 NOT NULL,
	"minutos" integer DEFAULT 0 NOT NULL,
	"goles" integer DEFAULT 0 NOT NULL,
	"asistencias" integer DEFAULT 0 NOT NULL,
	"amarillas" integer DEFAULT 0 NOT NULL,
	"rojas" integer DEFAULT 0 NOT NULL,
	"stats" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "player_season_stats_amarillas_check" CHECK (amarillas >= 0),
	CONSTRAINT "player_season_stats_asistencias_check" CHECK (asistencias >= 0),
	CONSTRAINT "player_season_stats_goles_check" CHECK (goles >= 0),
	CONSTRAINT "player_season_stats_minutos_check" CHECK (minutos >= 0),
	CONSTRAINT "player_season_stats_partidos_jugados_check" CHECK (partidos_jugados >= 0),
	CONSTRAINT "player_season_stats_rojas_check" CHECK (rojas >= 0)
);
--> statement-breakpoint
ALTER TABLE "player_season_stats" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "standings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"season_id" uuid NOT NULL,
	"competition_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"posicion" integer,
	"pj" integer DEFAULT 0 NOT NULL,
	"pg" integer DEFAULT 0 NOT NULL,
	"pe" integer DEFAULT 0 NOT NULL,
	"pp" integer DEFAULT 0 NOT NULL,
	"gf" integer DEFAULT 0 NOT NULL,
	"gc" integer DEFAULT 0 NOT NULL,
	"dg" integer GENERATED ALWAYS AS ((gf - gc)) STORED,
	"pts" integer DEFAULT 0 NOT NULL,
	"forma" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "standings_unique" UNIQUE("season_id","competition_id","team_id"),
	CONSTRAINT "standings_gc_check" CHECK (gc >= 0),
	CONSTRAINT "standings_gf_check" CHECK (gf >= 0),
	CONSTRAINT "standings_partidos_coherentes" CHECK (pj = ((pg + pe) + pp)),
	CONSTRAINT "standings_pe_check" CHECK (pe >= 0),
	CONSTRAINT "standings_pg_check" CHECK (pg >= 0),
	CONSTRAINT "standings_pj_check" CHECK (pj >= 0),
	CONSTRAINT "standings_posicion_check" CHECK ((posicion IS NULL) OR (posicion > 0)),
	CONSTRAINT "standings_pp_check" CHECK (pp >= 0),
	CONSTRAINT "standings_pts_check" CHECK (pts >= 0)
);
--> statement-breakpoint
ALTER TABLE "standings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "public"."teams"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "public"."teams"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_season_stats" ADD CONSTRAINT "player_season_stats_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_season_stats" ADD CONSTRAINT "player_season_stats_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_season_stats" ADD CONSTRAINT "player_season_stats_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standings" ADD CONSTRAINT "standings_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standings" ADD CONSTRAINT "standings_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standings" ADD CONSTRAINT "standings_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "seasons_estado_idx" ON "seasons" USING btree ("estado" text_ops);--> statement-breakpoint
CREATE INDEX "competitions_tipo_idx" ON "competitions" USING btree ("tipo" text_ops);--> statement-breakpoint
CREATE INDEX "teams_tipo_idx" ON "teams" USING btree ("tipo" text_ops);--> statement-breakpoint
CREATE INDEX "matches_away_team_idx" ON "matches" USING btree ("away_team_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "matches_competition_idx" ON "matches" USING btree ("competition_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "matches_estado_idx" ON "matches" USING btree ("estado" text_ops);--> statement-breakpoint
CREATE INDEX "matches_fecha_hora_idx" ON "matches" USING btree ("fecha_hora" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "matches_home_team_idx" ON "matches" USING btree ("home_team_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "matches_season_idx" ON "matches" USING btree ("season_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "players_estado_idx" ON "players" USING btree ("estado" text_ops);--> statement-breakpoint
CREATE INDEX "players_posicion_idx" ON "players" USING btree ("posicion" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "players_team_dorsal_uidx" ON "players" USING btree ("team_id" int4_ops,"dorsal" uuid_ops) WHERE ((team_id IS NOT NULL) AND (dorsal IS NOT NULL));--> statement-breakpoint
CREATE INDEX "players_team_idx" ON "players" USING btree ("team_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "staff_rol_idx" ON "staff" USING btree ("rol" text_ops);--> statement-breakpoint
CREATE INDEX "staff_team_idx" ON "staff" USING btree ("team_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "match_events_match_idx" ON "match_events" USING btree ("match_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "match_events_player_idx" ON "match_events" USING btree ("player_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "match_events_team_idx" ON "match_events" USING btree ("team_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "player_season_stats_season_idx" ON "player_season_stats" USING btree ("season_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "player_season_stats_uidx" ON "player_season_stats" USING btree (player_id uuid_ops,season_id uuid_ops,COALESCE(competition_id, '00000000-0000-0000-0000-000000000000' uuid_ops);--> statement-breakpoint
CREATE INDEX "standings_competition_idx" ON "standings" USING btree ("competition_id" int4_ops,"season_id" uuid_ops,"posicion" uuid_ops);
*/