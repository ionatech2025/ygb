import type { Rating } from '../../../../../core/domain/form-validation.model';
import {
  LOAN_REPAYMENT_DURATION_OPTIONS,
  requiresLoanRepaymentDuration,
  type BypFormFields,
} from '../../../../../core/domain/byp-form.model';
import { FormField, FormSection, FormSelect, RatingSelect, YesNoRadioGroup } from '../../components/forms';

export interface BypRatingSectionProps {
  value: BypFormFields;
  onChange: (value: BypFormFields) => void;
  errors: Record<string, string>;
}

export function BypRatingSection({ value, onChange, errors }: BypRatingSectionProps) {
  const patch = (partial: Partial<BypFormFields>) => onChange({ ...value, ...partial });

  return (
    <FormSection title="Service quality & governance" description="Questions 5–7">
      <RatingSelect
        id="serviceRating"
        label="Q5. How would you rate the quality of services provided by the Parish Chief/Town Agent and Parish Development Committee (PDC) at the parish or ward level?"
        value={value.serviceRating}
        onChange={(rating: Rating) => patch({ serviceRating: rating })}
        required
        error={errors.serviceRating}
      />

      <YesNoRadioGroup
        name="loanRepaid"
        label="Have you repaid the loan?"
        value={value.loanRepaid}
        onChange={(choice) =>
          patch({
            loanRepaid: choice,
            loanRepaymentDuration: choice === true ? value.loanRepaymentDuration : '',
          })
        }
        required
        error={errors.loanRepaid}
      />

      {requiresLoanRepaymentDuration(value.loanRepaid) && (
        <FormField
          label="How long did it take you to repay?"
          htmlFor="loanRepaymentDuration"
          required
          error={errors.loanRepaymentDuration}
        >
          <FormSelect
            id="loanRepaymentDuration"
            value={value.loanRepaymentDuration}
            onChange={(next) =>
              patch({ loanRepaymentDuration: next as BypFormFields['loanRepaymentDuration'] })
            }
            options={LOAN_REPAYMENT_DURATION_OPTIONS}
            placeholder="Select repayment duration…"
            required
          />
        </FormField>
      )}

      <RatingSelect
        id="performanceRating"
        label="Q6. What do you think about the performance of PDM in this parish?"
        value={value.performanceRating}
        onChange={(rating: Rating) => patch({ performanceRating: rating })}
        required
        error={errors.performanceRating}
      />
      <YesNoRadioGroup
        name="groupOrganizedTransparently"
        label="Q7. Do you think your group was organized transparently?"
        value={value.groupOrganizedTransparently}
        onChange={(choice) => patch({ groupOrganizedTransparently: choice })}
        required
        error={errors.groupOrganizedTransparently}
      />
    </FormSection>
  );
}
