import type { Metadata } from 'next';
import { PageStub } from '@/components/layout/page-stub';

export const metadata: Metadata = {
  title: 'Cantera',
  description: 'Formación y equipos de cantera.',
};

export default function Page() {
  return <PageStub title="Cantera" description="Formación y equipos de cantera." />;
}
