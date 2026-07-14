import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { validateLoginPayload } from '../../../../core/domain/auth.model';

export const CollectorLogin: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { executeLogin, isOnline, setOnlineStatus, checkSilentRefresh } = useAuthStore();

  // Attach online/offline infrastructure listener nodes dynamically
  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Silent background interval processing to poll token age checks every 60 seconds
    const refreshTimer = setInterval(() => {
      checkSilentRefresh();
    }, 60000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(refreshTimer);
    };
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!validateLoginPayload(phone)) {
      setErrorMsg('Invalid phone number syntax. Use format e.g. 0772123456');
      return;
    }

    setLoading(true);
    try {
      await executeLogin(phone, password);
      alert('Authentication Successful! Navigating to PDM Entry Dashboard...');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        
        {/* Network Status Banner */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">YGB Survey Tool</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isOnline ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {isOnline ? '● Online Mode' : '▲ Offline Mode'}
          </span>
        </div>

        <p className="text-sm text-slate-500 mb-6">Data Collector Authentication Panel</p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Phone Number *
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0772123456"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-100 transition-all text-sm disabled:bg-slate-300"
          >
            {loading ? 'Authenticating Profile...' : 'Access Survey Forms'}
          </button>
        </form>
      </div>
    </div>
  );
};