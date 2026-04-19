import { cn } from '@/lib/utils/cn';
import type { StaffWithTeam } from '@/lib/db/staff';

export interface StaffCardProps {
  member: StaffWithTeam;
  className?: string;
}

export function StaffCard({ member, className }: StaffCardProps) {
  const initials = getInitials(member.nombre);
  return (
    <article
      className={cn(
        'rounded-card border-brand-100 flex items-center gap-4 border bg-white p-4',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="bg-brand-100 text-brand-800 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold"
      >
        {initials}
      </div>
      <div className="min-w-0">
        <h3 className="text-brand-950 text-base font-semibold">{member.nombre}</h3>
        <p className="text-brand-700 truncate text-sm">{member.rol}</p>
      </div>
    </article>
  );
}

function getInitials(fullName: string): string {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
