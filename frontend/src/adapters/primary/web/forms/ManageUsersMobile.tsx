import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { MockUserAdapter } from '../../../../adapters/secondary/api/mock-user.adapter';
import { UserProfile } from '../../../../core/domain/user.model';

const userRepo = new MockUserAdapter();

export const ManageUsersMobile: React.FC = () => {
  const { user } = useAuthStore();
  const [collectors, setCollectors] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load existing data collectors for the admin to monitor
    userRepo.fetchActiveCollectors().then((data) => {
      setCollectors(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24">
      {/* Mobile Sticky Header App Bar */}
      <header className="sticky top-0 bg-white border-b border-slate-100 px-4 py-4 shadow-sm z-10">
        <div>
          <h1 className="text-lg font-bold text-slate-800">YGB Management Portal</h1>
          <p className="text-xs text-slate-400">Signed in as: {user?.fullName} ({user?.role})</p>
        </div>
      </header>

      {/* Simplified Mobile View Directory */}
      <main className="flex-1 p-4 overflow-y-auto space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Active Field Collectors
        </h3>

        {loading ? (
          <p className="text-xs text-slate-400 p-2">Loading system profiles...</p>
        ) : (
          collectors.map((collector) => (
            <div key={collector.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-slate-800">{collector.fullName}</p>
                <p className="text-xs text-slate-400">{collector.phoneNumber}</p>
              </div>
              <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide">
                Collector Active
              </span>
            </div>
          ))
        )}
      </main>
    </div>
  );
};