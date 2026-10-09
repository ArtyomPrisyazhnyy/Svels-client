export type { AuthResponse, AuthUser } from '../../src/shared/types/auth';
import type { AuthResponse, AuthUser, UserRole } from '../../src/shared/types/auth';
import type { CreateMenuItemPayload, MenuCategory } from '../../src/shared/types/menu';
import type {
  CreatePreOrderPayload,
  PreOrderResponse,
} from '../../src/shared/types/pre-order';
import type {
  RestaurantOrderSettings,
  UpdateRestaurantOrderSettingsPayload,
} from '../../src/shared/types/order-settings';
import { getApiUrl } from './env';

export interface PublicRestaurant {
  id: string;
  name: string;
  description: string | null;
  address: string;
  status: string;
  logoUrl?: string | null;
}

export interface PendingRegistration {
  id: string;
  name: string;
  unp: string;
  status: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function api<T>(
  method: string,
  pathname: string,
  options: {
    body?: unknown;
    token?: string;
    retries?: number;
  } = {},
): Promise<T> {
  const retries = options.retries ?? 5;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }
    if (options.token) {
      headers.Authorization = `Bearer ${options.token}`;
    }

    const response = await fetch(`${getApiUrl()}${pathname}`, {
      method,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });

    const text = await response.text();
    const data = text ? (JSON.parse(text) as unknown) : null;

    if (response.status === 429 && attempt < retries) {
      await sleep(1500 * (attempt + 1));
      continue;
    }

    if (!response.ok) {
      const message =
        data && typeof data === 'object' && 'message' in data
          ? String((data as { message: unknown }).message)
          : text || response.statusText;
      lastError = new Error(`${method} ${pathname} → ${response.status}: ${message}`);
      throw lastError;
    }

    return data as T;
  }

  throw lastError ?? new Error(`${method} ${pathname} failed`);
}

