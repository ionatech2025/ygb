import { useAuthStore } from '../../../../core/store/useAuthStore';
import { canSubmitSurvey } from '../../../../core/domain/user.model';
import { FormField, formControlClassName } from '../components/forms';

export function PDMSurveyView() {
  const user = useAuthStore((state) => state.user);

  if (!canSubmitSurvey(user?.role)) {
    return null;
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-text-muted">
        Collector ID: <span className="font-mono">{user?.id}</span>
      </p>

      <FormField label="Household reference ID" htmlFor="householdRef" hint="Temporary placeholder until Epic 2 form flows land.">
        <input
          id="householdRef"
          type="text"
          placeholder="e.g. HHD-KLA-001"
          className={formControlClassName}
        />
      </FormField>

      <button
        type="button"
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-brand text-sm font-bold text-white transition hover:bg-brand-hover active:scale-[0.98]"
      >
        Submit Survey Payload
      </button>
    </div>
  );
}
