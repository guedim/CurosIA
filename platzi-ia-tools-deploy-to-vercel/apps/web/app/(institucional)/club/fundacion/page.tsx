import type { Metadata } from 'next';
import { PageStub } from '@/components/layout/page-stub';

export const metadata: Metadata = {
  title: 'Fundación',
  description: 'Fundación del club.',
};

export default function Page() {
  return <PageStub title="Fundación" description="Fundación del club." />;
}
