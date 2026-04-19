import type { Metadata } from 'next';
import { listStaff } from '@/lib/db/staff';
import { StaffCard } from '@/components/team/staff-card';

export const metadata: Metadata = {
  title: 'Cuerpo técnico',
  description: 'Staff técnico, médico y de rendimiento de Platzi FC.',
};

export const revalidate = 3600;

export default async function StaffPage() {
  const members = await listStaff();

  return (
    <div className="space-y-6">
      <header className="border-brand-100 border-b pb-4">
        <h1 className="text-brand-950 text-3xl font-bold">Cuerpo técnico</h1>
        <p className="text-brand-700 mt-2">
          {members.length} miembros del staff técnico, médico y de rendimiento del club.
        </p>
      </header>

      {members.length ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {members.map((m) => (
            <li key={m.id}>
              <StaffCard member={m} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-card border-brand-200 bg-brand-50 text-brand-700 border border-dashed p-6 text-center text-sm">
          No hay staff registrado.
        </p>
      )}
    </div>
  );
}
