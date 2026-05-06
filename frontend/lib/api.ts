/**
 * Axios API 클라이언트 — NEXT_PUBLIC_API_URL에서 자동 로드
 * 도메인 변경 시 .env의 NEXT_PUBLIC_API_URL만 수정
 */
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// 토큰 자동 주입
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 처리
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
    return Promise.reject(err);
  }
);

// ── Vehicle API ──────────────────────────────────────────
export const vehicleApi = {
  list: (params?: Record<string, string | number>) =>
    api.get('/vehicles', { params }),
  getById: (id: string) => api.get(`/vehicles/${id}`),
  create: (data: Record<string, unknown>) => api.post('/vehicles', data),
};

// ── Shipping API ─────────────────────────────────────────
export const shippingApi = {
  getPorts: (region?: string) =>
    api.get('/shipping/ports', { params: region ? { region } : {} }),
  getQuote: (portId: string) =>
    api.get('/shipping/quote', { params: { port_id: portId } }),
};

// ── Auth API ─────────────────────────────────────────────
export const authApi = {
  register: (data: Record<string, unknown>) => api.post('/auth/register', data),
  login: (email: string, password: string) =>
    api.post('/auth/login', new URLSearchParams({ username: email, password }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),
  refresh: (refresh_token: string) => api.post('/auth/refresh', { refresh_token }),
};

// ── Inquiry API ──────────────────────────────────────────
export const inquiryApi = {
  create: (data: Record<string, unknown>) => api.post('/inquiries', data),
};
