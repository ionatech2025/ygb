import {
  DIFFICULTIES_FACED_OPTIONS,
  requiresLimitationExplanation,
  type IypFormFields,
} from '../../../../../core/domain/iyp-form.model';
import { FormField, formControlClassName, FormSection, MultiCheckboxGroup } from '../../components/forms';

export interface IypBarriersSectionProps {
  value: IypFormFields;
  onChange: (value: IypFormFields) => void;
  errors: Record<string, string>;
}

export function IypBarriersSection({ value, onChange, errors }: IypBarriersSectionProps) {
  const patch = (partial: Partial<IypFormFields>) => onChange({ ...value, ...partial });

  return (
    <FormSection title="Access barriers" description="Question 10">
      <MultiCheckboxGroup
        legend="Q10. What difficulties did you face?"
        options={DIFFICULTIES_FACED_OPTIONS.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
        selected={value.difficultiesFaced}
        onChange={(selected) =>
          patch({
            difficultiesFaced: selected as IypFormFields['difficultiesFaced'],
            limitationExplanation: selected.includes('LIMITATION_IN_AMOUNT')
              ? value.limitationExplanation
              : '',
          })
        }
        error={errors.difficultiesFaced}
      />

      {requiresLimitationExplanation(value.difficultiesFaced) && (
        <FormField
          label="Explain the limitation in amount applied for"
          htmlFor="limitationExplanation"
          required
          error={errors.limitationExplanation}
        >
          <textarea
            id="limitationExplanation"
            value={value.limitationExplanation}
            onChange={(e) => patch({ limitationExplanation: e.target.value })}
            rows={3}
            className={`${formControlClassName} resize-y min-h-[5rem]`}
            required
          />
        </FormField>
      )}
    </FormSection>
  );
}
