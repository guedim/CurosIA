import { Badge } from '@/components/ui/badge';
import type { MatchEstado } from '@/types';

const MAP: Record<
  MatchEstado,
  { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }
> = {
  programado: { label: 'Programado', variant: 'info' },
  en_vivo: { label: 'En vivo', variant: 'success' },
  finalizado: { label: 'Finalizado', variant: 'default' },
  suspendido: { label: 'Suspendido', variant: 'warning' },
  cancelado: { label: 'Cancelado', variant: 'danger' },
};

export function MatchStatusBadge({ estado }: { estado: MatchEstado }) {
  const cfg = MAP[estado];
  return (
    <Badge variant={cfg.variant} aria-label={`Estado del partido: ${cfg.label}`}>
      {estado === 'en_vivo' ? (
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-600"
        />
      ) : null}
      {cfg.label}
    </Badge>
  );
}
