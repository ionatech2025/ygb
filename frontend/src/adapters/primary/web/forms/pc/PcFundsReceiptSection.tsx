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
    <FormSection title="PDM Funds Receipt" description="Amounts and beneficiary counts">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Amount expected (UGX)" htmlFor="amountExpected" required error={errors.amountExpected}>
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

        <FormField label="Amount received (UGX)" htmlFor="amountReceived" required error={errors.amountReceived}>
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

      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="Total beneficiaries" htmlFor="totalBeneficiaries" required error={errors.totalBeneficiaries}>
          <input
            id="totalBeneficiaries"
            type="text"
            inputMode="numeric"
            value={value.totalBeneficiaries}
            onChange={(e) => patch({ totalBeneficiaries: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>

        <FormField label="Young people under 30" htmlFor="youthBeneficiaries" required error={errors.youthBeneficiaries}>
          <input
            id="youthBeneficiaries"
            type="text"
            inputMode="numeric"
            value={value.youthBeneficiaries}
            onChange={(e) => patch({ youthBeneficiaries: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>

        <FormField
          label="Young women under 30"
          htmlFor="youngWomenBeneficiaries"
          required
          error={errors.youngWomenBeneficiaries}
        >
          <input
            id="youngWomenBeneficiaries"
            type="text"
            inputMode="numeric"
            value={value.youngWomenBeneficiaries}
            onChange={(e) => patch({ youngWomenBeneficiaries: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>
      </div>
    </FormSection>
  );
}
