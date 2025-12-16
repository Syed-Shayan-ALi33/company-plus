import React, { useState } from 'react';
import { Lock, LogIn, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

const Login: React.FC = () => {
  const { login, error } = useAuth();
  const { showToast } = useUI();
  const [username, setUsername] = useState('company11');
  const [password, setPassword] = useState('company123');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setLocalError(null);
    try {
      await login(username.trim(), password);
      showToast('Signed in successfully', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid credentials';
      setLocalError(message);
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const helperText = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center px-4">
      <div className="bg-white/95 backdrop-blur-md shadow-2xl border border-white/50 rounded-2xl w-full max-w-md p-8 space-y-6">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
            <Shield size={26} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">Company Portal</p>
            <h1 className="text-2xl font-bold text-slate-900">Sign in to continue</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="company11"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="company123"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                autoComplete="current-password"
                required
              />
              <Lock size={16} className="absolute right-3 top-3 text-slate-400" />
            </div>
          </div>
          {helperText && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {helperText}
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2.5 rounded-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition disabled:opacity-60"
          >
            <LogIn size={18} />
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-xs text-slate-500 text-center">
          Use <span className="font-semibold text-slate-700">company11</span> / <span className="font-semibold text-slate-700">company123</span> to access the dashboard.
        </p>
      </div>
    </div>
  );
};

export default Login;

