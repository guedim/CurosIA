import type { Metadata } from 'next';
import {
  getDb,
  sql,
  seasons,
  competitions,
  teams,
  matches,
  matchEvents,
  players,
  staff,
  playerSeasonStats,
  standings,
  type PgTable,
} from '@platzi-fc/db';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'DB ping',
  description: 'Diagnóstico de conexión a la base de datos.',
  robots: { index: false, follow: false },
};

// Forzar SSR: nunca cachear esta ruta diagnóstica.
export const dynamic = 'force-dynamic';

const TABLES: { name: string; table: PgTable }[] = [
  { name: 'seasons', table: seasons },
  { name: 'competitions', table: competitions },
  { name: 'teams', table: teams },
  { name: 'matches', table: matches },
  { name: 'match_events', table: matchEvents },
  { name: 'players', table: players },
  { name: 'staff', table: staff },
  { name: 'player_season_stats', table: playerSeasonStats },
  { name: 'standings', table: standings },
];

type TableStatus =
  | { name: string; ok: true; count: number }
  | { name: string; ok: false; error: string };

async function probeDb(): Promise<{
  connection: { ok: boolean; db?: string; usr?: string; error?: string };
  tables: TableStatus[];
  elapsedMs: number;
}> {
  const start = performance.now();
  const db = getDb();

  const connection = await db
    .execute(sql`SELECT current_database() AS db, current_user AS usr, 1 AS ok`)
    .then((rows) => {
      const row = rows[0] as { db: string; usr: string; ok: number } | undefined;
      return row
        ? { ok: row.ok === 1, db: row.db, usr: row.usr }
        : { ok: false, error: 'Sin filas' };
    })
    .catch((e: unknown) => ({
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    }));

  const tables: TableStatus[] = await Promise.all(
    TABLES.map(async ({ name, table }): Promise<TableStatus> => {
      try {
        const rows = await db.select({ count: sql<number>`count(*)::int` }).from(table);
        const count = rows[0]?.count ?? 0;
        return { name, ok: true, count };
      } catch (e) {
        return { name, ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    }),
  );

  return { connection, tables, elapsedMs: Math.round(performance.now() - start) };
}

export default async function DbPingPage() {
  let result: Awaited<ReturnType<typeof probeDb>> | null = null;
  let fatalError: string | null = null;
  try {
    result = await probeDb();
  } catch (e) {
    fatalError = e instanceof Error ? e.message : String(e);
  }

  return (
    <div className="space-y-6">
      <header className="border-brand-100 border-b pb-4">
        <h1 className="text-brand-950 text-3xl font-bold">DB Ping</h1>
        <p className="text-brand-700 mt-2">
          Diagnóstico de conectividad con la base de datos Supabase.
        </p>
      </header>

      {fatalError ? (
        <Card>
          <CardHeader>
            <CardTitle>
              <Badge variant="danger">Error fatal</Badge> No se pudo conectar
            </CardTitle>
          </CardHeader>
          <CardBody>
            <pre className="whitespace-pre-wrap break-all rounded bg-red-50 p-3 text-xs text-red-900">
              {fatalError}
            </pre>
            <p className="text-brand-700 mt-3 text-sm">
              Revisa <code>apps/web/.env.local</code> y confirma que <code>DATABASE_URL</code> está
              url-encodeado correctamente.
            </p>
          </CardBody>
        </Card>
      ) : result ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>
                {result.connection.ok ? (
                  <Badge variant="success">OK</Badge>
                ) : (
                  <Badge variant="danger">FAIL</Badge>
                )}{' '}
                Conexión · {result.elapsedMs} ms
              </CardTitle>
            </CardHeader>
            <CardBody className="text-brand-800 text-sm">
              {result.connection.ok ? (
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <dt className="font-medium">Database</dt>
                  <dd>
                    <code>{result.connection.db}</code>
                  </dd>
                  <dt className="font-medium">User</dt>
                  <dd>
                    <code>{result.connection.usr}</code>
                  </dd>
                </dl>
              ) : (
                <pre className="whitespace-pre-wrap break-all text-xs text-red-900">
                  {result.connection.error}
                </pre>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tablas</CardTitle>
            </CardHeader>
            <CardBody>
              <table className="w-full text-sm">
                <thead className="text-brand-600 text-left text-xs uppercase tracking-wide">
                  <tr>
                    <th className="py-2">Tabla</th>
                    <th>Status</th>
                    <th className="text-right">Filas</th>
                  </tr>
                </thead>
                <tbody className="divide-brand-100 divide-y">
                  {result.tables.map((t) => (
                    <tr key={t.name}>
                      <td className="text-brand-900 py-2 font-mono">{t.name}</td>
                      <td>
                        {t.ok ? (
                          <Badge variant="success">OK</Badge>
                        ) : (
                          <Badge variant="danger" title={t.error}>
                            ERR
                          </Badge>
                        )}
                      </td>
                      <td className="text-right font-mono">
                        {t.ok ? t.count : <span className="text-red-700">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </>
      ) : null}
    </div>
  );
}
