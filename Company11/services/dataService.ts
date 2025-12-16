const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export interface DashboardResponse {
  orders: any[];
  chartData: { name: string; conversations: number; sales: number }[];
  metrics: {
    revenue: number;
    activeUsers: number;
    leads: number;
    conversionRate: number;
  };
}

export const fetchDashboard = async (): Promise<DashboardResponse> => {
  const res = await fetch(`${API_BASE}/dashboard`);
  if (!res.ok) {
    throw new Error('Failed to load dashboard data');
  }
  return res.json();
};

export const createOrder = async (order: {
  customer: string;
  phone?: string;
  product: string;
  amount: number;
  visibility?: 'private' | 'public';
}) => {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!res.ok) {
    const msg = (await res.json().catch(() => ({}))).message || 'Unable to create order';
    throw new Error(msg);
  }
  return res.json() as Promise<{ order: any; metrics: DashboardResponse['metrics'] }>;
};

export const updateOrder = async (id: string, updates: { status?: string }) => {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const msg = (await res.json().catch(() => ({}))).message || 'Unable to update order';
    throw new Error(msg);
  }
  return res.json() as Promise<{ order: any; metrics: DashboardResponse['metrics'] }>;
};

export const deleteOrderRequest = async (id: string) => {
  const res = await fetch(`${API_BASE}/orders/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const msg = (await res.json().catch(() => ({}))).message || 'Unable to delete order';
    throw new Error(msg);
  }
  return res.json() as Promise<{ success: boolean; metrics: DashboardResponse['metrics'] }>;
};

