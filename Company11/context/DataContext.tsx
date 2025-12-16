import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo } from 'react';
import { Order } from '../types';
import { CHART_DATA as INITIAL_CHART_DATA, MOCK_ORDERS } from '../constants';
import { createOrder, deleteOrderRequest, fetchDashboard, updateOrder } from '../services/dataService';

interface DataContextType {
  orders: Order[];
  revenue: number;
  activeUsers: number;
  leads: number;
  conversionRate: number;
  chartData: any[];
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  stats: {
    pending: number;
    delivered: number;
    total: number;
  };
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with MOCK_ORDERS so the table is populated by default
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [activeUsers, setActiveUsers] = useState(1);
  const [leads, setLeads] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [chartData, setChartData] = useState(() => INITIAL_CHART_DATA);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length,
    delivered: orders.filter(o => o.status === 'Delivered' || o.status === 'Shipped').length
  }), [orders]);

  const hydrateDashboard = (data: Awaited<ReturnType<typeof fetchDashboard>>) => {
    setOrders(data.orders);
    setChartData(data.chartData);
    setRevenue(data.metrics.revenue);
    setActiveUsers(data.metrics.activeUsers);
    setLeads(data.metrics.leads);
    setConversionRate(data.metrics.conversionRate);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchDashboard();
        hydrateDashboard(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await fetchDashboard();
        hydrateDashboard(data);
      } catch {
        // swallow to keep UI responsive
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const refreshDashboard = async () => {
    const data = await fetchDashboard();
    hydrateDashboard(data);
  };

  const addOrder = async (order: Order) => {
    try {
      await createOrder({
        customer: order.customer,
        phone: order.phone,
        product: order.product || 'N/A',
        amount: order.amount,
        visibility: order.visibility,
      });
      await refreshDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create order');
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      await updateOrder(id, { status });
      await refreshDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update order');
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const response = await deleteOrderRequest(id);
      if (response.success) {
        await refreshDashboard();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete order');
    }
  };

  return (
    <DataContext.Provider value={{ 
      orders, 
      revenue, 
      activeUsers, 
      leads, 
      conversionRate,
      chartData,
      addOrder, 
      updateOrderStatus,
      deleteOrder,
      stats,
      loading,
      error
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};