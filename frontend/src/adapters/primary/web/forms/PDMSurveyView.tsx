import React, { useState } from 'react';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { canSubmitSurvey } from '../../../../core/domain/user.model';

export const PDMSurveyView: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // TC-AUTH-04-01: UI blocks and completely hides the survey execution flow if an Administrator attempts access
  if (!canSubmitSurvey(user?.role)) {
    return (
      <div className="min-h-screen bg-[#F3EEE0] flex flex-col items-center justify-center p-6 text-center">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;0,700;1,500;1,600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
          .font-display { font-family: 'Fraunces', serif; }
          .font-body { font-family: 'IBM Plex Sans', sans-serif; }
        `}</style>
        <div className="w-16 h-16 bg-[#9A3414]/10 rounded-full flex items-center justify-center text-[#9A3414] font-bold text-2xl mb-4 border border-[#9A3414]/20">
          🔒
        </div>
        <h2 className="font-display text-xl font-semibold text-[#0F2137]">Survey Access Restricted</h2>
        <p className="font-body text-xs sm:text-sm text-[#5C533C] mt-2 max-w-xs leading-relaxed">
          Administrative accounts are structurally restricted from field operations to preserve the submission audit trail.
        </p>
      </div>
    );
  }

  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Logic for submitting the rest of the survey payload goes here
      alert('Survey Payload Submitted Successfully!');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EEE0] p-4 sm:p-6 flex items-center justify-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;0,700;1,500;1,600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'IBM Plex Sans', sans-serif; }
      `}</style>

      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl border-2 border-[#E2D6B8] shadow-[0_15px_30px_-15px_rgba(15,33,55,0.1)] relative">
        {/* Ticket Side Notches for cohesive styling */}
        <div className="absolute -left-3.5 top-[50%] -translate-y-1/2 w-7 h-7 rounded-full bg-[#F3EEE0] border-2 border-[#E2D6B8]"></div>
        <div className="absolute -right-3.5 top-[50%] -translate-y-1/2 w-7 h-7 rounded-full bg-[#F3EEE0] border-2 border-[#E2D6B8]"></div>

        <div className="flex items-center space-x-3 text-[#E2962D] mb-4">
          <span className="text-2xl">📋</span>
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-[#0F2137]">YGB Survey Form</h2>
            <p className="font-body text-[11px] text-[#5C533C] mt-0.5">Collector: {user?.fullName || 'Field Agent'}</p>
          </div>
        </div>

        <p className="font-body text-xs text-[#5C533C] mb-6 leading-relaxed">
          Please fill out the field metrics below to update your regional portal record.
        </p>

        <form onSubmit={handleSurveySubmit} className="space-y-4">
          {/* Note: The Household Ref ID has been removed as it is no longer a requirement */}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#E2962D] hover:bg-[#C97F1F] text-[#0F2137] font-body font-bold rounded-lg text-xs sm:text-sm shadow-md active:scale-[0.97] hover:shadow-lg transition-all disabled:bg-[#D8CDB2] disabled:text-[#7A7261]"
          >
            {loading ? 'Submitting Data...' : 'Submit Survey Payload'}
          </button>
        </form>
      </div>
    </div>
  );
};