import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { MatchList } from '@/components/matches/match-list';
import { getPlayerBySlug, getPlayerTotalStats } from '@/lib/db/players';
import { getUltimosResultadosClub } from '@/lib/db/matches';
import { buildPlayerJsonLd } from '@/lib/seo/player-jsonld';
import { formatDate } from '@/lib/utils/date';
import type { PlayerEstado, PlayerPosicion } from '@/types';

type Params = { playerSlug: string };

export const revalidate = 3600;

const POSICION_LABEL: Record<PlayerPosicion, string> = {
  portero: 'Portero',
  defensa: 'Defensa',
  mediocampista: 'Mediocampista',
  delantero: 'Delantero',
};

const ESTADO_BADGE: Record<
  PlayerEstado,
  { label: string; variant: 'success' | 'warning' | 'info' | 'default' }
> = {
  activo: { label: 'Activo', variant: 'success' },
  lesionado: { label: 'Lesionado', variant: 'warning' },
  cedido: { label: 'Cedido', variant: 'info' },
  retirado: { label: 'Retirado', variant: 'default' },
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { playerSlug } = await params;
  const player = await getPlayerBySlug(playerSlug);
  if (!player) return { title: 'Jugador no encontrado' };
  const title = `${player.nombre} ${player.apellido}`;
  const description = `${POSICION_LABEL[player.posicion]}${player.dorsal ? ` · Dorsal ${player.dorsal}` : ''} de ${player.team?.nombre ?? 'Platzi FC'}.`;
  return {
    title,
    description,
    openGraph: { title, description, type: 'profile' },
  };
}

function calcularEdad(fechaNacimiento: string): number {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad;
}

export default async function PlayerProfilePage({ params }: { params: Promise<Params> }) {
  const { playerSlug } = await params;
  const player = await getPlayerBySlug(playerSlug);
  if (!player) notFound();

  const [stats, recentMatches] = await Promise.all([
    getPlayerTotalStats(player.id),
    getUltimosResultadosClub(3),
  ]);

  const jsonLd = buildPlayerJsonLd(player);
  const estadoCfg = ESTADO_BADGE[player.estado];
  const fullName = `${player.nombre} ${player.apellido}`;

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="text-brand-600 text-sm">
        <ol className="flex gap-1">
          <li>
            <Link href="/equipo" className="hover:underline">
              Plantilla
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-brand-800 truncate">{fullName}</li>
        </ol>
      </nav>

      <section
        aria-label={`Perfil de ${fullName}`}
        className="rounded-card bg-brand-900 px-6 py-8 text-white sm:px-10 sm:py-10"
      >
        <div className="flex flex-wrap items-start gap-6">
          <div
            aria-hidden="true"
            className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-white/10 text-4xl font-bold"
          >
            {player.dorsal ?? '–'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={estadoCfg.variant}>{estadoCfg.label}</Badge>
              <span className="text-brand-100 text-sm">{POSICION_LABEL[player.posicion]}</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
              {player.nombre} <span className="font-black">{player.apellido}</span>
            </h1>
            <p className="text-brand-100 mt-2 text-sm">
              {player.team?.nombre}
              {player.nacionalidad ? ` · ${player.nacionalidad}` : ''}
              {player.fechaNacimiento ? ` · ${calcularEdad(player.fechaNacimiento)} años` : ''}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-[1fr_280px]">
        <section aria-label="Estadísticas del jugador" className="space-y-4">
          <h2 className="text-brand-950 text-xl font-semibold">Estadísticas por temporada</h2>
          {stats.length ? (
            <div className="rounded-card border-brand-100 overflow-hidden border bg-white">
              <table className="w-full text-sm">
                <thead className="bg-brand-50 text-brand-700 text-xs uppercase tracking-wide">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left">
                      Temporada
                    </th>
                    <th scope="col" className="px-3 py-2 text-right" title="Partidos jugados">
                      PJ
                    </th>
                    <th scope="col" className="px-3 py-2 text-right" title="Minutos">
                      Min
                    </th>
                    <th scope="col" className="px-3 py-2 text-right">
                      Goles
                    </th>
                    <th scope="col" className="px-3 py-2 text-right">
                      Asist.
                    </th>
                    <th scope="col" className="px-3 py-2 text-right">
                      🟨
                    </th>
                    <th scope="col" className="px-3 py-2 text-right">
                      🟥
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-brand-100 divide-y">
                  {stats.map((s) => (
                    <tr key={s.id}>
                      <td className="text-brand-900 px-3 py-2.5 font-medium">{s.season.nombre}</td>
                      <td className="px-3 py-2.5 text-right font-mono">{s.partidosJugados}</td>
                      <td className="px-3 py-2.5 text-right font-mono">{s.minutos}</td>
                      <td className="px-3 py-2.5 text-right font-mono">{s.goles}</td>
                      <td className="px-3 py-2.5 text-right font-mono">{s.asistencias}</td>
                      <td className="px-3 py-2.5 text-right font-mono">{s.amarillas}</td>
                      <td className="px-3 py-2.5 text-right font-mono">{s.rojas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-card border-brand-200 bg-brand-50 text-brand-700 border border-dashed p-4 text-sm">
              Sin estadísticas registradas todavía.
            </p>
          )}

          <div className="pt-4">
            <h2 className="text-brand-950 mb-3 text-xl font-semibold">
              Últimos partidos del equipo
            </h2>
            <MatchList
              matches={recentMatches}
              highlightTeamSlug={player.team?.slug ?? 'platzi-fc'}
            />
          </div>
        </section>

        <aside className="space-y-4" aria-label="Ficha técnica del jugador">
          <Card>
            <CardHeader>
              <CardTitle>Ficha técnica</CardTitle>
            </CardHeader>
            <CardBody className="text-brand-800 space-y-2 text-sm">
              {player.dorsal ? <InfoRow label="Dorsal" value={`${player.dorsal}`} /> : null}
              <InfoRow label="Posición" value={POSICION_LABEL[player.posicion]} />
              {player.fechaNacimiento ? (
                <InfoRow label="Nacimiento" value={formatDate(player.fechaNacimiento)} />
              ) : null}
              {player.nacionalidad ? <InfoRow label="País" value={player.nacionalidad} /> : null}
              {player.alturaCm ? <InfoRow label="Altura" value={`${player.alturaCm} cm`} /> : null}
              {player.pesoKg ? <InfoRow label="Peso" value={`${player.pesoKg} kg`} /> : null}
              {player.pieHabil ? (
                <InfoRow label="Pie hábil" value={player.pieHabil} className="capitalize" />
              ) : null}
            </CardBody>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="grid grid-cols-[100px_1fr] gap-2">
      <dt className="text-brand-600 font-medium">{label}</dt>
      <dd className={`text-brand-900 ${className ?? ''}`}>{value}</dd>
    </div>
  );
}
