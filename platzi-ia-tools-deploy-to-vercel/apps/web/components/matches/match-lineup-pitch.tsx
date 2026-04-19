import { cn } from '@/lib/utils/cn';
import type { AlineacionEntry } from '@/types';

/**
 * Dibuja una alineación sobre una representación simplificada del campo.
 * Agrupa titulares por `posicion` en líneas (portero → defensas → medios →
 * delanteros). Los suplentes se listan aparte.
 */
export function MatchLineupPitch({
  alineacion,
  team,
  side,
}: {
  alineacion: AlineacionEntry[];
  team: string;
  side: 'local' | 'visita';
}) {
  const titulares = alineacion.filter((p) => p.titular);
  const suplentes = alineacion.filter((p) => !p.titular);

  type LineKey = 'portero' | 'defensa' | 'mediocampista' | 'delantero';
  const lines: Record<LineKey, AlineacionEntry[]> = {
    portero: titulares.filter((p) => p.posicion === 'portero'),
    defensa: titulares.filter((p) => p.posicion === 'defensa'),
    mediocampista: titulares.filter((p) => p.posicion === 'mediocampista'),
    delantero: titulares.filter((p) => p.posicion === 'delantero'),
  };

  const lineOrder: LineKey[] =
    side === 'local'
      ? ['portero', 'defensa', 'mediocampista', 'delantero']
      : ['delantero', 'mediocampista', 'defensa', 'portero'];

  const formacion = [lines.defensa.length, lines.mediocampista.length, lines.delantero.length]
    .filter((n) => n > 0)
    .join('-');

  if (!titulares.length) {
    return (
      <section aria-label={`Alineación ${team}`} className="space-y-3">
        <h3 className="text-brand-950 text-base font-semibold">{team}</h3>
        <p className="rounded-card border-brand-200 bg-brand-50 text-brand-700 border border-dashed p-4 text-sm">
          Alineación no publicada aún.
        </p>
      </section>
    );
  }

  return (
    <section aria-label={`Alineación ${team}`} className="space-y-3">
      <header className="flex items-baseline justify-between gap-3">
        <h3 className="text-brand-950 text-base font-semibold">{team}</h3>
        {formacion ? <span className="text-brand-600 font-mono text-xs">{formacion}</span> : null}
      </header>

      <div
        className={cn(
          'rounded-card relative overflow-hidden border p-4',
          'border-emerald-700/30 bg-gradient-to-b from-emerald-800 to-emerald-900',
        )}
      >
        <PitchLines />
        <div className="relative flex flex-col gap-4">
          {lineOrder.map((pos) => {
            const row = lines[pos];
            if (!row.length) return null;
            return (
              <ul
                key={pos}
                className="flex justify-around gap-2"
                aria-label={posicionLabel(pos)}
                role="list"
              >
                {row.map((p) => (
                  <PlayerChip key={chipKey(p)} player={p} />
                ))}
              </ul>
            );
          })}
        </div>
      </div>

      {suplentes.length ? (
        <div className="space-y-2">
          <h4 className="text-brand-700 text-xs font-semibold uppercase tracking-wide">
            Suplentes
          </h4>
          <ul className="grid gap-2 sm:grid-cols-2" role="list">
            {suplentes.map((p) => (
              <li
                key={chipKey(p)}
                className="border-brand-100 bg-brand-50 text-brand-900 flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
              >
                {p.dorsal !== undefined ? (
                  <span className="text-brand-600 font-mono text-xs tabular-nums">{p.dorsal}</span>
                ) : null}
                <span className="font-medium">{p.nombre ?? 'Jugador'}</span>
                {p.minutoEntrada !== undefined ? (
                  <span className="text-brand-500 ml-auto text-xs">↑ {p.minutoEntrada}&apos;</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function PlayerChip({ player }: { player: AlineacionEntry }) {
  const dorsal = player.dorsal ?? '?';
  return (
    <li className="flex min-w-[5rem] flex-col items-center gap-1 text-center text-white">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 font-mono text-sm font-bold backdrop-blur-sm"
        aria-hidden="true"
      >
        {dorsal}
      </span>
      <span className="max-w-[7rem] truncate text-xs font-medium">
        {player.nombre ?? `Dorsal ${dorsal}`}
      </span>
      {player.minutoSalida !== undefined ? (
        <span className="text-[10px] text-white/60">↓ {player.minutoSalida}&apos;</span>
      ) : null}
    </li>
  );
}

function PitchLines() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 140"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-25"
    >
      <rect x="2" y="2" width="96" height="136" fill="none" stroke="white" strokeWidth="0.5" />
      <line x1="2" y1="70" x2="98" y2="70" stroke="white" strokeWidth="0.4" />
      <circle cx="50" cy="70" r="10" fill="none" stroke="white" strokeWidth="0.4" />
      <rect x="30" y="2" width="40" height="16" fill="none" stroke="white" strokeWidth="0.4" />
      <rect x="30" y="122" width="40" height="16" fill="none" stroke="white" strokeWidth="0.4" />
    </svg>
  );
}

function posicionLabel(pos: 'portero' | 'defensa' | 'mediocampista' | 'delantero'): string {
  switch (pos) {
    case 'portero':
      return 'Portero';
    case 'defensa':
      return 'Defensas';
    case 'mediocampista':
      return 'Centrocampistas';
    case 'delantero':
      return 'Delanteros';
  }
}

function chipKey(p: AlineacionEntry): string {
  return `${p.playerId}:${p.dorsal ?? ''}:${p.nombre ?? ''}`;
}
