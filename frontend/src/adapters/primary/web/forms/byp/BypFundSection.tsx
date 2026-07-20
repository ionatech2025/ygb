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
      <FormField label="Q1. Fund receipt duration" htmlFor="fundReceiptDuration" required error={errors.fundReceiptDuration}>
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
          label="Please specify duration"
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
        label="Q2. Received actual amount requested?"
        value={value.receivedActualAmountRequested}
        onChange={(choice) => patch({ receivedActualAmountRequested: choice })}
        required
        error={errors.receivedActualAmountRequested}
      />

      <FormField label="Q3. Cash amount received (UGX)" htmlFor="cashAmountReceived" required error={errors.cashAmountReceived}>
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

      <FormField label="Q4. Instalment period" htmlFor="instalmentPeriod" required error={errors.instalmentPeriod}>
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
          label="Please specify instalment period"
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
