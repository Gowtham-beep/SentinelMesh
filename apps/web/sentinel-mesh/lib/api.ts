import axios, { AxiosError } from 'axios';
import type {
  CheckResult,
  Incident,
  LoginRequest,
  LoginResponse,
  Monitor,
  MonitorPayload,
  MonitorStats,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken() {
  return authToken;
}

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message) && message.length > 0) return String(message[0]);
    if (error.message) return error.message;
  }

  if (error instanceof Error) return error.message;
  return fallback;
}

export async function loginRequest(payload: LoginRequest) {
  const res = await api.post<LoginResponse & { accessToken?: string }>('/auth/login', payload);
  const token = res.data.token ?? res.data.accessToken;
  if (!token) {
    throw new Error('No token received from login response');
  }
  return { token };
}

export async function listMonitors() {
  const res = await api.get<Monitor[]>('/monitors');
  return res.data;
}

export async function getMonitor(id: string) {
  const res = await api.get<Monitor>(`/monitors/${id}`);
  return res.data;
}

export async function createMonitor(payload: MonitorPayload) {
  const res = await api.post<Monitor>('/monitors', payload);
  return res.data;
}

export async function updateMonitor(id: string, payload: MonitorPayload) {
  const res = await api.put<Monitor>(`/monitors/${id}`, payload);
  return res.data;
}

export async function deleteMonitor(id: string) {
  await api.delete(`/monitors/${id}`);
}

export async function listMonitorChecks(id: string, limit = 100) {
  const res = await api.get<CheckResult[]>(`/monitors/${id}/checks`, {
    params: { limit },
  });
  return res.data;
}

export async function getMonitorStats(id: string) {
  const res = await api.get<MonitorStats>(`/monitors/${id}/stats`);
  return res.data;
}

export async function listIncidents(monitorId?: string) {
  const res = await api.get<Incident[]>('/incidents', {
    params: monitorId ? { monitorId } : undefined,
  });
  return res.data;
}

export async function getUserProfile() {
  const res = await api.get('/auth/me');
  return res.data;
}

export async function changePassword(payload: { currentPassword: string; newPassword: string }) {
  const res = await api.put('/auth/password', payload);
  return res.data;
}
