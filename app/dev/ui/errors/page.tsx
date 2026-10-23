import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { DevErrorStatesBoard } from '@/shared/ui/dev/DevErrorStatesBoard';

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

  return <DevErrorStatesBoard theme={theme} variant={resolvedVariant} />;
}
