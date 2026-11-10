import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AdminStylingVariants } from '@/features/restaurant-admin/styling/AdminStylingVariants';
import {
  resolvePlaygroundLayout,
  resolvePlaygroundTheme,
} from '@/features/restaurant-admin/styling/styling-model';

export const metadata: Metadata = {
  title: 'Варианты стилизации',
  robots: {
    index: false,
    follow: false,
  },
};

interface AdminStylingVariantsPageProps {
  searchParams: Promise<{ theme?: string; variant?: string }>;
}

export default async function AdminStylingVariantsPage({ searchParams }: AdminStylingVariantsPageProps) {
  if (process.env.NEXT_PUBLIC_ENABLE_UI_PLAYGROUND !== '1') {
    notFound();
  }

  const params = await searchParams;

  return (
    <AdminStylingVariants
      initialLayout={resolvePlaygroundLayout(params.variant)}
      initialTheme={resolvePlaygroundTheme(params.theme)}
    />
  );
}
