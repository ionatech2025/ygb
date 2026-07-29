import {
  DIFFICULTIES_FACED_OPTIONS,
  IYP_OTHERS_OPTION_VALUE,
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
    <FormSection title="Section B (continued): Access barriers" description="Question 10">
      <MultiCheckboxGroup
        legend="Q10. What kind of difficulties have you faced in accessing the PDM fund in your parish?"
        hint="(select all that apply)"
        options={DIFFICULTIES_FACED_OPTIONS.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
        selected={value.difficultiesFaced}
        onChange={(selected) =>
          patch({
            difficultiesFaced: selected as IypFormFields['difficultiesFaced'],
            difficultiesFacedOthersSpecify: selected.includes(IYP_OTHERS_OPTION_VALUE)
              ? value.difficultiesFacedOthersSpecify
              : '',
            limitationExplanation: selected.includes('LIMITATION_IN_AMOUNT')
              ? value.limitationExplanation
              : '',
          })
        }
        otherOptionValue={IYP_OTHERS_OPTION_VALUE}
        otherSpecifyValue={value.difficultiesFacedOthersSpecify}
        onOtherSpecifyChange={(text) => patch({ difficultiesFacedOthersSpecify: text })}
        otherSpecifyLabel="Please specify the other difficulty faced"
        otherSpecifyError={errors.difficultiesFacedOthersSpecify}
        error={errors.difficultiesFaced}
      />

      {requiresLimitationExplanation(value.difficultiesFaced) && (
        <FormField
          label="Explain the limitation in the amount applied for"
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
