import {
  IYP_OTHERS_OPTION_VALUE,
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
    <FormSection title="Section B: Application & access to PDM funds" description="Questions 6–9">
      <YesNoRadioGroup
        name="appliedForFund"
        label="Q6. Have you applied for the PDM fund?"
        value={value.appliedForFund}
        onChange={(choice) =>
          patch({
            appliedForFund: choice,
            accessedFund: choice ? value.accessedFund : null,
            rejectionNarrative: choice ? value.rejectionNarrative : '',
            reasonsForNotApplying: choice ? [] : value.reasonsForNotApplying,
            reasonsForNotApplyingOthersSpecify: choice ? '' : value.reasonsForNotApplyingOthersSpecify,
          })
        }
        required
        error={errors.appliedForFund}
      />

      {requiresAccessedFund(value.appliedForFund) && (
        <YesNoRadioGroup
          name="accessedFund"
          label="Q7. Did you access the PDM fund after your application?"
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
          label="Q8. Please explain why you were rejected"
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
          legend="Q9. What were the reasons for not applying for the PDM fund?"
          hint="(select all that apply)"
          options={REASONS_FOR_NOT_APPLYING_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          selected={value.reasonsForNotApplying}
          onChange={(selected) =>
            patch({
              reasonsForNotApplying: selected as IypFormFields['reasonsForNotApplying'],
              reasonsForNotApplyingOthersSpecify: selected.includes(IYP_OTHERS_OPTION_VALUE)
                ? value.reasonsForNotApplyingOthersSpecify
                : '',
            })
          }
          otherOptionValue={IYP_OTHERS_OPTION_VALUE}
          otherSpecifyValue={value.reasonsForNotApplyingOthersSpecify}
          onOtherSpecifyChange={(text) => patch({ reasonsForNotApplyingOthersSpecify: text })}
          otherSpecifyLabel="Please specify why you did not apply for the PDM fund"
          otherSpecifyError={errors.reasonsForNotApplyingOthersSpecify}
          required
          error={errors.reasonsForNotApplying}
        />
      )}
    </FormSection>
  );
}
