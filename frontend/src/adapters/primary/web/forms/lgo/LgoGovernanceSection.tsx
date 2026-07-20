import type { LgoFormFields } from '../../../../../core/domain/lgo-form.model';
import { FormSection, YesNoRadioGroup } from '../../components/forms';

export interface LgoGovernanceSectionProps {
  value: LgoFormFields;
  onChange: (value: LgoFormFields) => void;
  errors: Record<string, string>;
}

export function LgoGovernanceSection({ value, onChange, errors }: LgoGovernanceSectionProps) {
  const patch = (partial: Partial<LgoFormFields>) => onChange({ ...value, ...partial });

  return (
    <FormSection title="Governance assessment" description="Questions 4–7">
      <YesNoRadioGroup
        name="fundsAllocatedEquitably"
        label="Q4. Were PDM funds allocated equitably across parishes?"
        value={value.fundsAllocatedEquitably}
        onChange={(choice) => patch({ fundsAllocatedEquitably: choice })}
        required
        error={errors.fundsAllocatedEquitably}
      />

      <YesNoRadioGroup
        name="allocatedFundsSufficient"
        label="Q5. Were the allocated funds sufficient for programme objectives?"
        value={value.allocatedFundsSufficient}
        onChange={(choice) => patch({ allocatedFundsSufficient: choice })}
        required
        error={errors.allocatedFundsSufficient}
      />

      <YesNoRadioGroup
        name="adequateUtilisationOversight"
        label="Q6. Was there adequate oversight of fund utilisation?"
        value={value.adequateUtilisationOversight}
        onChange={(choice) => patch({ adequateUtilisationOversight: choice })}
        required
        error={errors.adequateUtilisationOversight}
      />

      <YesNoRadioGroup
        name="transparentBeneficiarySelection"
        label="Q7. Were beneficiary selection processes transparent?"
        value={value.transparentBeneficiarySelection}
        onChange={(choice) => patch({ transparentBeneficiarySelection: choice })}
        required
        error={errors.transparentBeneficiarySelection}
      />
    </FormSection>
  );
}
