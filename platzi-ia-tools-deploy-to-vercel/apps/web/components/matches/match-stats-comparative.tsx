import { cn } from '@/lib/utils/cn';

type StatPair = { local: number; visita: number };

type MatchStatsShape = Partial<{
  posesion: StatPair;
  remates: StatPair;
  rematesAPuerta: StatPair;
  corners: StatPair;
  faltas: StatPair;
  fuerasDeJuego: StatPair;
  pases: StatPair;
  precisionPases: StatPair;
  amarillas: StatPair;
  rojas: StatPair;
}>;

const ROWS: { key: keyof MatchStatsShape; label: string; isPercent?: boolean }[] = [
  { key: 'posesion', label: 'Posesión', isPercent: true },
  { key: 'remates', label: 'Remates' },
  { key: 'rematesAPuerta', label: 'Remates a puerta' },
  { key: 'corners', label: 'Córners' },
  { key: 'faltas', label: 'Faltas' },
  { key: 'fuerasDeJuego', label: 'Fueras de juego' },
  { key: 'pases', label: 'Pases' },
  { key: 'precisionPases', label: 'Precisión de pases', isPercent: true },
  { key: 'amarillas', label: 'Tarjetas amarillas' },
  { key: 'rojas', label: 'Tarjetas rojas' },
];

function isStatPair(value: unknown): value is StatPair {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as StatPair).local === 'number' &&
    typeof (value as StatPair).visita === 'number'
  );
}

export function MatchStatsComparative({
  stats,
  homeTeam,
  awayTeam,
}: {
  stats: Record<string, unknown>;
  homeTeam: string;
  awayTeam: string;
}) {
  const rows = ROWS.map((r) => {
    const v = stats[r.key];
    return isStatPair(v) ? { ...r, value: v } : null;
  }).filter(Boolean) as ((typeof ROWS)[number] & { value: StatPair })[];

  if (!rows.length) {
    return (
      <p className="rounded-card border-brand-200 bg-brand-50 text-brand-700 border border-dashed p-4 text-sm">
        No hay estadísticas registradas para este partido.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <header className="text-brand-700 grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-sm font-medium">
        <span className="text-right">{homeTeam}</span>
        <span aria-hidden="true" className="text-brand-400 text-xs uppercase">
          vs
        </span>
        <span>{awayTeam}</span>
      </header>

      <dl className="space-y-4">
        {rows.map((row) => (
          <StatRow
            key={row.key as string}
            label={row.label}
            value={row.value}
            isPercent={row.isPercent}
          />
        ))}
      </dl>
    </div>
  );
}

function StatRow({
  label,
  value,
  isPercent,
}: {
  label: string;
  value: StatPair;
  isPercent?: boolean;
}) {
  const total = value.local + value.visita || 1;
  const localPct = (value.local / total) * 100;
  const visitaPct = (value.visita / total) * 100;
  const displayLocal = isPercent ? `${value.local}%` : `${value.local}`;
  const displayVisita = isPercent ? `${value.visita}%` : `${value.visita}`;
  return (
    <div>
      <div className="mb-1 grid grid-cols-[1fr_auto_1fr] items-baseline gap-3">
        <dd className="text-brand-950 text-right text-sm font-semibold tabular-nums">
          {displayLocal}
        </dd>
        <dt className="text-brand-600 text-center text-xs uppercase tracking-wide">{label}</dt>
        <dd className="text-brand-950 text-sm font-semibold tabular-nums">{displayVisita}</dd>
      </div>
      <div
        className="bg-brand-100 relative flex h-2 overflow-hidden rounded-full"
        role="img"
        aria-label={`${label}: ${displayLocal} local frente a ${displayVisita} visita`}
      >
        <span
          className={cn('bg-brand-700 h-full')}
          style={{ width: `${localPct}%` }}
          aria-hidden="true"
        />
        <span
          className={cn('bg-brand-400 h-full')}
          style={{ width: `${visitaPct}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
