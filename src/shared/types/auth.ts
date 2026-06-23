export type AuthProvider = 'local' | 'google';

export type UserRole = 'user' | 'restaurant_admin' | 'super_admin';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  authProvider: AuthProvider;
  restaurantId?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
