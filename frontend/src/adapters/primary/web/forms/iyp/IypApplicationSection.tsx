import {
  REASONS_FOR_NOT_APPLYING_OPTIONS,
  requiresAccessedFund,
  requiresAppliedQuestions,
  requiresReasonsForNotApplying,
  requiresRejectionNarrative,
  type IypFormFields,
} from '../../../../../core/domain/iyp-form.model';
import { FormSection, MultiCheckboxGroup, NarrativeTextarea, YesNoRadioGroup } from '../../components/forms';

export interface IypApplicationSectionProps {
  value: IypFormFields;
  onChange: (value: IypFormFields) => void;
  errors: Record<string, string>;
}

export function IypApplicationSection({ value, onChange, errors }: IypApplicationSectionProps) {
  const patch = (partial: Partial<IypFormFields>) => onChange({ ...value, ...partial });

  if (!requiresAppliedQuestions(value.awareOfPdm)) {
    return null;
  }

  return (
    <FormSection title="Application status" description="Questions 6–9">
      <YesNoRadioGroup
        name="appliedForFund"
        label="Q6. Did you apply for the PDM fund?"
        value={value.appliedForFund}
        onChange={(choice) =>
          patch({
            appliedForFund: choice,
            accessedFund: choice ? value.accessedFund : null,
            rejectionNarrative: choice ? value.rejectionNarrative : '',
            reasonsForNotApplying: choice ? [] : value.reasonsForNotApplying,
          })
        }
        required
        error={errors.appliedForFund}
      />

      {requiresAccessedFund(value.appliedForFund) && (
        <YesNoRadioGroup
          name="accessedFund"
          label="Q7. Did you access the fund after applying?"
          value={value.accessedFund}
          onChange={(choice) =>
            patch({
              accessedFund: choice,
              rejectionNarrative: choice ? '' : value.rejectionNarrative,
            })
          }
          required
          error={errors.accessedFund}
        />
      )}

      {requiresRejectionNarrative(value.appliedForFund, value.accessedFund) && (
        <NarrativeTextarea
          id="rejectionNarrative"
          label="Q8. Narrate why the application was not successful"
          value={value.rejectionNarrative}
          onChange={(text) => patch({ rejectionNarrative: text })}
          required
        />
      )}
      {errors.rejectionNarrative && (
        <p className="text-[11px] text-rose-600" role="alert">
          {errors.rejectionNarrative}
        </p>
      )}

      {requiresReasonsForNotApplying(value.appliedForFund) && (
        <MultiCheckboxGroup
          legend="Q9. Reasons for not applying"
          options={REASONS_FOR_NOT_APPLYING_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          selected={value.reasonsForNotApplying}
          onChange={(selected) =>
            patch({ reasonsForNotApplying: selected as IypFormFields['reasonsForNotApplying'] })
          }
          required
          error={errors.reasonsForNotApplying}
        />
      )}
    </FormSection>
  );
}
