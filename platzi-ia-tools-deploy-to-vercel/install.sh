#!/usr/bin/env bash
# ============================================================================
# install.sh — Bootstrap del proyecto Platzi FC
# ----------------------------------------------------------------------------
# Ejecuta automáticamente todos los pasos de las secciones 5.1 → 5.6 del
# README, más los `apply:*` necesarios para tener tablas y datos en una
# Postgres limpia.
#
# Uso:
#   ./install.sh                  # Instalación completa
#   ./install.sh --skip-deps      # No reinstala node_modules
#   ./install.sh --skip-schema    # No corre schema.sql ni apply:*
#   ./install.sh --skip-seeds     # No corre seeds (ni apply:*)
#   ./install.sh --no-dev         # No arranca el dev server al final
#   ./install.sh --yes            # No pregunta nada (modo CI)
#   ./install.sh --full           # Dev en background + secciones 6, 7, 8 del README
#                                 # (lint, typecheck, tests, drizzle info, build)
#
# Variables de entorno relevantes:
#   DATABASE_URL          — connection string completa (override de .env.local)
#   PLATZI_FC_NO_COLOR=1  — desactiva los colores ANSI
# ============================================================================

set -Eeuo pipefail

# ---------------------------------------------------------------------------
# Estilo y logging
# ---------------------------------------------------------------------------
if [[ -t 1 && -z "${PLATZI_FC_NO_COLOR:-}" ]]; then
  C_RESET=$'\033[0m'
  C_BOLD=$'\033[1m'
  C_DIM=$'\033[2m'
  C_RED=$'\033[31m'
  C_GREEN=$'\033[32m'
  C_YELLOW=$'\033[33m'
  C_BLUE=$'\033[34m'
  C_MAGENTA=$'\033[35m'
  C_CYAN=$'\033[36m'
else
  C_RESET=""; C_BOLD=""; C_DIM=""; C_RED=""; C_GREEN=""
  C_YELLOW=""; C_BLUE=""; C_MAGENTA=""; C_CYAN=""
fi

START_TIME=$(date +%s)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

ts() { date '+%H:%M:%S'; }

log()      { printf '%s %s[INFO]%s    %s\n'  "$(ts)" "${C_BLUE}"   "${C_RESET}" "$*"; }
ok()       { printf '%s %s[OK]%s      %s\n'  "$(ts)" "${C_GREEN}"  "${C_RESET}" "$*"; }
warn()     { printf '%s %s[WARN]%s    %s\n'  "$(ts)" "${C_YELLOW}" "${C_RESET}" "$*" >&2; }
err()      { printf '%s %s[ERROR]%s   %s\n'  "$(ts)" "${C_RED}"    "${C_RESET}" "$*" >&2; }
step()     { printf '\n%s%s━━ %s ━━%s\n'      "${C_BOLD}" "${C_MAGENTA}" "$*" "${C_RESET}"; }
substep()  { printf '%s %s[STEP]%s    %s\n'  "$(ts)" "${C_CYAN}"   "${C_RESET}" "$*"; }
detail()   { printf '%s %s          %s%s\n'   "$(ts)" "${C_DIM}"    "$*" "${C_RESET}"; }

on_error() {
  local exit_code=$?
  local line_no=$1
  err "Falló en línea ${line_no} con código ${exit_code}."
  err "Revisa el último bloque marcado con [STEP] arriba."
  exit "$exit_code"
}
trap 'on_error $LINENO' ERR

# ---------------------------------------------------------------------------
# Parseo de flags
# ---------------------------------------------------------------------------
SKIP_DEPS=0
SKIP_SCHEMA=0
SKIP_SEEDS=0
RUN_DEV=1
ASSUME_YES=0
RUN_FULL=0

