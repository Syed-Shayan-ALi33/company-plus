import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { TrendingUp, Users, DollarSign, MessageCircle, Activity } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useData } from '../context/DataContext';
import { Modal } from './UIComponents';

const MetricCard: React.FC<{ 
  title: string; 
  value: string; 
  change: string; 
  trend: 'up' | 'down' | 'neutral'; 
  icon: React.ReactNode;
  color: string;
  animate?: boolean;
}> = ({ title, value, change, trend, icon, color, animate }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden">
    {animate && (
        <div className="absolute top-0 right-0 p-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
        </div>
    )}
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-${color.replace('bg-', '')}`}>
        {icon}
      </div>
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
        trend === 'up' ? 'bg-green-100 text-green-700' : 
        trend === 'down' ? 'bg-red-100 text-red-700' :
        'bg-gray-100 text-gray-700'
      }`}>
        {change}
      </span>
    </div>
    <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 transition-all duration-300">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const { showToast } = useUI();
  const { revenue, activeUsers, leads, conversionRate, chartData } = useData();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  // Keep the clock ticking
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Activity size={20} className="text-blue-600"/>
            Live Dashboard
          </h2>
          <span className="text-xs text-gray-500 font-mono">
            Last updated: {time.toLocaleTimeString()}
          </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Revenue" 
          value={`$${revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
          change={revenue > 0 ? "+100%" : "0%"} 
          trend={revenue > 0 ? "up" : "neutral"} 
          icon={<DollarSign size={24} className="text-blue-600" />} 
          color="bg-blue-500"
          animate={revenue > 0}
        />
        <MetricCard 
          title="Active Conversations" 
          value={activeUsers.toLocaleString()} 
          change="+0%" 
          trend="neutral" 
          icon={<MessageCircle size={24} className="text-purple-600" />} 
          color="bg-purple-500"
          animate={true}
        />
        <MetricCard 
          title="Conversion Rate" 
          value={`${conversionRate.toFixed(1)}%`}
          change={conversionRate > 0 ? "+2.1%" : "0%"}
          trend={conversionRate > 0 ? "up" : "neutral"} 
          icon={<TrendingUp size={24} className="text-amber-600" />} 
          color="bg-amber-500"
        />
        <MetricCard 
          title="New Leads" 
          value={leads.toLocaleString()}
          change={leads > 0 ? "+1" : "0"} 
          trend={leads > 0 ? "up" : "neutral"} 
          icon={<Users size={24} className="text-emerald-600" />} 
          color="bg-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-96">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            Weekly Performance 
            <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">Live</span>
          </h3>
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                cursor={{ fill: '#F3F4F6' }}
              />
              <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Sales ($)" animationDuration={500} />
              <Bar dataKey="conversations" fill="#A855F7" radius={[4, 4, 0, 0]} name="Conversations" animationDuration={500} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-96">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            Traffic Trends
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </h3>
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <Tooltip 
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="conversations" 
                stroke="#10B981" 
                fillOpacity={1} 
                fill="url(#colorSales)" 
                name="Live Traffic" 
                animationDuration={1000}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Insight Section */}
      <div className="bg-indigo-900 rounded-xl p-6 text-white shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <MessageCircle size={200} />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Weekly AI Insight</h3>
            <p className="text-indigo-100 max-w-2xl mb-4">
                Your AI agent handled 45% more complex queries this week compared to last week. Customer satisfaction score has increased by 12 points due to faster response times on Instagram and WhatsApp.
            </p>
            <button 
              onClick={() => setIsReportModalOpen(true)}
              className="bg-white text-indigo-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-50 transition-colors"
            >
                View Detailed Report
            </button>
          </div>
      </div>

      <Modal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        title="Weekly AI Performance Report"
        actionLabel="Download PDF"
        onAction={() => {
            setIsReportModalOpen(false);
            showToast("Report download started", "success");
        }}
        secondaryActionLabel="Close"
      >
        <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                <span className="text-indigo-900 font-medium">Customer Sentiment</span>
                <span className="text-indigo-700 font-bold">94% Positive</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-green-900 font-medium">Avg Response Time</span>
                <span className="text-green-700 font-bold">1.2 seconds</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-2">Key Metrics</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex justify-between"><span>Bot Resolution Rate:</span> <span className="font-mono font-bold">88%</span></li>
                    <li className="flex justify-between"><span>Human Handoffs:</span> <span className="font-mono font-bold">12%</span></li>
                    <li className="flex justify-between"><span>Top Intent:</span> <span className="font-mono font-bold">Order Status</span></li>
                </ul>
            </div>
            <p className="text-xs text-gray-500 italic mt-2">
                Report generated by Gemini 2.5 Analysis Engine.
            </p>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;