import React from 'react';
import { View } from '../types';
import { NAV_ITEMS } from '../constants';
import { LogOut, Globe } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setCurrentView, children }) => {
  const { showToast } = useUI();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    setCurrentView(View.DASHBOARD);
    showToast("Signed out successfully. Returning to login screen...", "info");
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex shadow-xl z-20">
        <div className="p-6 border-b border-slate-700 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <Globe size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Company</span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                currentView === item.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className={currentView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
           <div className="mb-4 px-3 py-2 bg-slate-800 rounded-lg">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Developed By</p>
              <p className="text-xs font-bold text-white">Syed Shayan Ali</p>
           </div>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white cursor-pointer transition-colors hover:bg-slate-800 rounded-lg"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
          <h1 className="text-xl font-semibold text-gray-800">
            {NAV_ITEMS.find((n) => n.id === currentView)?.label}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-green-700 font-medium">System Operational</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm border border-blue-200 cursor-pointer hover:bg-blue-200 transition-colors" onClick={() => showToast('Profile settings coming soon', 'info')}>
              SA
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;