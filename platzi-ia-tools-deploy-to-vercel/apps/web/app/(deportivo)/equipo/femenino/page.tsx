import type { Metadata } from 'next';
import { PageStub } from '@/components/layout/page-stub';

export const metadata: Metadata = {
  title: 'Femenino',
  description: 'Equipo femenino de Platzi FC.',
};

export default function Page() {
  return <PageStub title="Femenino" description="Equipo femenino de Platzi FC." />;
}
