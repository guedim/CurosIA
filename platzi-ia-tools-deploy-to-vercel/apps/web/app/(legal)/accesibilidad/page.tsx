import type { Metadata } from 'next';
import { PageStub } from '@/components/layout/page-stub';

export const metadata: Metadata = {
  title: 'Accesibilidad',
  description: 'Declaración de accesibilidad.',
};

export default function Page() {
  return <PageStub title="Accesibilidad" description="Declaración de accesibilidad." />;
}
