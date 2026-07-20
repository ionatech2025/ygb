import { BDS_SERVICE_OPTIONS, type BypFormFields } from '../../../../../core/domain/byp-form.model';
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
        label="Q8. Did you receive business development services?"
        value={value.receivedBds}
        onChange={(choice) =>
          patch({
            receivedBds: choice,
            bdsServices: choice ? value.bdsServices : [],
          })
        }
        required
        error={errors.receivedBds}
      />

      {value.receivedBds === true && (
        <MultiCheckboxGroup
          legend="Select services received"
          options={BDS_SERVICE_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          selected={value.bdsServices}
          onChange={(selected) => patch({ bdsServices: selected as BypFormFields['bdsServices'] })}
          required
          error={errors.bdsServices}
        />
      )}
    </FormSection>
  );
}
