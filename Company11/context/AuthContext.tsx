import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginRequest, logoutRequest, validateSession } from '../services/authService';

interface AuthUser {
  username: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const validatedUser = await validateSession(token);
        setUser(validatedUser);
      } catch (err) {
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (username: string, password: string) => {
    setError(null);
    try {
      const { token, user: loggedInUser } = await loginRequest(username, password);
      localStorage.setItem('authToken', token);
      setUser(loggedInUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
      throw err;
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('authToken');
    try {
      if (token) {
        await logoutRequest(token);
      }
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      error,
      login,
      logout,
    }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

