import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { DevErrorPlayground } from '@/shared/ui/dev/DevErrorPlayground';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Error states',
  robots: {
    index: false,
    follow: false,
  },
};

interface DevErrorStatesPageProps {
  searchParams: Promise<{ theme?: string; variant?: string }>;
}

export default async function DevErrorStatesPage({ searchParams }: DevErrorStatesPageProps) {
  if (process.env.NEXT_PUBLIC_ENABLE_UI_PLAYGROUND !== '1') {
    notFound();
  }

  const { theme = 'classic', variant = 'network' } = await searchParams;
  const resolvedVariant = variant === 'server' ? 'server' : 'network';

  return <DevErrorPlayground theme={theme} variant={resolvedVariant} />;
}