for arg in "$@"; do
  case "$arg" in
    --skip-deps)   SKIP_DEPS=1   ;;
    --skip-schema) SKIP_SCHEMA=1 ;;
    --skip-seeds)  SKIP_SEEDS=1  ;;
    --no-dev)      RUN_DEV=0     ;;
    --yes|-y)      ASSUME_YES=1; RUN_DEV=0 ;;
    --full)        RUN_FULL=1; ASSUME_YES=1; RUN_DEV=0 ;;
    -h|--help)
      sed -n '2,22p' "$0"
      exit 0
      ;;
    *)
      err "Flag desconocido: $arg (usa --help)."
      exit 2
      ;;
  esac
done

confirm() {
  # confirm "Pregunta" — devuelve 0 (sí) o 1 (no). Acepta --yes para auto.
  local prompt=$1
  if [[ "$ASSUME_YES" -eq 1 ]]; then
    detail "(--yes) Auto-confirmado: ${prompt}"
    return 0
  fi
  printf '%s %s[?]%s     %s [y/N]: ' "$(ts)" "${C_YELLOW}" "${C_RESET}" "$prompt"
  local reply
  read -r reply
  [[ "$reply" =~ ^[Yy]$ ]]
}

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
require_cmd() {
  local cmd=$1
  local hint=${2:-}
  if ! command -v "$cmd" >/dev/null 2>&1; then
    err "Falta el comando '${cmd}'."
    [[ -n "$hint" ]] && detail "Sugerencia: ${hint}"
    exit 1
  fi
}

# Compara dos versiones SemVer ($1 >= $2). Devuelve 0 si OK.
version_ge() {
  printf '%s\n%s\n' "$2" "$1" | sort -V -C
}

ensure_env_file() {
  # ensure_env_file <relative_path>
  # Si no existe .env.local, lo crea desde .env.example y avisa.
  local target=$1
  local example="${target%/.env.local}/.env.example"
  if [[ -f "$target" ]]; then
    ok "Ya existe ${target}."
    return 0
  fi
  if [[ ! -f "$example" ]]; then
    err "No encuentro ${example} para clonar a ${target}."
    return 1
  fi
  cp "$example" "$target"
  warn "Creado ${target} desde el example. Edítalo con valores reales."
}

extract_env_value() {
  # extract_env_value <file> <KEY>
  local file=$1 key=$2
  [[ -f "$file" ]] || return 0
  grep -E "^${key}=" "$file" | tail -n 1 | cut -d'=' -f2- | sed -E 's/^"//; s/"$//'
}

resolve_database_url() {
  # Devuelve por stdout la DATABASE_URL efectiva: env > apps/web > packages/db.
  if [[ -n "${DATABASE_URL:-}" ]]; then
    echo "$DATABASE_URL"
    return 0
  fi
  local from_db
  from_db=$(extract_env_value "$SCRIPT_DIR/packages/db/.env.local" DATABASE_URL || true)
  if [[ -n "$from_db" ]]; then
    echo "$from_db"
    return 0
  fi
  extract_env_value "$SCRIPT_DIR/apps/web/.env.local" DATABASE_URL || true
}

# ---------------------------------------------------------------------------
# 5.1 — Prerrequisitos
# ---------------------------------------------------------------------------
step "5.1  Comprobando prerrequisitos"

substep "Comprobando Node.js (>=20)"
require_cmd node "Instala Node 20+ desde https://nodejs.org/ o con nvm."
NODE_VERSION=$(node -v | sed 's/^v//')
detail "Node.js detectado: ${NODE_VERSION}"
if ! version_ge "$NODE_VERSION" "20.0.0"; then
  err "Se requiere Node >=20.0.0; tienes ${NODE_VERSION}."
  exit 1
fi
ok "Node.js ${NODE_VERSION} OK."

substep "Comprobando pnpm (>=10)"
require_cmd pnpm "Instala pnpm con: npm install -g pnpm@10"
PNPM_VERSION=$(pnpm -v)
detail "pnpm detectado: ${PNPM_VERSION}"
if ! version_ge "$PNPM_VERSION" "10.0.0"; then
  err "Se requiere pnpm >=10.0.0; tienes ${PNPM_VERSION}."
  exit 1
