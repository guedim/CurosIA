import type { Metadata } from 'next';
import { PageStub } from '@/components/layout/page-stub';

export const metadata: Metadata = {
  title: 'Términos y condiciones',
  description: 'Términos legales.',
};

export default function Page() {
  return <PageStub title="Términos y condiciones" description="Términos legales." />;
}
