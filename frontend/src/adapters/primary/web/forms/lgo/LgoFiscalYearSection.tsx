import {
  fiscalYearFieldId,
  type FiscalYearRecordFields,
  type LgoFormFields,
} from '../../../../../core/domain/lgo-form.model';
import { FormField, formControlClassName, FormSection } from '../../components/forms';

export interface LgoFiscalYearSectionProps {
  value: LgoFormFields;
  onChange: (value: LgoFormFields) => void;
  errors: Record<string, string>;
  loading?: boolean;
  loadError?: string;
}

function FiscalYearFields({
  blockLabel,
  record,
  onChange,
  errors,
}: {
  blockLabel: string;
  record: FiscalYearRecordFields;
  onChange: (record: FiscalYearRecordFields) => void;
  errors: Record<string, string>;
}) {
  const patch = (partial: Partial<FiscalYearRecordFields>) => onChange({ ...record, ...partial });
  const fy = record.fiscalYearLabel;

  const fieldGridClassName = 'grid gap-4 sm:grid-cols-2 [&_label]:min-h-11';

  return (
    <article className="rounded-xl border border-border bg-surface-muted/40 p-4 space-y-5">
      <header>
        <h4 className="text-xs font-bold uppercase tracking-wide text-text">{blockLabel}</h4>
        <p className="mt-1 text-[11px] text-text-muted">Fiscal year {fy}</p>
      </header>

      <section className="space-y-3">
        <h5 className="text-[11px] font-bold uppercase tracking-wide text-text-muted">Q1. PDM funds received</h5>
        <div className={fieldGridClassName}>
        <FormField
          label="Q1(a). Expected PDM funds received"
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
          label="Q1(b). Actual PDM funds received"
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
      </section>

      <section className="space-y-3">
        <h5 className="text-[11px] font-bold uppercase tracking-wide text-text-muted">
          Q2. Beneficiaries from the PDM fund
        </h5>
        <div className={fieldGridClassName}>
        <FormField
          label="Q2(a). Total beneficiaries from the PDM fund"
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
          label="Q2(b). Beneficiaries under 30"
          htmlFor={fiscalYearFieldId(fy, 'beneficiariesUnder30Count')}
          required
          error={errors[fiscalYearFieldId(fy, 'beneficiariesUnder30Count')]}
        >
          <input
            id={fiscalYearFieldId(fy, 'beneficiariesUnder30Count')}
            type="text"
            inputMode="numeric"
            value={record.beneficiariesUnder30Count}
            onChange={(e) => patch({ beneficiariesUnder30Count: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>

        <FormField
          label="Q2(c). Beneficiary young women under 30"
          htmlFor={fiscalYearFieldId(fy, 'beneficiaryYoungWomenCount')}
          required
          error={errors[fiscalYearFieldId(fy, 'beneficiaryYoungWomenCount')]}
        >
          <input
            id={fiscalYearFieldId(fy, 'beneficiaryYoungWomenCount')}
            type="text"
            inputMode="numeric"
            value={record.beneficiaryYoungWomenCount}
            onChange={(e) => patch({ beneficiaryYoungWomenCount: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>

        <FormField
          label="Q2(d). Beneficiary young men under 30"
          htmlFor={fiscalYearFieldId(fy, 'beneficiaryYoungMenCount')}
          required
          error={errors[fiscalYearFieldId(fy, 'beneficiaryYoungMenCount')]}
        >
          <input
            id={fiscalYearFieldId(fy, 'beneficiaryYoungMenCount')}
            type="text"
            inputMode="numeric"
            value={record.beneficiaryYoungMenCount}
            onChange={(e) => patch({ beneficiaryYoungMenCount: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>
        </div>
      </section>

      <section className="space-y-3">
        <h5 className="text-[11px] font-bold uppercase tracking-wide text-text-muted">Q3. Parish coverage</h5>
        <div className={fieldGridClassName}>
        <FormField
          label="Q3(a). Total parishes in the district"
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
          label="Q3(b). Parishes that received PDM funds"
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
      </section>
    </article>
  );
}

export function LgoFiscalYearSection({
  value,
  onChange,
  errors,
  loading = false,
  loadError,
}: LgoFiscalYearSectionProps) {
  const patch = (partial: Partial<LgoFormFields>) => onChange({ ...value, ...partial });
  const hasReportingYear = value.reportingFiscalYearLabel !== '';

  return (
    <FormSection title="Financial & coverage data" description="Questions 1–3 (two-year comparison)">
      {loading && (
        <p className="text-sm text-text-muted" role="status">
          Loading active fiscal year…
        </p>
      )}

      {loadError && (
        <p className="text-sm text-rose-600" role="alert">
          {loadError}
        </p>
      )}

      {hasReportingYear && (
        <p className="rounded-xl border border-brand/20 bg-brand-light/30 px-3 py-2 text-sm text-text">
          Reporting for fiscal year:{' '}
          <strong>{value.reportingFiscalYearLabel}</strong>
        </p>
      )}

      {errors.reportingFiscalYearLabel && (
        <p className="text-[11px] text-rose-600" role="alert">
          {errors.reportingFiscalYearLabel}
        </p>
      )}

      {hasReportingYear && (
        <>
          <FiscalYearFields
            blockLabel="(a) Admin-set fiscal year"
            record={value.currentFiscalYearRecord}
            onChange={(record) => patch({ currentFiscalYearRecord: record })}
            errors={errors}
          />

          {value.priorFiscalYearLabel && value.priorFiscalYearRecord && (
            <FiscalYearFields
              blockLabel="(b) Prior fiscal year"
              record={value.priorFiscalYearRecord}
              onChange={(record) => patch({ priorFiscalYearRecord: record })}
              errors={errors}
            />
          )}
        </>
      )}
    </FormSection>
  );
}
