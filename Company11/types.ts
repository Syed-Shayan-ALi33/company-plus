import React from 'react';

export enum View {
  DASHBOARD = 'DASHBOARD',
  CHAT_AI = 'CHAT_AI',
  INTEGRATIONS = 'INTEGRATIONS',
  COMMERCE = 'COMMERCE',
  FLOWS = 'FLOWS',
  SETTINGS = 'SETTINGS'
}

export interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface IntegrationStatus {
  id: string;
  platform: string;
  connected: boolean;
  lastSync?: string;
  iconName: string;
}

export interface Order {
  id: string;
  customer: string;
  phone?: string;
  product?: string;
  amount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  visibility: 'private' | 'public';
}