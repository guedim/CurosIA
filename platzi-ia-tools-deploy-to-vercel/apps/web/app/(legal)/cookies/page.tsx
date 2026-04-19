import type { Metadata } from 'next';
import { PageStub } from '@/components/layout/page-stub';

export const metadata: Metadata = {
  title: 'Política de cookies',
  description: 'Política de cookies.',
};

export default function Page() {
  return <PageStub title="Política de cookies" description="Política de cookies." />;
}
