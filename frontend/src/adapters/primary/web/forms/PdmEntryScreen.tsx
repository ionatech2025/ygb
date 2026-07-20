import type { FormType } from '../../../../core/domain/form-type.model';
import { FORM_TYPE_OPTIONS } from '../../../../core/domain/form-type.model';
import { FormField, formControlClassName } from '../components/forms';
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
        <select
          id="pdm-category"
          defaultValue=""
          onChange={(e) => {
            const value = e.target.value as FormType;
            if (value) onSelect(value);
          }}
          className={formControlClassName}
          aria-label="Respondent category"
        >
          <option value="" disabled>
            Select a respondent category…
          </option>
          {FORM_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>
    </div>
  );
}
