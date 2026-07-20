import {
  fiscalYearFieldId,
  LGO_FISCAL_YEAR_LABELS,
  createEmptyFiscalYearRecord,
  type FiscalYearRecordFields,
  type LgoFormFields,
} from '../../../../../core/domain/lgo-form.model';
import { FormField, formControlClassName, FormSection } from '../../components/forms';

export interface LgoFiscalYearSectionProps {
  value: LgoFormFields;
  onChange: (value: LgoFormFields) => void;
  errors: Record<string, string>;
}

function FiscalYearFields({
  record,
  onChange,
  errors,
}: {
  record: FiscalYearRecordFields;
  onChange: (record: FiscalYearRecordFields) => void;
  errors: Record<string, string>;
}) {
  const patch = (partial: Partial<FiscalYearRecordFields>) => onChange({ ...record, ...partial });
  const fy = record.fiscalYearLabel;

  return (
    <article className="rounded-xl border border-border bg-surface-muted/40 p-4 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label={`Q1. Expected funds (FY ${fy})`}
          htmlFor={fiscalYearFieldId(fy, 'expectedFunds')}
          required
          error={errors[fiscalYearFieldId(fy, 'expectedFunds')]}
        >
          <input
            id={fiscalYearFieldId(fy, 'expectedFunds')}
            type="text"
            inputMode="numeric"
            value={record.expectedFunds}
            onChange={(e) => patch({ expectedFunds: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>

        <FormField
          label={`Q1. Actual funds received (FY ${fy})`}
          htmlFor={fiscalYearFieldId(fy, 'actualFunds')}
          required
          error={errors[fiscalYearFieldId(fy, 'actualFunds')]}
        >
          <input
            id={fiscalYearFieldId(fy, 'actualFunds')}
            type="text"
            inputMode="numeric"
            value={record.actualFunds}
            onChange={(e) => patch({ actualFunds: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <FormField
          label={`Q2. Total beneficiaries (FY ${fy})`}
          htmlFor={fiscalYearFieldId(fy, 'totalBeneficiaryCount')}
          required
          error={errors[fiscalYearFieldId(fy, 'totalBeneficiaryCount')]}
        >
          <input
            id={fiscalYearFieldId(fy, 'totalBeneficiaryCount')}
            type="text"
            inputMode="numeric"
            value={record.totalBeneficiaryCount}
            onChange={(e) => patch({ totalBeneficiaryCount: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>

        <FormField
          label={`Q2. Young people under 30 (FY ${fy})`}
          htmlFor={fiscalYearFieldId(fy, 'youngPeopleCount')}
          required
          error={errors[fiscalYearFieldId(fy, 'youngPeopleCount')]}
        >
          <input
            id={fiscalYearFieldId(fy, 'youngPeopleCount')}
            type="text"
            inputMode="numeric"
            value={record.youngPeopleCount}
            onChange={(e) => patch({ youngPeopleCount: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>

        <FormField
          label={`Q2. Young women under 30 (FY ${fy})`}
          htmlFor={fiscalYearFieldId(fy, 'youngWomenCount')}
          required
          error={errors[fiscalYearFieldId(fy, 'youngWomenCount')]}
        >
          <input
            id={fiscalYearFieldId(fy, 'youngWomenCount')}
            type="text"
            inputMode="numeric"
            value={record.youngWomenCount}
            onChange={(e) => patch({ youngWomenCount: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label={`Q3. Total parishes (FY ${fy})`}
          htmlFor={fiscalYearFieldId(fy, 'totalParishesCount')}
          required
          error={errors[fiscalYearFieldId(fy, 'totalParishesCount')]}
        >
          <input
            id={fiscalYearFieldId(fy, 'totalParishesCount')}
            type="text"
            inputMode="numeric"
            value={record.totalParishesCount}
            onChange={(e) => patch({ totalParishesCount: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>

        <FormField
          label={`Q3. Parishes that received funds (FY ${fy})`}
          htmlFor={fiscalYearFieldId(fy, 'fundedParishesCount')}
          required
          error={errors[fiscalYearFieldId(fy, 'fundedParishesCount')]}
        >
          <input
            id={fiscalYearFieldId(fy, 'fundedParishesCount')}
            type="text"
            inputMode="numeric"
            value={record.fundedParishesCount}
            onChange={(e) => patch({ fundedParishesCount: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>
      </div>
    </article>
  );
}

export function LgoFiscalYearSection({ value, onChange, errors }: LgoFiscalYearSectionProps) {
  const patch = (partial: Partial<LgoFormFields>) => onChange({ ...value, ...partial });
  const hasSelection = value.selectedFiscalYearLabel !== '';

  return (
    <FormSection title="Financial & coverage data" description="Select one fiscal year, then complete questions 1–3">
      <FormField
        label="Fiscal year"
        htmlFor="selectedFiscalYearLabel"
        required
        error={errors.selectedFiscalYearLabel}
      >
        <select
          id="selectedFiscalYearLabel"
          value={value.selectedFiscalYearLabel}
          onChange={(e) => {
            const label = e.target.value;
            patch({
              selectedFiscalYearLabel: label,
              fiscalYearRecord: createEmptyFiscalYearRecord(label),
            });
          }}
          className={formControlClassName}
          required
        >
          <option value="">Select fiscal year…</option>
          {LGO_FISCAL_YEAR_LABELS.map((label) => (
            <option key={label} value={label}>
              FY {label}
            </option>
          ))}
        </select>
      </FormField>

      {hasSelection && (
        <FiscalYearFields
          record={value.fiscalYearRecord}
          onChange={(record) => patch({ fiscalYearRecord: record })}
          errors={errors}
        />
      )}
    </FormSection>
  );
}
