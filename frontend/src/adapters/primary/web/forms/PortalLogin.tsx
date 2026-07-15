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
    <div className="min-h-screen bg-[#F3EEE0] flex flex-col lg:flex-row">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;0,700;1,500;1,600&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'IBM Plex Sans', sans-serif; }
        .font-ledger { font-family: 'IBM Plex Mono', monospace; }

        .terrain-dots {
          background-image: radial-gradient(circle, rgba(226,150,45,0.16) 1px, transparent 1.4px);
          background-size: 22px 22px;
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
          border: 2.5px solid #9A3414;
          background: #FFFFFF;
          box-shadow: 0 4px 14px -4px rgba(15,33,55,0.35), 0 0 0 4px #F3EEE0;
        }
      `}</style>

      {/* LEFT SIDE: Brand Cover - Hidden on mobile screens, visible on LG+ screens to support mobile-first login */}
      <div className="hidden lg:flex lg:w-7/12 bg-gradient-to-br from-[#0F2137] via-[#16304F] to-[#1B3A5C] text-white flex-col justify-between p-16 relative overflow-hidden">
        <div className="absolute inset-0 terrain-dots pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E2962D] rounded-full filter blur-3xl opacity-[0.08] -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#CB7B1E] rounded-full filter blur-3xl opacity-[0.08] -ml-20 -mb-20"></div>

        {/* YGB Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <span className="bg-[#E2962D] text-[#0F2137] w-11 h-11 flex items-center justify-center rounded-md text-lg font-display font-bold shadow-md">
            YGB
          </span>
          <div className="flex flex-col">
            <span className="font-body font-bold text-sm text-white uppercase leading-none">Youth Go Budget (YGB) App</span>
            <span className="font-body text-xs text-[#F5B15A] font-semibold mt-1.5">Survey System · Field Portal</span>
          </div>
        </div>

        {/* Hero */}
        <div className="my-auto py-12 relative z-10 max-w-xl">
          <h1 className="font-display italic text-[2.5rem] font-medium tracking-tight mt-6 leading-[1.15] text-white">
            Every survey collected here moves a community forward.
          </h1>
          <p className="font-body text-[#EAF1F8] mt-4 text-[15px] leading-relaxed max-w-md">
            The YGB Survey Tool helps our team and local leaders gather feedback,
            keep it safe, and track real progress across our target communities.
          </p>

          {/* Feature list */}
          <div className="mt-9 border-t border-white/20">
            {[
              { title: 'Works anywhere', body: 'Save surveys on your phone, even with a weak signal in the field.' },
              { title: 'Safe & secure', body: 'Your account and all collected answers stay protected.' },
              { title: 'Admin directory', body: 'Admins register and manage every team account in one place.' },
              { title: 'Easy reporting', body: 'Your dashboard updates the moment you’re back from a visit.' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3 py-4 border-b border-white/20">
                <span className="w-6 h-6 mt-0.5 flex-shrink-0 rounded-full bg-[#E2962D] flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-[#0F2137]" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <h4 className="font-body font-bold text-[15px] text-white">{f.title}</h4>
                  <p className="font-body text-sm text-[#DCE7F2] mt-0.5 leading-snug">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-[#C9D6E3] font-body">
          <span>&copy; {new Date().getFullYear()} Youth Go Budget (YGB) App</span>
          <span className="text-[#F5B15A] font-semibold">Log No. {new Date().getFullYear()}-UG</span>
        </div>
      </div>

      {/* RIGHT SIDE: Mobile-First Login Card */}
      <div className="w-full lg:w-5/12 flex flex-col justify-between p-6 bg-[#F3EEE0] min-h-screen border-t lg:border-t-0 lg:border-l border-[#E2D6B8]">
        
        {/* Mobile Header: Displays ONLY on Mobile/Tablet */}
        <div className="lg:hidden flex items-center justify-between w-full mb-8 pt-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#E2962D] text-[#0F2137] w-9 h-9 flex items-center justify-center rounded-md text-sm font-display font-bold shadow-sm">
              YGB
            </span>
            <span className="font-body font-bold text-xs text-[#0F2137] uppercase tracking-wide">YGB App</span>
          </div>
          <span className="text-[10px] font-body font-semibold text-[#9A3414] border border-[#9A3414]/30 px-2 py-1 rounded">
            FIELD PORTAL
          </span>
        </div>

        <div className="relative w-full max-w-md mx-auto my-auto">
          {/* Verification stamp - hidden on mobile to avoid layout crowding */}
          <div className="stamp-seal absolute -top-6 -right-4 z-20 w-24 h-24 rounded-full hidden md:flex flex-col items-center justify-center">
            <svg className="w-4 h-4 text-[#9A3414] mb-0.5" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L11.8 6.6L16.5 7.1L12.9 10.2L14 15L10 12.4L6 15L7.1 10.2L3.5 7.1L8.2 6.6L10 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
            <span className="font-body text-[10px] font-bold leading-none text-[#9A3414]">VERIFIED</span>
            <span className="font-body text-[10px] font-bold leading-none mt-1 text-[#9A3414]">PORTAL</span>
          </div>

          {/* Ticket card */}
          <div className="relative bg-white border-2 border-[#E2D6B8] rounded-xl shadow-[0_20px_40px_-15px_rgba(15,33,55,0.2)]">

            {/* Ticket notches */}
            <div className="absolute -left-3.5 top-[38%] -translate-y-1/2 w-7 h-7 rounded-full bg-[#F3EEE0] border-2 border-[#E2D6B8]"></div>
            <div className="absolute -right-3.5 top-[38%] -translate-y-1/2 w-7 h-7 rounded-full bg-[#F3EEE0] border-2 border-[#E2D6B8]"></div>

            <div className="p-6 sm:p-8 lg:p-10 space-y-6">
              <div className="text-center lg:text-left">
                <span className="font-body text-xs font-bold text-[#9A3414] uppercase tracking-wide">Field Access</span>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#0F2137] mt-1">Sign in</h2>
                <p className="font-body text-xs sm:text-sm text-[#3D4A57] mt-1.5">Enter your registered credentials to access your dashboard.</p>
              </div>

              {error && (
                <div className="pl-3 border-l-4 border-[#9A3414] bg-[#9A3414]/[0.08] py-3 pr-3 rounded-r-md flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#9A3414]" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2L18 17H2L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M10 8V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="10" cy="13.5" r="0.75" fill="currentColor" />
                  </svg>
                  <p className="font-body text-xs sm:text-sm text-[#6B2410] font-semibold">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block font-body text-xs sm:text-sm font-bold text-[#0F2137] mb-1.5">
                    Phone number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0772123456"
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
                    className="ledger-input font-ledger w-full px-1 py-2 bg-transparent text-sm sm:text-base text-[#0F2137] placeholder:text-[#9A8F76]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#E2962D] hover:bg-[#C97F1F] text-[#0F2137] font-body font-bold rounded-lg text-xs sm:text-sm shadow-md active:scale-[0.97] hover:shadow-lg transition-all disabled:bg-[#D8CDB2] disabled:text-[#7A7261] disabled:shadow-none"
                >
                  {loading ? 'Checking credentials…' : 'Open my portal'}
                </button>
              </form>

              {/* Testing profiles stubs */}
              <div className="pt-5 border-t-2 border-dashed border-[#E2D6B8]">
                <p className="font-body text-[10px] sm:text-xs font-bold text-[#3D4A57] uppercase mb-2.5 text-center">Development Stubs</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border-2 border-[#0F2137]/20 rounded-md p-2.5 text-center bg-[#0F2137]/[0.04]">
                    <span className="block font-body font-bold text-[11px] sm:text-xs text-[#0F2137]">Admin</span>
                    <span className="block font-ledger text-[11px] sm:text-xs text-[#3D4A57] mt-0.5">0000</span>
                    <span className="block font-ledger text-[11px] sm:text-xs text-[#3D4A57]">admin</span>
                  </div>
                  <div className="border-2 border-[#9A3414]/20 rounded-md p-2.5 text-center bg-[#9A3414]/[0.05]">
                    <span className="block font-body font-bold text-[11px] sm:text-xs text-[#9A3414]">Collector</span>
                    <span className="block font-ledger text-[11px] sm:text-xs text-[#3D4A57] mt-0.5">0772123456</span>
                    <span className="block font-ledger text-[11px] sm:text-xs text-[#3D4A57]">any pass</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Footer: Appears ONLY on mobile viewport bottom */}
        <div className="lg:hidden text-center text-[10px] text-[#5C533C] font-body mt-8 pt-4 border-t border-[#E2D6B8]/50">
          &copy; {new Date().getFullYear()} Youth Go Budget (YGB) App
        </div>
      </div>
    </div>
  );
};