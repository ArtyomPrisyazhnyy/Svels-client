'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GuestOtpAuthForm } from '../components/GuestOtpAuthForm';
import { getPostAuthPath } from '@/shared/routing/get-post-auth-path';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { useAuthStore } from '@/store/auth.store';
import '../styles/auth.scss';

interface RestaurantGuestAuthPageProps {
  restaurantId: string;
  restaurantName: string;
  redirectFrom?: string;
}

export function RestaurantGuestAuthPage({
  restaurantId,
  restaurantName,
  redirectFrom,
}: RestaurantGuestAuthPageProps) {
  const router = useRouter();
  const paths = useRestaurantGuestPaths(restaurantId);

  function handleSuccess() {
    const user = useAuthStore.getState().user;
    router.replace(
      getPostAuthPath(user?.role ?? 'user', redirectFrom, restaurantId, paths.tenantMode),
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href={paths.home} className="auth-card__back">
          ← {restaurantName}
        </Link>
        <h1 className="auth-card__title">Вход в {restaurantName}</h1>
        <p className="auth-card__subtitle">
          Код придёт в Telegram или по SMS
        </p>

        <GuestOtpAuthForm restaurantId={restaurantId} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
