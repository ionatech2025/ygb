import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { useSyncStore } from '../../../../core/store/useSyncStore';
import { useSubmissionCountStore } from '../../../../core/store/useSubmissionCountStore';
import { locationService } from '../../../../core/LocationService';
import { PdmResourceDetailPage } from '../public/PdmResourceDetailPage';
import { PdmResourcesIndexPage } from '../public/PdmResourcesIndexPage';
import { PortalLogin } from '../forms/PortalLogin';
import ManageUsers from '../forms/ManageUsers';
import CollectorProfilePage from '../admin/CollectorProfilePage';
import { CollectorDashboard } from '../forms/CollectorDashboard';
import { AdminDashboardHome } from '../admin/AdminDashboardHome';
import { AdminCollectorTrackerPage } from '../admin/AdminCollectorTrackerPage';
import { AdminSyncStatusPage } from '../admin/AdminSyncStatusPage';
import { SubmissionDetailPage } from '../admin/SubmissionDetailPage';
import { SubmissionListPage } from '../admin/SubmissionListPage';
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
    void useSyncStore.getState().initialize();
    void useSubmissionCountStore.getState().initialize();
  }, [initialize]);

  useEffect(() => {
    const handleOnline = () => {
      setOnlineStatus(true);
      void locationService.ensureLoaded();
      void useSyncStore.getState().triggerSync();
      const token = useAuthStore.getState().getAccessToken();
      if (token) {
        void useSubmissionCountStore.getState().reconcileWithServer(token);
      }
    };
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

        <Route path="/resources" element={<PdmResourcesIndexPage />} />
        <Route path="/resources/:slug" element={<PdmResourceDetailPage />} />

        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardHome />} />
            <Route path="/admin/submissions" element={<SubmissionListPage />} />
            <Route path="/admin/submissions/:id" element={<SubmissionDetailPage />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/users/:id" element={<CollectorProfilePage />} />
            <Route path="/admin/collectors" element={<AdminCollectorTrackerPage />} />
            <Route path="/admin/sync-status" element={<AdminSyncStatusPage />} />
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
