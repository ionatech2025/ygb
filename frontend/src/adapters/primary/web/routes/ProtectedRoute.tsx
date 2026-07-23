import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import type { UserRole } from '../../../../core/domain/user.model';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-surface-muted">
        <p className="text-sm text-text-muted">Loading your session…</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    const fallback = user.role === 'ADMIN' ? '/admin/dashboard' : '/collector/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}

export function RootRedirect() {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isInitialized) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/collector/dashboard'} replace />
  );
}

export function GuestRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (isAuthenticated && user) {
    return (
      <Navigate
        to={user.role === 'ADMIN' ? '/admin/dashboard' : '/collector/dashboard'}
        replace
      />
    );
  }

  return <Outlet />;
}
