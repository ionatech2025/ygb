import React from 'react';
import { useAuthStore } from './core/store/useAuthStore';
import { PortalLogin } from './adapters/primary/web/forms/PortalLogin';
import ManageUsers from './adapters/primary/web/forms/ManageUsers';
import { PDMSurveyView } from './adapters/primary/web/forms/PDMSurveyView';

export default function App() {
  // Using explicit selectors instead of destructuring prevents type mismatches
  const user = useAuthStore((state: any) => state.user);
  
  // Safe Fallback Check: Resolves the true state property name across common store conventions
  const isSessionActive = useAuthStore((state: any) => state.isAuthenticated ?? state.isLoggedIn ?? !!state.user);
  
  // Grab the logout/clear action from your store setup, with fallbacks
  const logoutAction = useAuthStore((state: any) => state.logout ?? state.signOut ?? state.clearAuth);

  const handleLogout = () => {
    if (typeof logoutAction === 'function') {
      logoutAction();
    } else {
      // Type-safe direct state override bypasses strict property checks for the mock engine
      (useAuthStore as any).setState({ 
        user: null, 
        isAuthenticated: false, 
        isLoggedIn: false 
      });
    }
  };

  // 1. Unauthenticated Route Gate -> Show central login screen
  if (!isSessionActive) {
    return <PortalLogin />;
  }

  // 2. Data Collector Route Gate -> Skip Admin layout, render mobile survey screen directly
  if (user?.role === 'DATA_COLLECTOR') {
    return (
      <div className="min-h-screen bg-[#F3EEE0] flex flex-col">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;0,700;1,500;1,600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
          .font-display { font-family: 'Fraunces', serif; }
          .font-body { font-family: 'IBM Plex Sans', sans-serif; }
        `}</style>

        <header className="bg-white border-b border-[#E2D6B8] p-4 sticky top-0 z-50 shadow-sm">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-[#E2962D] text-[#0F2137] w-8 h-8 flex items-center justify-center rounded-md text-xs font-display font-bold shadow-sm">
                YGB
              </span>
              <span className="font-body font-bold text-xs text-[#0F2137] uppercase tracking-wide">
                Collector Portal
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-xs font-body font-bold text-[#9A3414] hover:text-[#7A270E] bg-[#9A3414]/10 hover:bg-[#9A3414]/15 px-3 py-1.5 rounded-lg transition-colors border border-[#9A3414]/20"
            >
              Log Out
            </button>
          </div>
        </header>
        <main className="flex-1">
          <PDMSurveyView />
        </main>
      </div>
    );
  }

  // 3. Admin Route Gate -> Render full dashboard with layout shell (Outdated Sprint 1 tag removed)
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;0,700;1,500;1,600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'IBM Plex Sans', sans-serif; }
      `}</style>

      <header className="bg-white border-b border-[#E2D6B8] p-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-[#E2962D] text-[#0F2137] w-10 h-10 flex items-center justify-center rounded-md text-base font-display font-bold shadow-md">
              YGB
            </span>
            <div>
              <h1 className="font-display text-lg font-bold text-[#0F2137]">YGB App Admin Panel</h1>
              <p className="font-body text-[10px] text-[#5C533C] uppercase tracking-wider font-semibold">Central Management Console</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-body text-xs text-[#5C533C] font-semibold">
              Admin: {user?.fullName || 'Authenticated User'}
            </span>
            <button 
              onClick={handleLogout}
              className="font-body text-xs font-bold text-[#9A3414] hover:text-[#7A270E] bg-[#9A3414]/10 hover:bg-[#9A3414]/15 px-4 py-2 rounded-lg transition-colors border border-[#9A3414]/20 shadow-sm"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="py-6">
        <ManageUsers />
      </main>
    </div>
  );
}