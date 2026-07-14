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
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-50">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 tracking-tight">📋 Collector Mobile Portal</span>
            <button 
              onClick={handleLogout}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg transition"
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

  // 3. Admin Route Gate -> Render full dashboard with layout shell
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-800">YGB Survey Tool Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 font-medium">
              Admin: {user?.fullName || 'Authenticated User'}
            </span>
            <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">
              Sprint 1 / Phase 1 MVP
            </span>
            <button 
              onClick={handleLogout}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition ml-2 border border-rose-100"
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