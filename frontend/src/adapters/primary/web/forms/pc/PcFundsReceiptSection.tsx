import type { PcFormFields } from '../../../../../core/domain/pc-form.model';
import { FormField, formControlClassName, FormSection } from '../../components/forms';

export interface PcFundsReceiptSectionProps {
  value: PcFormFields;
  onChange: (value: PcFormFields) => void;
  errors: Record<string, string>;
}

export function PcFundsReceiptSection({ value, onChange, errors }: PcFundsReceiptSectionProps) {
  const patch = (partial: Partial<PcFormFields>) => onChange({ ...value, ...partial });

  return (
    <FormSection title="PDM Funds Receipt by the Parish" description="Section A — Questions 1–2">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Q1. Amount of PDM fund expected by the Parish/Ward (UGX)"
          htmlFor="amountExpected"
          required
          error={errors.amountExpected}
        >
          <input
            id="amountExpected"
            type="text"
            inputMode="numeric"
            value={value.amountExpected}
            onChange={(e) => patch({ amountExpected: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>

        <FormField
          label="Q2. Actual amount PDM fund received by the Parish/Ward (UGX)"
          htmlFor="amountReceived"
          required
          error={errors.amountReceived}
        >
          <input
            id="amountReceived"
            type="text"
            inputMode="numeric"
            value={value.amountReceived}
            onChange={(e) => patch({ amountReceived: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>
      </div>
    </FormSection>
  );
}
