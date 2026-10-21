import axios, { AxiosError } from 'axios';
import type {
  Categories,
  Transaction,
  TransactionFilters,
  TransactionInput,
  User,
} from '../types/transaction';

interface ApiError {
  error: string;
  message: string;
}

const TOKEN_KEY = 'expense_diary_token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler;
};

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      tokenStorage.clear();
      onUnauthorized?.();
    }
    return Promise.reject(new Error(error.response?.data?.message || error.message));
  }
);

export const AuthAPI = {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await apiClient.post<{ token: string; user: User }>('/auth/login', { email, password });
    return res.data;
  },

  async me(): Promise<User> {
    const res = await apiClient.get<User>('/auth/me');
    return res.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },
};

export const TransactionAPI = {
  async list(filters: TransactionFilters): Promise<Transaction[]> {
    const { type, search, category, ...rest } = filters;
    const params = {
      ...rest,
      type: type === 'all' ? undefined : type,
      search: search || undefined,
      category: category || undefined,
    };
    const res = await apiClient.get<Transaction[]>('/transactions', { params });
    return res.data;
  },

  async categories(): Promise<Categories> {
    const res = await apiClient.get<Categories>('/transactions/categories');
    return res.data;
  },

  async create(entry: TransactionInput): Promise<Transaction> {
    const res = await apiClient.post<Transaction>('/transactions', entry);
    return res.data;
  },

  async update(id: string, entry: Partial<TransactionInput>): Promise<Transaction> {
    const res = await apiClient.put<Transaction>(`/transactions/${id}`, entry);
    return res.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/transactions/${id}`);
  },
};
