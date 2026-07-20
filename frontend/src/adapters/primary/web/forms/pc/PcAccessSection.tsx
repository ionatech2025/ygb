import type { PcFormFields } from '../../../../../core/domain/pc-form.model';
import { FormSection, NarrativeTextarea, YesNoRadioGroup } from '../../components/forms';

export interface PcAccessSectionProps {
  value: PcFormFields;
  onChange: (value: PcFormFields) => void;
  errors: Record<string, string>;
}

export function PcAccessSection({ value, onChange, errors }: PcAccessSectionProps) {
  const patch = (partial: Partial<PcFormFields>) => onChange({ ...value, ...partial });

  return (
    <FormSection title="Access to PDM Fund" description="Obstacles and targeting">
      <NarrativeTextarea
        id="obstaclesDescription"
        label="Obstacles faced in accessing the fund"
        value={value.obstaclesDescription}
        onChange={(text) => patch({ obstaclesDescription: text })}
        required
      />
      {errors.obstaclesDescription && (
        <p className="text-[11px] text-rose-600" role="alert">
          {errors.obstaclesDescription}
        </p>
      )}

      <YesNoRadioGroup
        name="spendingTargetedToMostInNeed"
        label="Was spending targeted to those most in need?"
        value={value.spendingTargetedToMostInNeed}
        onChange={(choice) => patch({ spendingTargetedToMostInNeed: choice })}
        required
        error={errors.spendingTargetedToMostInNeed}
      />
    </FormSection>
  );
}