export const apiClient = {
  login(email: string, password: string) {
    return api<AuthResponse>('POST', '/auth/login', { body: { email, password } });
  },

  register(payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return api<AuthResponse>('POST', '/auth/register', { body: payload });
  },

  registerRestaurant(
    token: string,
    payload: {
      name: string;
      unp: string;
      description?: string;
      isChain: boolean;
      locations: Array<{ label?: string; city?: string; address: string }>;
    },
  ) {
    return api<PendingRegistration>('POST', '/restaurants/register', {
      token,
      body: payload,
    });
  },

  getPendingRegistrations(token: string) {
    return api<PendingRegistration[]>('GET', '/restaurants/admin/registrations/pending', {
      token,
    });
  },

  reviewRegistration(token: string, requestId: string, action: 'approve' | 'reject') {
    return api<PublicRestaurant | PendingRegistration>(
      'POST',
      '/restaurants/admin/registrations/review',
      {
        token,
        body: { requestId, action },
      },
    );
  },

  listRestaurants() {
    return api<PublicRestaurant[]>('GET', '/restaurants');
  },

  getRestaurant(id: string) {
    return api<PublicRestaurant>('GET', `/restaurants/${id}`);
  },

  sendGuestOtp(restaurantId: string, phone: string) {
    return api<{ maskedPhone: string; channel: string }>(
      'POST',
      `/restaurants/${restaurantId}/auth/otp/send`,
      { body: { phone }, retries: 8 },
    );
  },

  getLastDevOtp(phone: string) {
    return api<{ phone: string; code: string; at: string }>(
      'GET',
      `/dev/last-otp?phone=${encodeURIComponent(phone)}`,
    );
  },

  verifyGuestOtp(restaurantId: string, phone: string, code: string) {
    return api<
      | { status: 'authenticated'; accessToken: string; user: AuthUser }
      | { status: 'registration_required'; registrationToken: string; maskedPhone: string }
    >('POST', `/restaurants/${restaurantId}/auth/otp/verify`, {
      body: { phone, code },
    });
  },

  registerGuestWithOtp(
    restaurantId: string,
    payload: { registrationToken: string; firstName: string; lastName: string },
  ) {
    return api<AuthResponse>('POST', `/restaurants/${restaurantId}/auth/otp/register`, {
      body: payload,
    });
  },

  async createGuest(restaurantId: string, firstName = 'E2E', lastName = 'Guest') {
    const phone = `+37529${String(Date.now()).slice(-7)}${Math.floor(Math.random() * 10)}`.slice(
      0,
      13,
    );
    await this.sendGuestOtp(restaurantId, phone);
    await sleep(200);
    const otp = await this.getLastDevOtp(phone);
    const verified = await this.verifyGuestOtp(restaurantId, phone, otp.code);
    if (verified.status === 'authenticated') {
      return { auth: verified as AuthResponse, phone };
    }
    const auth = await this.registerGuestWithOtp(restaurantId, {
      registrationToken: verified.registrationToken,
      firstName,
      lastName,
    });
    return { auth, phone };
  },

  getMenu(restaurantId: string) {
    return api<{
      categories: Array<{ id: string; name: string; items: Array<{ id: string; name: string }> }>;
    }>('GET', `/restaurants/${restaurantId}/menu`);
  },

  getBookingSettings(restaurantId: string) {
    return api<{ bookingEnabled: boolean; mode: string }>(
      'GET',
      `/restaurants/${restaurantId}/booking-settings`,
    );
  },

  async guestOtpLogin(restaurantId: string, phone: string): Promise<AuthResponse> {
    await this.sendGuestOtp(restaurantId, phone);
    await sleep(200);
    const otp = await this.getLastDevOtp(phone);
    const verified = await this.verifyGuestOtp(restaurantId, phone, otp.code);
    if (verified.status === 'authenticated') {
      return {
        accessToken: verified.accessToken,
        user: verified.user,
      };
    }
    return this.registerGuestWithOtp(restaurantId, {
      registrationToken: verified.registrationToken,
      firstName: 'E2E',
      lastName: 'Guest',
    });
  },

  createOrder(
    restaurantId: string,
    token: string,
    payload: CreatePreOrderPayload,
  ): Promise<PreOrderResponse> {
    return api<PreOrderResponse>('POST', `/restaurants/${restaurantId}/pre-orders`, {
      token,
      body: payload,
    });
  },

  setOrderSettings(
    restaurantId: string,
    token: string,
    payload: UpdateRestaurantOrderSettingsPayload,
  ): Promise<RestaurantOrderSettings> {
    return api<RestaurantOrderSettings>('PATCH', `/restaurants/${restaurantId}/order-settings`, {
      token,
      body: payload,
    });
  },

  createMenuCategory(
    restaurantId: string,
    token: string,
    name: string,
  ): Promise<MenuCategory> {
    return api<MenuCategory>('POST', `/restaurants/${restaurantId}/menu/categories`, {
      token,
      body: { name },
    });
  },

  reorderMenuCategories(restaurantId: string, token: string, ids: string[]): Promise<void> {
    return api<void>('PUT', `/restaurants/${restaurantId}/menu/categories/order`, {
      token,
      body: { ids },
    });
  },

  createMenuItem(
    restaurantId: string,
    token: string,
    payload: CreateMenuItemPayload,
  ): Promise<unknown> {
    return api('POST', `/restaurants/${restaurantId}/menu/items`, {
      token,
      body: payload,
    });
  },

  async createRestaurantStaffUser(
    restaurantId: string,
    adminToken: string,
    payload: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role: Extract<UserRole, 'restaurant_production' | 'restaurant_hall' | 'restaurant_manager'>;
    },
  ): Promise<AuthResponse> {
    await api<AuthUser>('POST', `/restaurants/${restaurantId}/staff`, {
      token: adminToken,
      body: payload,
    });
    return this.login(payload.email, payload.password);
  },

  async seedDefaultMenu(
    restaurantId: string,
    adminToken: string,
  ): Promise<{ categoryId: string; defaultMenuItemId: string; modifierMenuItemId: string }> {
    await this.setOrderSettings(restaurantId, adminToken, {
      fulfillmentDelivery: true,
      fulfillmentTakeaway: true,
      fulfillmentDineIn: false,
      paymentCash: true,
      paymentCardOnSite: false,
      paymentOnline: false,
    });

    const category = await this.createMenuCategory(restaurantId, adminToken, 'E2E Меню');
    const defaultItem = (await this.createMenuItem(restaurantId, adminToken, {
      categoryId: category.id,
      name: 'E2E Блюдо 9.90',
      price: 9.9,
      description: 'Playwright seed item',
      imageUrl: 'https://example.com/e2e-item.jpg',
    })) as { id: string };

    const modifierItem = (await this.createMenuItem(restaurantId, adminToken, {
      categoryId: category.id,
      name: 'E2E С модификатором',
      price: 12.5,
      description: 'Playwright seed item with modifiers',
      imageUrl: 'https://example.com/e2e-item-mod.jpg',
      modifierGroups: [
        {
          name: 'Добавка',
          selectionType: 'single',
          required: false,
          options: [{ name: 'Сыр', priceDelta: 1.5 }],
        },
      ],
    })) as { id: string };

    return {
      categoryId: category.id,
      defaultMenuItemId: defaultItem.id,
      modifierMenuItemId: modifierItem.id,
    };
  },
};
