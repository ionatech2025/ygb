import { useState } from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { canSubmitSurvey } from '../../../../core/domain/user.model';
import type { FormType } from '../../../../core/domain/form-type.model';
import { FORM_TYPE_OPTIONS } from '../../../../core/domain/form-type.model';
import { PdmEntryScreen } from './PdmEntryScreen';
import { BypForm } from './BypForm';
import { IypForm } from './IypForm';
import { LgoForm } from './LgoForm';
import { PcForm } from './PcForm';

function AdminLockScreen() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
      <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        <Lock className="h-5 w-5" aria-hidden="true" />
      </span>
      <h2 className="text-sm font-bold text-text">Survey Entry Point Disabled</h2>
      <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-text-muted">
        Administrative accounts cannot submit PDM surveys. This preserves the collector audit trail.
      </p>
    </div>
  );
}

function ActiveFormPanel({
  formType,
  onBack,
}: {
  formType: FormType;
  onBack: () => void;
}) {
  const label = FORM_TYPE_OPTIONS.find((o) => o.value === formType)?.label ?? formType;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</p>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-xs font-semibold text-text transition hover:bg-surface-muted"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to category selection
        </button>
      </div>
      {formType === 'BYP' && <BypForm key={formType} onSubmitted={onBack} />}
      {formType === 'IYP' && <IypForm key={formType} onSubmitted={onBack} />}
      {formType === 'LGO' && <LgoForm key={formType} />}
      {formType === 'PC' && <PcForm key={formType} />}
    </div>
  );
}

export function PDMSurveyView() {
  const user = useAuthStore((state) => state.user);
  const [selectedFormType, setSelectedFormType] = useState<FormType | null>(null);

  if (!canSubmitSurvey(user?.role)) {
    return <AdminLockScreen />;
  }

  if (!selectedFormType) {
    return <PdmEntryScreen onSelect={setSelectedFormType} />;
  }

  return (
    <ActiveFormPanel
      formType={selectedFormType}
      onBack={() => setSelectedFormType(null)}
    />
  );
}
