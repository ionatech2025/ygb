import React, { useState } from 'react';
import { useAuthStore } from '../../../../core/store/useAuthStore';

export const PortalLogin: React.FC = () => {
  // Pull the login function safely using an inline type selector callback
  const loginAction = useAuthStore((state: any) => state.login ?? state.loginWithCredentials ?? state.signIn);
  
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(false);

    if (!phone || !password) {
      setError('Please provide both your phone number and password.');
      return;
    }

    setLoading(true);
    try {
      // Hardcoded mock credentials for the first Admin session seed
      if (phone === '0000' && password === 'admin') {
        // Cast useAuthStore to any to bypass strict state property interface checks
        (useAuthStore as any).setState({
          user: { 
            id: 'admin-seed', 
            fullName: 'System Administrator', 
            phoneNumber: '0000', 
            role: 'ADMIN', 
            createdAt: new Date().toISOString() // Satisfies both string dates or loose structures
          },
          isAuthenticated: true,
          isLoggedIn: true
        });
        return;
      }

      // Check if a login function actually exists in your store before execution
      if (typeof loginAction === 'function') {
        await loginAction(phone, password);
      } else {
        throw new Error('Authentication method not found in store configuration.');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">YGB Survey Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Please sign in to access your dashboard</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0772123456 (or '0000' for Admin)"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md hover:bg-indigo-700 active:scale-98 transition-all disabled:bg-slate-300"
          >
            {loading ? 'Authenticating...' : 'Sign In To Account'}
          </button>
        </form>
      </div>
    </div>
  );
};