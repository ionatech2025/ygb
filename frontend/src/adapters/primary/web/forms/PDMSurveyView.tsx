import React from 'react';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { canSubmitSurvey } from '../../../../core/domain/user.model';

export const PDMSurveyView: React.FC = () => {
  const { user } = useAuthStore();

  // TC-AUTH-04-01: UI blocks and completely hides the survey execution flow if an Administrator attempts access
  if (!canSubmitSurvey(user?.role)) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-xl mb-3">🔒</div>
        <h2 className="text-base font-bold text-slate-800">Survey Entry Point Disabled</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Administrative accounts are structurally restricted from field operations to preserve the submission audit trail.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-2 text-green-600 mb-3">
          <span className="text-lg">📄</span>
          <h2 className="text-base font-bold text-slate-800">PDM Survey Data Collection Form</h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">Collector: {user?.fullName}</p>
        
        {/* Simple Input Form fields for testing Data Collector entries */}
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Household Ref ID</label>
            <input type="text" placeholder="e.g. HHD-KLA-001" className="w-full p-3 border border-slate-200 rounded-xl text-xs" />
          </div>
          <button className="w-full py-3 bg-green-600 text-white text-xs font-bold uppercase rounded-xl tracking-wider shadow-sm">
            Submit Survey Payload
          </button>
        </div>
      </div>
    </div>
  );
};