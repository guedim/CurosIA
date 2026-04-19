import type { Metadata } from 'next';
import { PageStub } from '@/components/layout/page-stub';

export const metadata: Metadata = {
  title: 'Academy',
  description: 'Academia del club.',
};

export default function Page() {
  return <PageStub title="Academy" description="Academia del club." />;
}
