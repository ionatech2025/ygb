import type { FormType } from '../../../../core/domain/form-type.model';
import { FORM_TYPE_OPTIONS } from '../../../../core/domain/form-type.model';
import { FormField, FormSelect } from '../components/forms';
import { ClipboardList } from 'lucide-react';

export interface PdmEntryScreenProps {
  onSelect: (formType: FormType) => void;
}

export function PdmEntryScreen({ onSelect }: PdmEntryScreenProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-2xl border border-brand/20 bg-brand-light/40 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
          <ClipboardList className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-text">New survey</h3>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">
            Choose the respondent category to load the correct PDM questionnaire.
          </p>
        </div>
      </div>

      <FormField
        label="Respondent category"
        htmlFor="pdm-category"
        required
        hint="Select a category — the form opens immediately."
      >
        <FormSelect
          id="pdm-category"
          value=""
          onChange={(value) => onSelect(value as FormType)}
          options={FORM_TYPE_OPTIONS}
          placeholder="Select a respondent category…"
          required
        />
      </FormField>
    </div>
  );
}
