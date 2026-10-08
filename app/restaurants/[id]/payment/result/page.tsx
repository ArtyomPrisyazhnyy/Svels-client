import { PaymentResultPage } from '@/features/restaurants/components/PaymentResultPage';

interface PaymentResultRouteProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    preOrderId?: string;
    paymentId?: string;
    status?: string;
  }>;
}

export default async function PaymentResultRoute({
  params,
  searchParams,
}: PaymentResultRouteProps) {
  const { id } = await params;
  const query = await searchParams;

  return (
    <PaymentResultPage
      restaurantId={id}
      preOrderId={query.preOrderId}
      paymentId={query.paymentId}
      returnStatus={query.status}
    />
  );
}
