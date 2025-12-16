import React from 'react';
import { LayoutDashboard, MessageSquare, Share2, ShoppingCart, Workflow, Settings } from 'lucide-react';
import { View, Order } from './types';

export const NAV_ITEMS = [
  { id: View.DASHBOARD, label: 'Overview', icon: <LayoutDashboard size={20} /> },
  { id: View.CHAT_AI, label: 'AI Assistant', icon: <MessageSquare size={20} /> },
  { id: View.INTEGRATIONS, label: 'Multi-Channel', icon: <Share2 size={20} /> },
  { id: View.COMMERCE, label: 'Commerce', icon: <ShoppingCart size={20} /> },
  { id: View.FLOWS, label: 'Flow Builder', icon: <Workflow size={20} /> },
];

export const MOCK_ORDERS: Order[] = [
  { id: '#ORD-9021', customer: 'Sarah Jenkins', phone: '+1 (555) 123-4567', amount: 245.99, status: 'Delivered', date: 'Just now', visibility: 'private', product: 'Wireless Handsfree' },
  { id: '#ORD-9020', customer: 'Michael Chen', phone: '+1 (555) 987-6543', amount: 89.50, status: 'Pending', date: '5 mins ago', visibility: 'public', product: 'Leather Handbag' },
  { id: '#ORD-9019', customer: 'Emma Wilson', amount: 120.00, status: 'Shipped', date: '1 hour ago', visibility: 'private', product: 'Smart Watch' },
  { id: '#ORD-9018', customer: 'James Rodriguez', amount: 450.25, status: 'Delivered', date: '2 hours ago', visibility: 'public', product: 'Sunglasses' },
  { id: '#ORD-9017', customer: 'Lisa Thompson', amount: 65.00, status: 'Pending', date: '3 hours ago', visibility: 'private', product: 'Wireless Handsfree' },
];

export const CHART_DATA = [
  { name: 'Mon', conversations: 420, sales: 2400 },
  { name: 'Tue', conversations: 380, sales: 2100 },
  { name: 'Wed', conversations: 550, sales: 3200 },
  { name: 'Thu', conversations: 490, sales: 2800 },
  { name: 'Fri', conversations: 680, sales: 4100 },
  { name: 'Sat', conversations: 720, sales: 4500 },
  { name: 'Sun', conversations: 650, sales: 3900 },
];