import React, { createContext, useState, useContext, ReactNode } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface UIContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <UIContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`pointer-events-auto min-w-[300px] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg shadow-gray-200 border animate-slide-up ${
              toast.type === 'success' ? 'bg-white border-green-200 text-green-800' : 
              toast.type === 'error' ? 'bg-white border-red-200 text-red-800' : 
              'bg-slate-800 text-white border-slate-700'
            }`}
          >
            <div className={`shrink-0 ${
              toast.type === 'success' ? 'text-green-500' :
              toast.type === 'error' ? 'text-red-500' : 'text-blue-400'
            }`}>
              {toast.type === 'success' && <CheckCircle2 size={20} />}
              {toast.type === 'error' && <AlertCircle size={20} />}
              {toast.type === 'info' && <Info size={20} />}
            </div>
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button 
              onClick={() => removeToast(toast.id)} 
              className={`p-1 rounded-full hover:bg-black/5 ${
                 toast.type === 'info' ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-gray-800'
              }`}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within UIProvider');
  return context;
};