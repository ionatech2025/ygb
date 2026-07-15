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
  }, [setOnlineStatus, checkSilentRefresh]);

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
      setErrorMsg(err.message || 'Authentication failed. Please check your network or credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EEE0] flex flex-col items-center justify-between p-6 relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;0,700;1,500;1,600&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'IBM Plex Sans', sans-serif; }
        .font-ledger { font-family: 'IBM Plex Mono', monospace; }

        .terrain-dots {
          background-image: radial-gradient(circle, rgba(226,150,45,0.12) 1.2px, transparent 1.2px);
          background-size: 20px 20px;
        }
        .ledger-input {
          border-bottom: 2px solid #C9BC9C;
          transition: border-color 0.25s ease;
        }
        .ledger-input:focus {
          border-bottom-color: #B5651D;
          outline: none;
        }
        .stamp-seal {
          transform: rotate(-8deg);
          border: 2px solid #9A3414;
          background: #FFFFFF;
          box-shadow: 0 4px 12px -4px rgba(15,33,55,0.25);
        }
      `}</style>

      {/* Decorative background grid elements */}
      <div className="absolute inset-0 terrain-dots pointer-events-none"></div>
      
      {/* Top Header */}
      <header className="relative w-full max-w-md mx-auto flex items-center justify-between mb-8 z-10">
        <div className="flex items-center gap-2">
          <span className="bg-[#E2962D] text-[#0F2137] w-9 h-9 flex items-center justify-center rounded-md text-sm font-display font-bold shadow-sm">
            YGB
          </span>
          <div className="flex flex-col">
            <span className="font-body font-bold text-xs text-[#0F2137] uppercase tracking-wide leading-none">YGB App</span>
            <span className="font-body text-[10px] text-[#5C533C] mt-0.5">Survey & Field Tool</span>
          </div>
        </div>

        {/* Dynamic Network Connectivity Badge */}
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-body font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm border ${
          isOnline 
            ? 'bg-[#EAF6ED] text-[#1E5631] border-[#A3D9B5]' 
            : 'bg-[#FDF4E7] text-[#90550F] border-[#EED0A6]'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-[#2E8B57] animate-pulse' : 'bg-[#CB7B1E]'}`}></span>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </header>

      {/* Main Login Ticket */}
      <main className="relative w-full max-w-md mx-auto my-auto z-10">
        
        {/* Verification Stamp Seal */}
        <div className="stamp-seal absolute -top-5 -right-3 z-20 w-20 h-20 rounded-full flex flex-col items-center justify-center">
          <svg className="w-3.5 h-3.5 text-[#9A3414] mb-0.5" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L11.8 6.6L16.5 7.1L12.9 10.2L14 15L10 12.4L6 15L7.1 10.2L3.5 7.1L8.2 6.6L10 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
          <span className="font-body text-[8px] font-bold leading-none text-[#9A3414]">SECURED</span>
          <span className="font-body text-[8px] font-bold leading-none mt-0.5 text-[#9A3414]">PORTAL</span>
        </div>

        {/* Ticket Box */}
        <div className="relative bg-white border-2 border-[#E2D6B8] rounded-xl shadow-[0_20px_40px_-15px_rgba(15,33,55,0.15)]">
          
          {/* Ticket Notches */}
          <div className="absolute -left-3.5 top-[38%] -translate-y-1/2 w-7 h-7 rounded-full bg-[#F3EEE0] border-2 border-[#E2D6B8]"></div>
          <div className="absolute -right-3.5 top-[38%] -translate-y-1/2 w-7 h-7 rounded-full bg-[#F3EEE0] border-2 border-[#E2D6B8]"></div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center sm:text-left">
              <span className="font-body text-[10px] font-bold text-[#9A3414] uppercase tracking-wider">Field Access</span>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#0F2137] mt-1">Collector Portal</h2>
              <p className="font-body text-xs sm:text-sm text-[#3D4A57] mt-1.5">Data Collector Authentication Panel</p>
            </div>

            {errorMsg && (
              <div className="pl-3 border-l-4 border-[#9A3414] bg-[#9A3414]/[0.08] py-3 pr-3 rounded-r-md flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#9A3414]" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L18 17H2L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M10 8V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="10" cy="13.5" r="0.75" fill="currentColor" />
                </svg>
                <p className="font-body text-xs sm:text-sm text-[#6B2410] font-semibold">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="block font-body text-xs sm:text-sm font-bold text-[#0F2137] mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0772123456"
                  disabled={loading}
                  className="ledger-input font-ledger w-full px-1 py-2 bg-transparent text-sm sm:text-base text-[#0F2137] placeholder:text-[#9A8F76]"
                />
              </div>

              <div>
                <label className="block font-body text-xs sm:text-sm font-bold text-[#0F2137] mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="ledger-input font-ledger w-full px-1 py-2 bg-transparent text-sm sm:text-base text-[#0F2137] placeholder:text-[#9A8F76]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#E2962D] hover:bg-[#C97F1F] text-[#0F2137] font-body font-bold rounded-lg text-xs sm:text-sm shadow-md active:scale-[0.97] hover:shadow-lg transition-all disabled:bg-[#D8CDB2] disabled:text-[#7A7261] disabled:shadow-none"
              >
                {loading ? 'Authenticating Profile...' : 'Access Survey Forms'}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative w-full max-w-md mx-auto text-center text-[10px] text-[#5C533C] font-body mt-8 pt-4 border-t border-[#E2D6B8]/50 z-10">
        &copy; {new Date().getFullYear()} Youth Go Budget (YGB) App
      </footer>
    </div>
  );
};