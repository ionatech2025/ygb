import type { PcFormFields } from '../../../../../core/domain/pc-form.model';
import { FormField, formControlClassName, FormSection, NarrativeTextarea, YesNoRadioGroup } from '../../components/forms';

export interface PcAccessSectionProps {
  value: PcFormFields;
  onChange: (value: PcFormFields) => void;
  errors: Record<string, string>;
}

export function PcAccessSection({ value, onChange, errors }: PcAccessSectionProps) {
  const patch = (partial: Partial<PcFormFields>) => onChange({ ...value, ...partial });

  return (
    <FormSection title="Access to PDM Fund" description="Section B — Questions 3–8">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Q3. Total number of beneficiaries in the Parish/Ward"
          htmlFor="totalBeneficiaries"
          required
          error={errors.totalBeneficiaries}
        >
          <input
            id="totalBeneficiaries"
            type="text"
            inputMode="numeric"
            value={value.totalBeneficiaries}
            onChange={(e) => patch({ totalBeneficiaries: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>

        <FormField
          label="Q4. Total number of beneficiaries under 30 who benefited from the PDM fund"
          htmlFor="youthBeneficiaries"
          required
          error={errors.youthBeneficiaries}
        >
          <input
            id="youthBeneficiaries"
            type="text"
            inputMode="numeric"
            value={value.youthBeneficiaries}
            onChange={(e) => patch({ youthBeneficiaries: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>

        <FormField
          label="Q5. Total number of young women under 30 who benefited from the PDM fund"
          htmlFor="youngWomenBeneficiaries"
          required
          error={errors.youngWomenBeneficiaries}
        >
          <input
            id="youngWomenBeneficiaries"
            type="text"
            inputMode="numeric"
            value={value.youngWomenBeneficiaries}
            onChange={(e) => patch({ youngWomenBeneficiaries: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>

        <FormField
          label="Q6. Total number of young men under 30 who benefited from the PDM fund"
          htmlFor="youngMenBeneficiaries"
          required
          error={errors.youngMenBeneficiaries}
        >
          <input
            id="youngMenBeneficiaries"
            type="text"
            inputMode="numeric"
            value={value.youngMenBeneficiaries}
            onChange={(e) => patch({ youngMenBeneficiaries: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>
      </div>

      <NarrativeTextarea
        id="obstaclesDescription"
        label="Q7. What obstacles constrain the ability of the beneficiaries to access the benefits of the programme?"
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
        label="Q8. Is spending targeted to those most in need?"
        value={value.spendingTargetedToMostInNeed}
        onChange={(choice) => patch({ spendingTargetedToMostInNeed: choice })}
        required
        error={errors.spendingTargetedToMostInNeed}
      />
    </FormSection>
  );
}
