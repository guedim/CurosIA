import type { Metadata } from 'next';
import { PageStub } from '@/components/layout/page-stub';

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description: 'Política de privacidad.',
};

export default function Page() {
  return <PageStub title="Política de privacidad" description="Política de privacidad." />;
}
