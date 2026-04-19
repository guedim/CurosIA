import type { Metadata } from 'next';
import { PageStub } from '@/components/layout/page-stub';

export const metadata: Metadata = {
  title: 'Directiva',
  description: 'Junta directiva del club.',
};

export default function Page() {
  return <PageStub title="Directiva" description="Junta directiva del club." />;
}
