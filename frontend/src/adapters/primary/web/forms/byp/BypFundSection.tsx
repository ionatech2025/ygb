import {
  FUND_RECEIPT_DURATION_OPTIONS,
  requiresFundDurationSpecify,
  requiresInstalmentSpecify,
  INSTALMENT_PERIOD_OPTIONS,
  type BypFormFields,
} from '../../../../../core/domain/byp-form.model';
import { FormField, formControlClassName, FormSection, YesNoRadioGroup } from '../../components/forms';

export interface BypFundSectionProps {
  value: BypFormFields;
  onChange: (value: BypFormFields) => void;
  errors: Record<string, string>;
}

export function BypFundSection({ value, onChange, errors }: BypFundSectionProps) {
  const patch = (partial: Partial<BypFormFields>) => onChange({ ...value, ...partial });

  return (
    <FormSection title="Fund acquisition & disbursement" description="Questions 1–4">
      <FormField
        label="Q1. How long did it take you to receive your funds?"
        htmlFor="fundReceiptDuration"
        required
        error={errors.fundReceiptDuration}
      >
        <select
          id="fundReceiptDuration"
          value={value.fundReceiptDuration}
          onChange={(e) =>
            patch({
              fundReceiptDuration: e.target.value as BypFormFields['fundReceiptDuration'],
              fundReceiptDurationSpecify: '',
            })
          }
          className={formControlClassName}
          required
        >
          <option value="">Select duration…</option>
          {FUND_RECEIPT_DURATION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      {requiresFundDurationSpecify(value.fundReceiptDuration) && (
        <FormField
          label="Please specify how long it took to receive your funds"
          htmlFor="fundReceiptDurationSpecify"
          required
          error={errors.fundReceiptDurationSpecify}
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
        label="Q4. What is the instalment period for receiving funds?"
        htmlFor="instalmentPeriod"
        required
        error={errors.instalmentPeriod}
        hint="This refers to how often you receive PDM funds, not how you repay a loan."
      >
        <select
          id="instalmentPeriod"
          value={value.instalmentPeriod}
          onChange={(e) =>
            patch({
              instalmentPeriod: e.target.value as BypFormFields['instalmentPeriod'],
              instalmentPeriodSpecify: '',
            })
          }
          className={formControlClassName}
          required
        >
          <option value="">Select period…</option>
          {INSTALMENT_PERIOD_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      {requiresInstalmentSpecify(value.instalmentPeriod) && (
        <FormField
          label="Please specify the instalment period for receiving funds"
          htmlFor="instalmentPeriodSpecify"
          required
          error={errors.instalmentPeriodSpecify}
        >
          <input
            id="instalmentPeriodSpecify"
            type="text"
            value={value.instalmentPeriodSpecify}
            onChange={(e) => patch({ instalmentPeriodSpecify: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>
      )}
    </FormSection>
  );
}
