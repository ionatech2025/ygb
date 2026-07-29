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
        label="Q4. Is the central government's commitment to PDM reflected in transfers to the district/city/sub-county/town council?"
        value={value.fundsAllocatedEquitably}
        onChange={(choice) => patch({ fundsAllocatedEquitably: choice })}
        required
        error={errors.fundsAllocatedEquitably}
      />

      <YesNoRadioGroup
        name="allocatedFundsSufficient"
        label="Q5. Is enough fund being allocated to and spent on the PDM Programme?"
        value={value.allocatedFundsSufficient}
        onChange={(choice) => patch({ allocatedFundsSufficient: choice })}
        required
        error={errors.allocatedFundsSufficient}
      />

      <YesNoRadioGroup
        name="adequateUtilisationOversight"
        label="Q6. Should there be an increment in allocation to the PDM fund in the district/city/sub-county/town council?"
        value={value.adequateUtilisationOversight}
        onChange={(choice) => patch({ adequateUtilisationOversight: choice })}
        required
        error={errors.adequateUtilisationOversight}
      />

      <YesNoRadioGroup
        name="transparentBeneficiarySelection"
        label="Q7. Are resources distributed equitably according to the size of population in a given parish in the district/city/sub-county/town council?"
        value={value.transparentBeneficiarySelection}
        onChange={(choice) => patch({ transparentBeneficiarySelection: choice })}
        required
        error={errors.transparentBeneficiarySelection}
      />
    </FormSection>
  );
}
