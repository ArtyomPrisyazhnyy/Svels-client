import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CartVariantsPreview } from '@/features/restaurants/components/cart-variants/CartVariantsPreview';
import { isCartVariantId } from '@/features/restaurants/components/cart-variants/cart-variant-data';
import {
  RESTAURANT_COLOR_THEME_OPTIONS,
  type RestaurantColorTheme,
} from '@/shared/types/restaurant-styling';

export const metadata: Metadata = {
  title: 'Варианты корзины',
  robots: {
    index: false,
    follow: false,
  },
};

interface CartVariantsPageProps {
  searchParams: Promise<{ theme?: string; variant?: string }>;
}

function resolveTheme(theme: string | undefined): RestaurantColorTheme {
  if (theme && RESTAURANT_COLOR_THEME_OPTIONS.some((option) => option.value === theme)) {
    return theme as RestaurantColorTheme;
  }
  return 'classic';
}

export default async function CartVariantsPage({ searchParams }: CartVariantsPageProps) {
  if (process.env.NEXT_PUBLIC_ENABLE_UI_PLAYGROUND !== '1') {
    notFound();
  }

  const params = await searchParams;
  const variant = params.variant && isCartVariantId(params.variant) ? params.variant : 'summary';

  return <CartVariantsPreview initialTheme={resolveTheme(params.theme)} initialVariant={variant} />;
}
