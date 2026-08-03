import {
  BDS_OTHERS_OPTION_VALUE,
  BDS_SERVICE_OPTIONS,
  type BypFormFields,
} from '../../../../../core/domain/byp-form.model';
import { FormSection, MultiCheckboxGroup, YesNoRadioGroup } from '../../components/forms';

export interface BypBdsSectionProps {
  value: BypFormFields;
  onChange: (value: BypFormFields) => void;
  errors: Record<string, string>;
}

export function BypBdsSection({ value, onChange, errors }: BypBdsSectionProps) {
  const patch = (partial: Partial<BypFormFields>) => onChange({ ...value, ...partial });

  return (
    <FormSection title="Business development services" description="Question 8">
      <YesNoRadioGroup
        name="receivedBds"
        label="Q8. Did you receive any business development services? If yes, specify:"
        value={value.receivedBds}
        onChange={(choice) =>
          patch({
            receivedBds: choice,
            bdsServices: choice ? value.bdsServices : [],
            bdsServicesOthersSpecify: choice ? value.bdsServicesOthersSpecify : '',
          })
        }
        required
        error={errors.receivedBds}
      />

      {value.receivedBds === true && (
        <MultiCheckboxGroup
          legend="Select the business development services you received"
          hint="(select all that apply)"
          options={BDS_SERVICE_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          selected={value.bdsServices}
          onChange={(selected) =>
            patch({
              bdsServices: selected as BypFormFields['bdsServices'],
              bdsServicesOthersSpecify: selected.includes(BDS_OTHERS_OPTION_VALUE)
                ? value.bdsServicesOthersSpecify
                : '',
            })
          }
          otherOptionValue={BDS_OTHERS_OPTION_VALUE}
          otherSpecifyValue={value.bdsServicesOthersSpecify}
          onOtherSpecifyChange={(text) => patch({ bdsServicesOthersSpecify: text })}
          otherSpecifyLabel="Please specify the other business development service"
          otherSpecifyError={errors.bdsServicesOthersSpecify}
          required
          error={errors.bdsServices}
        />
      )}
    </FormSection>
  );
}
