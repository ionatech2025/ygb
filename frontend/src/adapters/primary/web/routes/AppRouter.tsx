import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { locationService } from '../../../../core/LocationService';
import { PortalLogin } from '../forms/PortalLogin';
import ManageUsers from '../forms/ManageUsers';
import { CollectorDashboard } from '../forms/CollectorDashboard';
import { AdminLayout } from '../layouts/AdminLayout';
import { CollectorLayout } from '../layouts/CollectorLayout';
import { GuestRoute, ProtectedRoute, RootRedirect } from './ProtectedRoute';

export function AppRouter() {
  const initialize = useAuthStore((state) => state.initialize);
  const setOnlineStatus = useAuthStore((state) => state.setOnlineStatus);
  const checkSilentRefresh = useAuthStore((state) => state.checkSilentRefresh);

  useEffect(() => {
    initialize();
    void locationService.ensureLoaded();
  }, [initialize]);

  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    const refreshTimer = setInterval(() => {
      void checkSilentRefresh();
    }, 60_000);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(refreshTimer);
    };
  }, [setOnlineStatus, checkSilentRefresh]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<PortalLogin />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<ManageUsers />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['DATA_COLLECTOR']} />}>
          <Route element={<CollectorLayout />}>
            <Route path="/collector/dashboard" element={<CollectorDashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
