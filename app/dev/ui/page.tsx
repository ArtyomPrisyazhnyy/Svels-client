import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { DevUiPlayground } from '@/shared/ui/dev/DevUiPlayground';

export const metadata: Metadata = {
  title: 'UI playground',
  robots: {
    index: false,
    follow: false,
  },
};

interface DevUiPageProps {
  searchParams: Promise<{ theme?: string }>;
}

export default async function DevUiPage({ searchParams }: DevUiPageProps) {
  if (process.env.NEXT_PUBLIC_ENABLE_UI_PLAYGROUND !== '1') {
    notFound();
  }

  const { theme = 'classic' } = await searchParams;

  return <DevUiPlayground theme={theme} />;
}
