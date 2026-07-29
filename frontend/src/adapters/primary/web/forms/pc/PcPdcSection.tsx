import {
  PDC_EFFECTIVENESS_OPTIONS,
  PDC_TRAINING_AREA_OPTIONS,
  requiresPdcTrainingAreas,
  type PcFormFields,
} from '../../../../../core/domain/pc-form.model';
import { FormField, formControlClassName, FormSection, FormSelect, MultiCheckboxGroup, YesNoRadioGroup } from '../../components/forms';

export interface PcPdcSectionProps {
  value: PcFormFields;
  onChange: (value: PcFormFields) => void;
  errors: Record<string, string>;
}

export function PcPdcSection({ value, onChange, errors }: PcPdcSectionProps) {
  const patch = (partial: Partial<PcFormFields>) => onChange({ ...value, ...partial });

  return (
    <FormSection title="Parish Development Committee (PDC)" description="Section C — Questions 9–14">
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField
          label="Q9. Total number of committee members"
          htmlFor="pdcTotalMembers"
          required
          error={errors.pdcTotalMembers}
        >
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

        <FormField
          label="Q10. Number of youth representatives"
          htmlFor="pdcYouthMembers"
          required
          error={errors.pdcYouthMembers}
        >
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

        <FormField
          label="Q11. Total number of young women aged 30 years below coopted as committee members"
          htmlFor="pdcWomenMembers"
          required
          error={errors.pdcWomenMembers}
        >
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
        label="Q12. Have the PDC members received leadership and management skills training?"
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

      {value.pdcTrainingReceived !== true && (
        <p className="text-xs text-text-muted">Q13. If yes, what specific areas did they receive training in?</p>
      )}

      {requiresPdcTrainingAreas(value.pdcTrainingReceived) && (
        <MultiCheckboxGroup
          legend="Q13. If yes, what specific areas did they receive training in?"
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
        label="Q14. How effective are the PDC members in fulfilling their responsibilities?"
        htmlFor="pdcEffectivenessRating"
        required
        error={errors.pdcEffectivenessRating}
      >
        <FormSelect
          id="pdcEffectivenessRating"
          value={value.pdcEffectivenessRating}
          onChange={(next) => patch({ pdcEffectivenessRating: next })}
          options={PDC_EFFECTIVENESS_OPTIONS}
          placeholder="Select rating…"
          required
        />
      </FormField>
    </FormSection>
  );
}
