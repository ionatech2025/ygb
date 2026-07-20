import {
  PDC_EFFECTIVENESS_OPTIONS,
  PDC_TRAINING_AREA_OPTIONS,
  requiresPdcTrainingAreas,
  type PcFormFields,
} from '../../../../../core/domain/pc-form.model';
import { FormField, formControlClassName, FormSection, MultiCheckboxGroup, YesNoRadioGroup } from '../../components/forms';

export interface PcPdcSectionProps {
  value: PcFormFields;
  onChange: (value: PcFormFields) => void;
  errors: Record<string, string>;
}

export function PcPdcSection({ value, onChange, errors }: PcPdcSectionProps) {
  const patch = (partial: Partial<PcFormFields>) => onChange({ ...value, ...partial });

  return (
    <FormSection title="PDC" description="Parish Development Committee composition and capacity">
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="Total PDC members" htmlFor="pdcTotalMembers" required error={errors.pdcTotalMembers}>
          <input
            id="pdcTotalMembers"
            type="text"
            inputMode="numeric"
            value={value.pdcTotalMembers}
            onChange={(e) => patch({ pdcTotalMembers: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>

        <FormField label="Youth members" htmlFor="pdcYouthMembers" required error={errors.pdcYouthMembers}>
          <input
            id="pdcYouthMembers"
            type="text"
            inputMode="numeric"
            value={value.pdcYouthMembers}
            onChange={(e) => patch({ pdcYouthMembers: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>

        <FormField label="Women members" htmlFor="pdcWomenMembers" required error={errors.pdcWomenMembers}>
          <input
            id="pdcWomenMembers"
            type="text"
            inputMode="numeric"
            value={value.pdcWomenMembers}
            onChange={(e) => patch({ pdcWomenMembers: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>
      </div>

      <YesNoRadioGroup
        name="pdcTrainingReceived"
        label="Did the PDC receive training?"
        value={value.pdcTrainingReceived}
        onChange={(choice) =>
          patch({
            pdcTrainingReceived: choice,
            pdcTrainingAreas: choice ? value.pdcTrainingAreas : [],
          })
        }
        required
        error={errors.pdcTrainingReceived}
      />

      {requiresPdcTrainingAreas(value.pdcTrainingReceived) && (
        <MultiCheckboxGroup
          legend="Training areas received"
          options={PDC_TRAINING_AREA_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          selected={value.pdcTrainingAreas}
          onChange={(selected) => patch({ pdcTrainingAreas: selected as PcFormFields['pdcTrainingAreas'] })}
          required
          error={errors.pdcTrainingAreas}
        />
      )}

      <FormField
        label="PDC effectiveness rating"
        htmlFor="pdcEffectivenessRating"
        required
        error={errors.pdcEffectivenessRating}
      >
        <select
          id="pdcEffectivenessRating"
          value={value.pdcEffectivenessRating}
          onChange={(e) => patch({ pdcEffectivenessRating: e.target.value })}
          className={formControlClassName}
          required
        >
          <option value="">Select rating…</option>
          {PDC_EFFECTIVENESS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>
    </FormSection>
  );
}