fi
ok "pnpm ${PNPM_VERSION} OK."

substep "Comprobando psql (opcional, sólo para 5.4)"
if command -v psql >/dev/null 2>&1; then
  PSQL_VERSION=$(psql --version | awk '{print $3}')
  ok "psql ${PSQL_VERSION} disponible."
  HAS_PSQL=1
else
  warn "psql no encontrado en PATH."
  detail "Podrás continuar, pero deberás aplicar schema.sql manualmente desde Supabase SQL Editor."
  HAS_PSQL=0
fi

substep "Comprobando estructura mínima del repo"
for f in pnpm-workspace.yaml turbo.json schema.sql packages/db/package.json apps/web/package.json; do
  if [[ ! -f "$SCRIPT_DIR/$f" ]]; then
    err "No encuentro ${f}. ¿Estás ejecutando install.sh desde la raíz del repo?"
    exit 1
  fi
done
ok "Estructura del repo OK."

# ---------------------------------------------------------------------------
# 5.2 — Instalar dependencias
# ---------------------------------------------------------------------------
step "5.2  Instalando dependencias del monorepo"
cd "$SCRIPT_DIR"

if [[ "$SKIP_DEPS" -eq 1 ]]; then
  warn "--skip-deps activo: salto pnpm install."
else
  substep "Ejecutando 'pnpm install'"
  detail "Esto puede tardar varios minutos en una instalación fresca."
  pnpm install
  ok "Dependencias instaladas."
fi

# ---------------------------------------------------------------------------
# 5.3 — Variables de entorno
# ---------------------------------------------------------------------------
step "5.3  Variables de entorno"

substep "Asegurando packages/db/.env.local"
ensure_env_file "$SCRIPT_DIR/packages/db/.env.local"

substep "Asegurando apps/web/.env.local"
ensure_env_file "$SCRIPT_DIR/apps/web/.env.local"

DATABASE_URL_EFECTIVA=$(resolve_database_url)
if [[ -z "$DATABASE_URL_EFECTIVA" || "$DATABASE_URL_EFECTIVA" == *"xxxxx"* || "$DATABASE_URL_EFECTIVA" == *"USER:PASSWORD"* ]]; then
  err "DATABASE_URL no está configurada o sigue con valores de placeholder."
  detail "Edita uno de:"
  detail "  • packages/db/.env.local"
  detail "  • apps/web/.env.local"
  detail "  • o exporta DATABASE_URL en la sesión actual."
  detail "Recuerda url-encodear caracteres especiales del password (\$ → %24, * → %2A)."
  exit 1
fi
ok "DATABASE_URL detectada."
detail "(Ocultando valor por seguridad)"

# ---------------------------------------------------------------------------
# 5.4 — Esquema en la base de datos
# ---------------------------------------------------------------------------
step "5.4  Aplicando schema.sql"

if [[ "$SKIP_SCHEMA" -eq 1 ]]; then
  warn "--skip-schema activo: salto schema.sql."
elif [[ "$HAS_PSQL" -eq 0 ]]; then
  warn "psql no disponible: salto schema.sql."
  detail "Aplica /schema.sql manualmente desde el SQL Editor de Supabase antes de continuar."
else
  if confirm "Vas a ejecutar schema.sql contra la DB. ¿Continuar?"; then
    substep "Ejecutando schema.sql con psql"
    DATABASE_URL="$DATABASE_URL_EFECTIVA" psql "$DATABASE_URL_EFECTIVA" -v ON_ERROR_STOP=1 -f "$SCRIPT_DIR/schema.sql"
    ok "schema.sql aplicado."
  else
    warn "Saltando schema.sql por elección del usuario."
  fi
fi

# ---------------------------------------------------------------------------
# 5.5 — Seeds
# ---------------------------------------------------------------------------
step "5.5  Cargando datos de prueba (seeds)"

