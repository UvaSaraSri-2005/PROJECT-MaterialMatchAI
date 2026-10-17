
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

export type Industry = {
  id: string;
  industryName: string;
  industryType?: string;
  location?: string;
  contactName?: string;
  email?: string;
  phone?: string;
};

export type Material = {
  id: string;
  industryId: string;
  materialName: string;
  category: string;
  quantity: number;
  unit: string;
  location?: string;
  latitude?: number | null;
  longitude?: number | null;
  moisture?: number | null;
  description?: string;
  pricePerUnit?: number | null;
};

export type Requirement = {
  id: string;
  industryId: string;
  materialName: string;
  category: string;
  quantity: number;
  unit: string;
  location?: string;
  latitude?: number | null;
  longitude?: number | null;
  maxMoisture?: number | null;
  description?: string;
};

export type Exchange = {
  id: string;
  materialId: string;
  supplierIndustryId: string;
  seekerIndustryId: string;
  requestedQuantity: number;
  unit: string;
  agreedPrice: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  message?: string;
  createdAt?: string;
};

export type RegisterRequest = {
  industryName: string;
  industryType: string;
  location: string;
  contactName: string;
  email: string;
  password: string;
  phone?: string;
};

export type AuthResponse = {
  token: string;
  userId: string;
  industryId: string;
  email: string;
  industryName: string;
};

type ApiError = {
  error?: string;
  message?: string;
};

const configuredUrl =
  Constants.expoConfig?.extra?.apiBaseUrl ??
  process.env.EXPO_PUBLIC_API_BASE_URL;

export const API_BASE_URL =
  configuredUrl || 'http://192.168.1.237:8080';

console.log('API BASE URL:', API_BASE_URL);

const TOKEN_KEY = 'materialmatch_jwt';
const USER_KEY = 'materialmatch_user';

export async function saveAuth(auth: AuthResponse) {
  await SecureStore.setItemAsync(TOKEN_KEY, auth.token);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify({
    userId: auth.userId,
    industryId: auth.industryId,
    email: auth.email,
    industryName: auth.industryName,
  }));
}

export async function getSavedUser(): Promise<
  Omit<AuthResponse, 'token'> | null
> {
  const value = await SecureStore.getItemAsync(USER_KEY);
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function logout() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
      signal: controller.signal,
    });

    const body = await response.json().catch(() => null) as
      | T
      | ApiError
      | null;

    if (!response.ok) {
      const error = body as ApiError | null;
      throw new Error(
        error?.message ||
        error?.error ||
        `Request failed (${response.status})`,
      );
    }

    return body as T;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(
        'The server took too long to respond. Check the API address and try again.',
      );
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

// Authentication

export async function registerIndustry(
  details: RegisterRequest,
): Promise<AuthResponse> {
  const auth = await request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details),
  });

  await saveAuth(auth);
  return auth;
}

export async function loginIndustry(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const auth = await request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  await saveAuth(auth);
  return auth;
}

// Materials

export const createMaterial = (
  material: Omit<Material, 'id'>,
) => request<Material>('/api/materials', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(material),
});

export const getMaterials = () =>
  request<Material[]>('/api/materials');

export const getMaterial = (id: string) =>
  request<Material>(`/api/materials/${id}`);

// Industries

export const getIndustries = () =>
  request<Industry[]>('/api/industries');

export const createIndustry = (
  industry: Omit<Industry, 'id'>,
) => request<Industry>('/api/industries', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(industry),
});

// Requirements

export const getRequirements = () =>
  request<Requirement[]>('/api/requirements');

export const createRequirement = (
  requirement: Omit<Requirement, 'id'>,
) => request<Requirement>('/api/requirements', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(requirement),
});

// Exchanges

export const getExchanges = () =>
  request<Exchange[]>('/api/exchanges');
export const getSupplierExchanges = (supplierIndustryId: string) =>
  request<Exchange[]>(
    `/api/exchanges/supplier/${encodeURIComponent(supplierIndustryId)}`,
  );

export const createExchange = (
  exchange: Omit<Exchange, 'id' | 'status' | 'createdAt'>,
) => request<Exchange>('/api/exchanges', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(exchange),
});

export const updateExchangeStatus = (
  id: string,
  status: Exchange['status'],
) => request<Exchange>(
  `/api/exchanges/${id}/status?status=${status}`,
  { method: 'PATCH' },
);

// Matching

export const getMaterialMatches = (id: string) =>
  request<unknown[]>(`/api/matching/${id}`);

export const getMultiSupplierMatches = (id: string) =>
  request<{
    requiredQuantity: number;
    totalAvailableQuantity: number;
    remainingQuantity: number;
    unit: string;
    suppliers: {
      materialId: string;
      industryId: string;
      contributedQuantity: number;
      availableQuantity: number;
      distanceKm: number;
      estimatedTransportCost: number;
      estimatedTransportCo2: number;
    }[];
  }>(`/api/multi-matching/${id}`);

// Resource Loop

export type Recommendation = {
  materialName: string;
  recommendedUse: string;
  targetIndustry: string;
  reason: string;
  processingRequired: string;
  suitability: string;
  safetyNote: string;
};

export const getResourceLoop = (
  materialName: string,
  category: string,
) =>
  request<Recommendation[]>(
    `/api/resource-loop?materialName=${encodeURIComponent(materialName)}&category=${encodeURIComponent(category)}`,
  );
