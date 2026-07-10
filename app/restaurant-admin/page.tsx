import { redirect } from 'next/navigation';

export default function RestaurantAdminIndexPage() {
  redirect('/restaurant-admin/menu');
}
