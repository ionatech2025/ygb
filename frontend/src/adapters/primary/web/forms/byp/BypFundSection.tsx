import {
  FUND_RECEIPT_DURATION_OPTIONS,
  requiresFundDurationSpecify,
  type BypFormFields,
} from '../../../../../core/domain/byp-form.model';
import {
  FormField,
  formControlClassName,
  FormSection,
  FormSelect,
  YesNoRadioGroup,
} from '../../components/forms';

export interface BypFundSectionProps {
  value: BypFormFields;
  onChange: (value: BypFormFields) => void;
  errors: Record<string, string>;
}

export function BypFundSection({ value, onChange, errors }: BypFundSectionProps) {
  const patch = (partial: Partial<BypFormFields>) => onChange({ ...value, ...partial });

  return (
    <FormSection title="Fund acquisition & disbursement" description="Questions 1–4 and fund use">
      <FormField
        label="Q1. How long did it take you to receive your funds?"
        htmlFor="fundReceiptDuration"
        required
        error={errors.fundReceiptDuration}
      >
        <FormSelect
          id="fundReceiptDuration"
          value={value.fundReceiptDuration}
          onChange={(next) =>
            patch({
              fundReceiptDuration: next as BypFormFields['fundReceiptDuration'],
              fundReceiptDurationSpecify: '',
            })
          }
          options={FUND_RECEIPT_DURATION_OPTIONS}
          placeholder="Select duration…"
          required
        />
      </FormField>

      {requiresFundDurationSpecify(value.fundReceiptDuration) && (
        <FormField
          label="Please specify how long it took to receive your funds"
          htmlFor="fundReceiptDurationSpecify"
          required
          error={errors.fundReceiptDurationSpecify}
          hint="Minimum 5 characters (e.g. 2 days)."
        >
          <input
            id="fundReceiptDurationSpecify"
            type="text"
            value={value.fundReceiptDurationSpecify}
            onChange={(e) => patch({ fundReceiptDurationSpecify: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>
      )}

      <YesNoRadioGroup
        name="receivedActualAmountRequested"
        label="Q2. Did you get the actual amount of money you requested?"
        value={value.receivedActualAmountRequested}
        onChange={(choice) => patch({ receivedActualAmountRequested: choice })}
        required
        error={errors.receivedActualAmountRequested}
      />

      <FormField
        label="Q3. How much cash did you get?"
        htmlFor="cashAmountReceived"
        required
        error={errors.cashAmountReceived}
      >
        <input
          id="cashAmountReceived"
          type="number"
          min={0}
          inputMode="numeric"
          value={value.cashAmountReceived}
          onChange={(e) =>
            patch({ cashAmountReceived: e.target.value === '' ? '' : Number(e.target.value) })
          }
          className={formControlClassName}
          required
        />
      </FormField>

      <FormField
        label="Q4. How long did it take you to receive the PDM funds after you applied?"
        htmlFor="fundsReceiptWaitAfterApplied"
        required
        error={errors.fundsReceiptWaitAfterApplied}
        hint="Minimum 5 characters (e.g. 2 days)."
      >
        <textarea
          id="fundsReceiptWaitAfterApplied"
          value={value.fundsReceiptWaitAfterApplied}
          onChange={(e) => patch({ fundsReceiptWaitAfterApplied: e.target.value })}
          rows={4}
          className={`${formControlClassName} min-h-[6rem] resize-y`}
          required
        />
      </FormField>

      <FormField
        label="What did you use the money for?"
        htmlFor="moneyUsedFor"
        required
        error={errors.moneyUsedFor}
        hint="Minimum 10 characters."
      >
        <textarea
          id="moneyUsedFor"
          value={value.moneyUsedFor}
          onChange={(e) => patch({ moneyUsedFor: e.target.value })}
          rows={4}
          className={`${formControlClassName} min-h-[6rem] resize-y`}
          required
        />
      </FormField>
    </FormSection>
  );
}