run_db_script() {
  # run_db_script <script> <descripción>
  local script=$1
  local desc=$2
  substep "${desc}"
  detail "→ pnpm --filter @platzi-fc/db ${script}"
  if pnpm --filter @platzi-fc/db "${script}"; then
    ok "${desc} → completado."
  else
    err "${desc} falló (script ${script})."
    return 1
  fi
}

if [[ "$SKIP_SEEDS" -eq 1 ]]; then
  warn "--skip-seeds activo: salto seeds y apply:*."
else
  # Orden deliberado: primero crear/actualizar tablas, luego sembrar.
  # apply:fans cubre las tablas nuevas del Sprint V1-3 (memberships, eventos,
  # newsletter); las del MVP están en schema.sql, las editoriales y
  # comerciales tienen su propio apply:*.
  run_db_script "apply:editorial"   "Apply editorial (articles, videos, galleries, pages)"
  run_db_script "apply:commerce"    "Apply commerce (products, sponsors)"
  run_db_script "apply:match-media" "Apply match media (FK match_id en videos/galleries)"
  run_db_script "apply:fans"        "Apply fans (memberships, community_events, newsletter)"

  run_db_script "seed"              "Seed base (seasons, competitions, teams, matches)"
  run_db_script "seed:squad"        "Seed squad (players, stats, staff)"
  run_db_script "seed:editorial"    "Seed editorial (articles, videos, galleries, pages)"
  run_db_script "seed:commerce"     "Seed commerce (products, sponsors)"
  run_db_script "seed:match-detail" "Seed match detail (events, lineups, media por partido)"
  run_db_script "seed:fans"         "Seed fans (memberships, community events)"
fi

# ---------------------------------------------------------------------------
# Resumen instalación base
# ---------------------------------------------------------------------------
END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))

step "Resumen instalación"
ok "Instalación base completada en ${ELAPSED}s."

