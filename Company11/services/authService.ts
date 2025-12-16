const API_BASE = import.meta.env.VITE_API_BASE || '/api';

interface LoginResponse {
  token: string;
  user: { username: string };
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = (data as { message?: string }).message || 'Request failed';
    throw new Error(message);
  }
  return data as T;
}

export const loginRequest = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  return handleResponse<LoginResponse>(response);
};

export const validateSession = async (token: string): Promise<{ username: string }> => {
  const response = await fetch(`${API_BASE}/auth/validate`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse<{ username: string }>(response);
};

export const logoutRequest = async (token: string) => {
  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

