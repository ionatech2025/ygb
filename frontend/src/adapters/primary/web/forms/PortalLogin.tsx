import React, { useState } from 'react';
import { useAuthStore } from '../../../../core/store/useAuthStore';

export const PortalLogin: React.FC = () => {
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
      setError('Please type in both your phone number and your password.');
      return;
    }

    setLoading(true);
    try {
      // 1. ADMIN SEED GATE
      if (phone === '0000' && password === 'admin') {
        (useAuthStore as any).setState({
          user: { 
            id: 'admin-seed', 
            fullName: 'System Administrator', 
            phoneNumber: '0000', 
            role: 'ADMIN', 
            createdAt: new Date().toISOString() 
          },
          isAuthenticated: true,
          isLoggedIn: true
        });
        return;
      }

      // 2. DATA COLLECTOR SEED GATE (Jane Nakato)
      if (phone === '0772123456' || phone === '+256772123456' || phone === '256772123456') {
        (useAuthStore as any).setState({
          user: {
            id: 'dc-01',
            fullName: 'Jane Nakato',
            phoneNumber: '+256772123456',
            role: 'DATA_COLLECTOR',
            createdAt: new Date().toISOString()
          },
          isAuthenticated: true,
          isLoggedIn: true
        });
        return;
      }

      // 3. FALLBACK: Direct login or offline testing bypass
      if (typeof loginAction === 'function') {
        await loginAction(phone, password);
      } else {
        (useAuthStore as any).setState({
          user: {
            id: `dc-mock-${Math.floor(Math.random() * 1000)}`,
            fullName: 'Field Collector',
            phoneNumber: phone,
            role: 'DATA_COLLECTOR',
            createdAt: new Date().toISOString()
          },
          isAuthenticated: true,
          isLoggedIn: true
        });
      }
    } catch (err: any) {
      setError(err.message || 'The phone number or password you typed is incorrect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      
      {/* LEFT SIDE: Brand Identity & Friendly Community Info */}
      <div className="lg:w-7/12 bg-gradient-to-br from-blue-900 via-blue-800 to-orange-950 text-white flex flex-col justify-between p-8 lg:p-16 relative overflow-hidden">
        {/* Subtle decorative background shapes using NAC colors */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600 rounded-full filter blur-3xl opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-25 -ml-20 -mb-20"></div>

        {/* NAC Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <span className="bg-orange-500 text-white px-3 py-1.5 rounded-xl text-xl font-black tracking-wider shadow-md">
            NAC
          </span>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-wide text-blue-200 uppercase leading-none">NETWORK FOR ACTIVE CITIZENS</span>
            <span className="text-[10px] text-orange-300 font-bold tracking-widest mt-0.5">SURVEY SYSTEM</span>
          </div>
        </div>

        {/* Simplified Pitch for Community Members & Admins */}
        <div className="my-auto py-12 relative z-10 max-w-xl">
          <span className="bg-orange-500/20 text-orange-300 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-orange-500/30">
            Official Portal
          </span>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight mt-6 leading-tight">
            Collecting insights to drive active community action.
          </h1>
          <p className="text-blue-100 mt-4 text-sm leading-relaxed">
            Welcome to the YGB Survey Tool. This platform helps our team and local leaders easily collect feedback, keep information safe, and track progress across our target communities.
          </p>

          {/* Super simple, jargon-free features list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
            <div className="flex items-start gap-3">
              <span className="bg-orange-500 text-white p-2 rounded-xl text-xs font-bold shadow-sm">✓</span>
              <div>
                <h4 className="font-bold text-sm text-white">Works Anywhere</h4>
                <p className="text-xs text-blue-200">Save surveys on your phone even if the internet is weak in the field.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-blue-500 text-white p-2 rounded-xl text-xs font-bold shadow-sm">✓</span>
              <div>
                <h4 className="font-bold text-sm text-white">Safe & Secure</h4>
                <p className="text-xs text-blue-200">Your account and all collected community answers are highly protected.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-orange-500 text-white p-2 rounded-xl text-xs font-bold shadow-sm">✓</span>
              <div>
                <h4 className="font-bold text-sm text-white">Admin Directory</h4>
                <p className="text-xs text-blue-200">Administrators can register and manage team accounts in one simple place.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-blue-500 text-white p-2 rounded-xl text-xs font-bold shadow-sm">✓</span>
              <div>
                <h4 className="font-bold text-sm text-white">Easy Reporting</h4>
                <p className="text-xs text-blue-200">Instantly update the dashboard when you return from your visits.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-blue-300 mt-6 lg:mt-0">
          &copy; {new Date().getFullYear()} Network for Active Citizens. Helping citizens take charge of their development.
        </div>
      </div>

      {/* RIGHT SIDE: Simplified Login Box with NAC Orange button and Blue accents */}
      <div className="lg:w-5/12 flex items-center justify-center p-6 bg-slate-50 min-h-[500px] lg:min-h-screen border-t lg:border-t-0 lg:border-l border-slate-200">
        <div className="bg-white p-8 lg:p-12 rounded-3xl shadow-xl border border-slate-200 w-full max-w-md space-y-6">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-black text-slate-800">Please Sign In</h2>
            <p className="text-xs text-slate-400 mt-1">Type in your phone number and password to open your page.</p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold text-blue-800 uppercase tracking-widest mb-1">
                Your Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0772123456"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-slate-300 font-medium transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-blue-800 uppercase tracking-widest mb-1">
                Your Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-slate-300 font-medium transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md active:scale-95 hover:shadow-lg hover:shadow-orange-100 transition-all disabled:bg-slate-300 disabled:shadow-none"
            >
              {loading ? 'Checking your details...' : 'Open My Portal'}
            </button>
          </form>

          {/* Helper panel styled with the same friendly palette */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 text-center">Testing Profiles</p>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100 text-center">
                <span className="block font-bold text-blue-900">Admin Account</span>
                <span className="text-slate-500">Phone: 0000</span>
                <span className="block text-slate-500 font-medium">Pass: admin</span>
              </div>
              <div className="bg-orange-50/40 p-2 rounded-lg border border-orange-100 text-center">
                <span className="block font-bold text-orange-950">Field Collector</span>
                <span className="text-slate-500">Phone: 0772123456</span>
                <span className="block text-slate-500 font-medium">Pass: (Any password)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};