# ---------------------------------------------------------------------------
# Modo --full → dev en background + secciones 6, 7, 8 del README
# ---------------------------------------------------------------------------
if [[ "$RUN_FULL" -eq 1 ]]; then

  # -------------------------------------------------------------------------
  # 5.6 — Dev server en background
  # -------------------------------------------------------------------------
  step "5.6  Arrancando dev server en background"
  DEV_LOG="$SCRIPT_DIR/.install-dev.log"
  : > "$DEV_LOG"
  substep "Lanzando 'pnpm dev' en background"
  nohup pnpm dev >"$DEV_LOG" 2>&1 &
  DEV_PID=$!
  disown "$DEV_PID" 2>/dev/null || true
  detail "PID del dev server: ${DEV_PID}"
  detail "Logs:               tail -f ${DEV_LOG}"

  substep "Esperando a que http://localhost:3000 responda (timeout 120s)"
  if ! command -v curl >/dev/null 2>&1; then
    warn "curl no disponible; salto el health-check del dev server."
    sleep 10
  else
    DEV_READY=0
    for i in $(seq 1 120); do
      if curl -fsS -o /dev/null http://localhost:3000 2>/dev/null; then
        DEV_READY=1
        ok "Dev server listo tras ${i}s."
        break
      fi
      sleep 1
    done
    if [[ "$DEV_READY" -eq 0 ]]; then
      warn "Dev server no respondió en 120s; continuando con el pipeline igualmente."
      detail "Revisa los logs: tail -n 100 ${DEV_LOG}"
    fi
  fi

  PIPELINE_FAILED=0

  # -------------------------------------------------------------------------
  # 6 — Calidad: lint + typecheck + tests
  # -------------------------------------------------------------------------
  step "6  Calidad: lint + typecheck + tests"

  substep "pnpm -r lint"
  if pnpm -r lint; then
    ok "Lint OK."
  else
    warn "Lint con errores."
    PIPELINE_FAILED=1
  fi

  substep "pnpm -r typecheck"
  if pnpm -r typecheck; then
    ok "Typecheck OK."
  else
    warn "Typecheck con errores."
    PIPELINE_FAILED=1
  fi

  substep "pnpm -r test"
  if pnpm -r test; then
    ok "Tests unitarios + integración OK."
  else
    warn "Tests con fallos."
    PIPELINE_FAILED=1
  fi

  detail "E2E (Playwright) y Lighthouse no se corren en --full por ser pesados."
  detail "  pnpm --filter @platzi-fc/web e2e:install && pnpm --filter @platzi-fc/web e2e"
  detail "  pnpm --filter @platzi-fc/web lighthouse"

  # -------------------------------------------------------------------------
  # 7 — Utilidades Drizzle (informativo)
  # -------------------------------------------------------------------------
  step "7  Utilidades Drizzle"
  warn "No se ejecutan automáticamente: son destructivas (db:push) o interactivas (db:studio)."
  detail "Comandos disponibles cuando los necesites:"
  detail "  pnpm --filter @platzi-fc/db db:generate    # genera migración diff desde src/schema"
  detail "  pnpm --filter @platzi-fc/db db:push        # aplica schema a la DB (sólo dev)"
  detail "  pnpm --filter @platzi-fc/db db:introspect  # regenera baseline desde la DB real"
  detail "  pnpm --filter @platzi-fc/db db:studio      # abre Drizzle Studio en el navegador"

  # -------------------------------------------------------------------------
  # 8 — Build de producción
  # -------------------------------------------------------------------------
  step "8  Build de producción"
  substep "pnpm --filter @platzi-fc/web build"
  if pnpm --filter @platzi-fc/web build; then
    ok "Build de producción OK."
  else
    warn "Build de producción falló."
    PIPELINE_FAILED=1
  fi
  detail "Para servir el build: pnpm --filter @platzi-fc/web start"
  detail "(usa otro puerto: el dev server ocupa el 3000)."

  # -------------------------------------------------------------------------
  # Resumen final del pipeline
  # -------------------------------------------------------------------------
  END_TIME=$(date +%s)
  ELAPSED=$((END_TIME - START_TIME))
  step "Pipeline --full finalizado"
  if [[ "$PIPELINE_FAILED" -eq 1 ]]; then
    warn "Pipeline terminó con avisos en ${ELAPSED}s. Revisa los pasos marcados con [WARN]."
  else
    ok "Pipeline completo en ${ELAPSED}s sin fallos."
  fi
  ok "Dev server sigue corriendo en http://localhost:3000 (PID ${DEV_PID})."
  detail "Para detenerlo:  kill ${DEV_PID}"
  detail "Para ver logs:   tail -f ${DEV_LOG}"

# ---------------------------------------------------------------------------
# 5.6 — Dev server en foreground (modo clásico)
# ---------------------------------------------------------------------------
elif [[ "$RUN_DEV" -eq 1 ]]; then
  detail "Comandos útiles a partir de aquí:"
  detail "  pnpm dev                                    → arranca el dev server"
  detail "  pnpm -r lint && pnpm -r typecheck && pnpm -r test  → calidad"
  detail "  pnpm --filter @platzi-fc/web e2e            → E2E (instala chromium con e2e:install)"
  detail "  pnpm --filter @platzi-fc/db db:studio       → Drizzle Studio"

  step "5.6  Arrancando el dev server"
  if confirm "¿Arrancar 'pnpm dev' ahora? (Ctrl+C para parar)"; then
    detail "Abre http://localhost:3000 cuando aparezca el log de Next.js."
    exec pnpm dev
  else
    warn "Saltando dev server. Lánzalo más tarde con: pnpm dev"
  fi
else
  detail "Comandos útiles a partir de aquí:"
  detail "  pnpm dev                                    → arranca el dev server"
  detail "  pnpm -r lint && pnpm -r typecheck && pnpm -r test  → calidad"
  detail "  pnpm --filter @platzi-fc/web e2e            → E2E (instala chromium con e2e:install)"
  detail "  pnpm --filter @platzi-fc/db db:studio       → Drizzle Studio"
  detail "(--no-dev / --yes activos: no se arranca el dev server)."
fi
