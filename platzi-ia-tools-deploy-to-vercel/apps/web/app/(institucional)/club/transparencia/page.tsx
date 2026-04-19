import type { Metadata } from 'next';
import { PageStub } from '@/components/layout/page-stub';

export const metadata: Metadata = {
  title: 'Transparencia',
  description: 'Información de transparencia.',
};

export default function Page() {
  return <PageStub title="Transparencia" description="Información de transparencia." />;
}
