export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  } as Record<string, string>;

  const resp = await fetch(url, { ...options, headers });
  if (!resp.ok) {
    throw new Error(`HTTP error! status: ${resp.status}`);
  }
  return resp;
}
