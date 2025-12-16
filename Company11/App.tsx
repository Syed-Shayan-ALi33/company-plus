import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SmartChat from './components/SmartChat';
import PlatformHub from './components/PlatformHub';
import CommerceManager from './components/CommerceManager';
import FlowBuilder from './components/FlowBuilder';
import { View } from './types';
import { UIProvider } from './context/UIContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const { isAuthenticated, loading } = useAuth();

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard />;
      case View.CHAT_AI:
        return <SmartChat />;
      case View.INTEGRATIONS:
        return <PlatformHub />;
      case View.COMMERCE:
        return <CommerceManager />;
      case View.FLOWS:
        return <FlowBuilder />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Checking your session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <DataProvider>
      <Layout currentView={currentView} setCurrentView={setCurrentView}>
        {renderContent()}
      </Layout>
    </DataProvider>
  );
};

const App: React.FC = () => {
  return (
    <UIProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </UIProvider>
  );
};

export default App;