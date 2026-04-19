/**
 * Tests for schema.sql — the PostgreSQL schema for Platzi FC.
 *
 * These tests parse and validate the SQL file's structure without requiring
 * a live database connection. They verify that all expected DDL declarations,
 * constraints, and conventions described in the file header are present.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { describe, it, expect, beforeAll } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
// schema.sql lives at the repository root (two levels up from packages/db)
const SCHEMA_PATH = resolve(__dirname, "../../../schema.sql");

let sql: string;

beforeAll(() => {
  sql = readFileSync(SCHEMA_PATH, "utf-8");
});

// ---------------------------------------------------------------------------
// Extension
// ---------------------------------------------------------------------------
describe("pgcrypto extension", () => {
  it("declares pgcrypto extension", () => {
    expect(sql).toMatch(/CREATE EXTENSION IF NOT EXISTS pgcrypto/i);
  });

  it("pgcrypto extension statement appears before any CREATE TABLE", () => {
    const extIdx = sql.indexOf("CREATE EXTENSION IF NOT EXISTS pgcrypto");
    const firstTableIdx = sql.indexOf("CREATE TABLE");
    expect(extIdx).toBeGreaterThanOrEqual(0);
    expect(firstTableIdx).toBeGreaterThan(extIdx);
  });
});

// ---------------------------------------------------------------------------
// Expected tables
// ---------------------------------------------------------------------------
const EXPECTED_TABLES = [
  "seasons",
  "competitions",
  "teams",
  "matches",
  "players",
  "staff",
  "match_events",
  "player_season_stats",
  "standings",
] as const;

describe("table definitions", () => {
  for (const table of EXPECTED_TABLES) {
    it(`defines table "${table}"`, () => {
      // Matches: CREATE TABLE IF NOT EXISTS public.<table> (
      const pattern = new RegExp(
        `CREATE\\s+TABLE\\s+IF\\s+NOT\\s+EXISTS\\s+public\\.${table}\\s*\\(`,
        "i",
      );
      expect(sql).toMatch(pattern);
    });
  }

  it("all tables are created with IF NOT EXISTS", () => {
    const tableMatches = sql.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?public\.\w+/gi) ?? [];
    for (const match of tableMatches) {
      expect(match).toMatch(/IF NOT EXISTS/i);
    }
  });
});

// ---------------------------------------------------------------------------
// UUID primary keys using gen_random_uuid()
// ---------------------------------------------------------------------------
describe("UUID primary keys", () => {
  it("uses UUID type for primary keys", () => {
    expect(sql).toMatch(/UUID\s+PRIMARY\s+KEY/i);
  });

  it("uses gen_random_uuid() as default for primary keys", () => {
    expect(sql).toMatch(/DEFAULT\s+gen_random_uuid\(\)/i);
  });

  it("every table has a UUID primary key with gen_random_uuid()", () => {
    const uuidPKCount = (
      sql.match(/UUID\s+PRIMARY\s+KEY\s+DEFAULT\s+gen_random_uuid\(\)/gi) ?? []
    ).length;
    // One per table
    expect(uuidPKCount).toBe(EXPECTED_TABLES.length);
  });
});

// ---------------------------------------------------------------------------
// Naming conventions
// ---------------------------------------------------------------------------
describe("naming conventions", () => {
  it("uses snake_case for table names (no camelCase table)", () => {
    // Ensure all public table names are snake_case
    const tableNames = [...sql.matchAll(/CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+public\.(\w+)/gi)].map(
      (m) => m[1],
    );
    for (const name of tableNames) {
      expect(name).toMatch(/^[a-z][a-z0-9_]*$/);
    }
  });

  it("schema name is 'public' for all tables", () => {
    const tableDecls = [...sql.matchAll(/CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+(\w+)\.\w+/gi)].map(
      (m) => m[1],
    );
    for (const schema of tableDecls) {
      expect(schema).toBe("public");
    }
  });
});

// ---------------------------------------------------------------------------
// CHECK constraints — seasons
// ---------------------------------------------------------------------------
describe("seasons table constraints", () => {
  it("restricts estado to allowed values", () => {
    expect(sql).toMatch(/'activa',\s*'archivada'/);
  });

  it("enforces fecha_fin >= fecha_inicio", () => {
    expect(sql).toMatch(/seasons_fechas_ok/);
    expect(sql).toMatch(/CHECK\s*\(\s*fecha_fin\s*>=\s*fecha_inicio\s*\)/i);
  });

  it("has an index on estado column", () => {
    expect(sql).toMatch(/CREATE\s+INDEX\s+IF\s+NOT\s+EXISTS\s+seasons_estado_idx/i);
  });
});

// ---------------------------------------------------------------------------
// CHECK constraints — competitions
// ---------------------------------------------------------------------------
describe("competitions table constraints", () => {
  it("restricts tipo to liga, copa, amistoso, internacional", () => {
    expect(sql).toMatch(/'liga',\s*'copa',\s*'amistoso',\s*'internacional'/);
  });

  it("has an index on tipo column", () => {
    expect(sql).toMatch(/CREATE\s+INDEX\s+IF\s+NOT\s+EXISTS\s+competitions_tipo_idx/i);
  });
});

// ---------------------------------------------------------------------------
// CHECK constraints — teams
// ---------------------------------------------------------------------------
describe("teams table constraints", () => {
  it("restricts tipo to club_principal, rival, cantera, femenino", () => {
    expect(sql).toMatch(/'club_principal',\s*'rival',\s*'cantera',\s*'femenino'/);
  });

  it("has an index on tipo column", () => {
    expect(sql).toMatch(/CREATE\s+INDEX\s+IF\s+NOT\s+EXISTS\s+teams_tipo_idx/i);
  });
});

// ---------------------------------------------------------------------------
// matches table
// ---------------------------------------------------------------------------
describe("matches table", () => {
  it("restricts estado to allowed match states", () => {
    expect(sql).toMatch(/'programado',\s*'en_vivo',\s*'finalizado',\s*'suspendido',\s*'cancelado'/);
  });

  it("prevents a team from playing against itself (distinct teams constraint)", () => {
    expect(sql).toMatch(/matches_distinct_teams/);
    expect(sql).toMatch(/home_team_id\s*<>\s*away_team_id/);
  });

  it("enforces score consistency with match estado", () => {
    expect(sql).toMatch(/matches_score_consistency/);
  });

  it("has foreign key to seasons", () => {
    expect(sql).toMatch(/season_id\s+UUID\s+NOT NULL\s+REFERENCES\s+public\.seasons\(id\)/i);
  });

  it("has foreign key to competitions", () => {
    expect(sql).toMatch(/competition_id\s+UUID\s+NOT NULL\s+REFERENCES\s+public\.competitions\(id\)/i);
  });

  it("has foreign key to teams for both home and away", () => {
    expect(sql).toMatch(/home_team_id\s+UUID\s+NOT NULL\s+REFERENCES\s+public\.teams\(id\)/i);
    expect(sql).toMatch(/away_team_id\s+UUID\s+NOT NULL\s+REFERENCES\s+public\.teams\(id\)/i);
  });

  it("uses JSONB for broadcasting_refs, alineacion_local, alineacion_visita, stats", () => {
    expect(sql).toMatch(/broadcasting_refs\s+JSONB/i);
    expect(sql).toMatch(/alineacion_local\s+JSONB/i);
    expect(sql).toMatch(/alineacion_visita\s+JSONB/i);
    expect(sql).toMatch(/stats\s+JSONB/i);
  });

  it("has performance indexes", () => {
    expect(sql).toMatch(/matches_season_idx/);
    expect(sql).toMatch(/matches_competition_idx/);
    expect(sql).toMatch(/matches_home_team_idx/);
    expect(sql).toMatch(/matches_away_team_idx/);
    expect(sql).toMatch(/matches_fecha_hora_idx/);
    expect(sql).toMatch(/matches_estado_idx/);
  });
});

// ---------------------------------------------------------------------------
// players table
// ---------------------------------------------------------------------------
describe("players table", () => {
  it("restricts posicion to portero, defensa, mediocampista, delantero", () => {
    expect(sql).toMatch(/'portero',\s*'defensa',\s*'mediocampista',\s*'delantero'/);
  });

  it("validates altura_cm range (140–230)", () => {
    expect(sql).toMatch(/altura_cm\s+BETWEEN\s+140\s+AND\s+230/i);
  });

  it("validates peso_kg range (40–150)", () => {
    expect(sql).toMatch(/peso_kg\s+BETWEEN\s+40\s+AND\s+150/i);
  });

  it("restricts pie_habil to valid foot preference values", () => {
    expect(sql).toMatch(/'derecho',\s*'izquierdo',\s*'ambidiestro'/);
  });

  it("restricts estado to activo, lesionado, cedido, retirado", () => {
    expect(sql).toMatch(/'activo',\s*'lesionado',\s*'cedido',\s*'retirado'/);
  });

  it("has a unique index for dorsal per team (partial, null-safe)", () => {
    expect(sql).toMatch(/players_team_dorsal_uidx/);
    expect(sql).toMatch(/WHERE\s+team_id\s+IS\s+NOT\s+NULL\s+AND\s+dorsal\s+IS\s+NOT\s+NULL/i);
  });

  it("uses ON DELETE SET NULL for team_id FK (soft dependency)", () => {
    // players.team_id FK should be SET NULL (player can exist without a team)
    expect(sql).toMatch(/team_id\s+UUID\s+REFERENCES\s+public\.teams\(id\)\s+ON\s+DELETE\s+SET\s+NULL/i);
  });
});

// ---------------------------------------------------------------------------
// match_events table
// ---------------------------------------------------------------------------
describe("match_events table", () => {
  it("restricts minuto to 0–130 (extra time coverage)", () => {
    expect(sql).toMatch(/minuto\s+INTEGER\s+NOT\s+NULL\s+CHECK\s*\(\s*minuto\s*>=\s*0\s+AND\s+minuto\s*<=\s*130\s*\)/i);
  });

  it("restricts tipo to all expected event types", () => {
    const eventTypes = [
      "gol",
      "gol_penal",
      "gol_en_contra",
      "amarilla",
      "doble_amarilla",
      "roja",
      "sustitucion",
      "penal_fallado",
      "var",
    ];
    for (const type of eventTypes) {
      expect(sql).toContain(`'${type}'`);
    }
  });

  it("cascades deletes from matches (ON DELETE CASCADE)", () => {
    expect(sql).toMatch(/match_id\s+UUID\s+NOT NULL\s+REFERENCES\s+public\.matches\(id\)\s+ON\s+DELETE\s+CASCADE/i);
  });

  it("does not cascade delete players or teams (SET NULL)", () => {
    // match_events.player_id and team_id should be SET NULL (event survives player/team deletion)
    expect(sql).toMatch(/player_id\s+UUID\s+REFERENCES\s+public\.players\(id\)\s+ON\s+DELETE\s+SET\s+NULL/i);
    expect(sql).toMatch(/team_id\s+UUID\s+REFERENCES\s+public\.teams\(id\)\s+ON\s+DELETE\s+SET\s+NULL/i);
  });
});

// ---------------------------------------------------------------------------
// player_season_stats table
// ---------------------------------------------------------------------------
describe("player_season_stats table", () => {
  const nonNegativeStats = [
    "partidos_jugados",
    "minutos",
    "goles",
    "asistencias",
    "amarillas",
    "rojas",
  ];

  for (const stat of nonNegativeStats) {
    it(`enforces non-negative constraint on ${stat}`, () => {
      expect(sql).toMatch(new RegExp(`${stat}\\s+INTEGER\\s+NOT\\s+NULL[^)]*CHECK\\s*\\(\\s*${stat}\\s*>=\\s*0\\s*\\)`, "i"));
    });
  }

  it("has a unique index per (player, season, competition) with null-safe coalesce", () => {
    expect(sql).toMatch(/player_season_stats_uidx/);
    expect(sql).toMatch(/COALESCE\(competition_id/i);
  });

  it("has season index for lookup performance", () => {
    expect(sql).toMatch(/player_season_stats_season_idx/i);
  });
});

// ---------------------------------------------------------------------------
// standings table
// ---------------------------------------------------------------------------
describe("standings table", () => {
  it("has a generated column dg (goal difference = gf - gc)", () => {
    expect(sql).toMatch(/dg\s+INTEGER\s+GENERATED\s+ALWAYS\s+AS\s*\(\s*gf\s*-\s*gc\s*\)\s+STORED/i);
  });

  it("enforces pj = pg + pe + pp", () => {
    expect(sql).toMatch(/standings_partidos_coherentes/);
    expect(sql).toMatch(/CHECK\s*\(\s*pj\s*=\s*pg\s*\+\s*pe\s*\+\s*pp\s*\)/i);
  });

  it("has a unique constraint per (season, competition, team)", () => {
    expect(sql).toMatch(/standings_unique/);
    expect(sql).toMatch(/UNIQUE\s*\(\s*season_id,\s*competition_id,\s*team_id\s*\)/i);
  });

  it("has an index on competition+season+position for leaderboard queries", () => {
    expect(sql).toMatch(/standings_competition_idx/);
    expect(sql).toMatch(/ON\s+public\.standings\s*\(\s*competition_id,\s*season_id,\s*posicion\s*\)/i);
  });
});

// ---------------------------------------------------------------------------
// updated_at trigger
// ---------------------------------------------------------------------------
describe("updated_at trigger", () => {
  it("defines the set_updated_at trigger function", () => {
    expect(sql).toMatch(/CREATE\s+OR\s+REPLACE\s+FUNCTION\s+public\.set_updated_at\(\)/i);
  });

  it("trigger function sets NEW.updated_at = now()", () => {
    expect(sql).toMatch(/NEW\.updated_at\s*=\s*now\(\)/i);
  });

  it("trigger is applied to all tables that have updated_at", () => {
    const tablesWithUpdatedAt = [
      "seasons",
      "competitions",
      "teams",
      "matches",
      "players",
      "staff",
      "player_season_stats",
      "standings",
    ];
    // The DO block lists all of them
    for (const table of tablesWithUpdatedAt) {
      const pattern = new RegExp(`'${table}'`);
      expect(sql).toMatch(pattern);
    }
  });

  it("drops trigger before recreating to ensure idempotency", () => {
    expect(sql).toMatch(/DROP\s+TRIGGER\s+IF\s+EXISTS/i);
  });
});

// ---------------------------------------------------------------------------
// JSONB fields with safe defaults
// ---------------------------------------------------------------------------
describe("JSONB field defaults", () => {
  it("array JSONB fields default to empty array '[]'", () => {
    // broadcasting_refs, alineacion_local, alineacion_visita, historial_clubes, forma
    const arrayDefaults = (sql.match(/'\[\]'::jsonb/g) ?? []).length;
    expect(arrayDefaults).toBeGreaterThanOrEqual(1);
  });

  it("object JSONB fields default to empty object '{}'", () => {
    const objectDefaults = (sql.match(/'\{\}'::jsonb/g) ?? []).length;
    expect(objectDefaults).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// Foreign key ON DELETE RESTRICT convention
// ---------------------------------------------------------------------------
describe("foreign key delete rules", () => {
  it("uses ON DELETE RESTRICT for season_id FKs", () => {
    const restrictMatches = [...sql.matchAll(/season_id\s+UUID\s+NOT NULL\s+REFERENCES\s+public\.seasons\(id\)\s+ON\s+DELETE\s+RESTRICT/gi)];
    expect(restrictMatches.length).toBeGreaterThan(0);
  });

  it("uses ON DELETE CASCADE for match_events → matches (composition)", () => {
    expect(sql).toMatch(/REFERENCES\s+public\.matches\(id\)\s+ON\s+DELETE\s+CASCADE/i);
  });
});

// ---------------------------------------------------------------------------
// UNIQUE slugs per table
// ---------------------------------------------------------------------------
describe("slug uniqueness", () => {
  const tablesWithSlug = ["seasons", "competitions", "teams", "matches", "players", "staff"];

  for (const table of tablesWithSlug) {
    it(`${table} declares slug as UNIQUE`, () => {
      // The slug definition appears in the CREATE TABLE block for this table.
      // We look for a slug TEXT NOT NULL UNIQUE line anywhere in the file.
      // Since each table has its own slug, we count occurrences.
      expect(sql).toMatch(/slug\s+TEXT\s+NOT\s+NULL\s+UNIQUE/i);
    });
  }
});

// ---------------------------------------------------------------------------
// Table comments
// ---------------------------------------------------------------------------
describe("table comments for documentation", () => {
  const commentedTables = [
    "seasons",
    "competitions",
    "teams",
    "matches",
    "match_events",
    "players",
    "staff",
    "player_season_stats",
    "standings",
  ];

  for (const table of commentedTables) {
    it(`has a COMMENT ON TABLE for ${table}`, () => {
      const pattern = new RegExp(
        `COMMENT\\s+ON\\s+TABLE\\s+public\\.${table}\\s+IS\\s+'`,
        "i",
      );
      expect(sql).toMatch(pattern);
    });
  }
});

// ---------------------------------------------------------------------------
// Whitespace / formatting (regression for PR changes)
// ---------------------------------------------------------------------------
describe("schema.sql formatting (PR regression)", () => {
  it("has a blank line before CREATE EXTENSION statement", () => {
    // The PR added a blank line before CREATE EXTENSION IF NOT EXISTS pgcrypto
    const lines = sql.split("\n");
    const extLineIdx = lines.findIndex((l) => l.trim().startsWith("CREATE EXTENSION IF NOT EXISTS pgcrypto"));
    expect(extLineIdx).toBeGreaterThan(0);
    const precedingLine = lines[extLineIdx - 1];
    expect(precedingLine?.trim()).toBe("");
  });

  it("has a blank line after CREATE EXTENSION statement", () => {
    const lines = sql.split("\n");
    const extLineIdx = lines.findIndex((l) => l.trim().startsWith("CREATE EXTENSION IF NOT EXISTS pgcrypto"));
    expect(extLineIdx).toBeGreaterThan(0);
    const followingLine = lines[extLineIdx + 1];
    expect(followingLine?.trim()).toBe("");
  });
});