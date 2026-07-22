import type { SubmissionDetail } from '../../../../core/domain/submission-admin.model';
import {
  buildSubmissionDetailSections,
  formatAdminTimestamp,
  formatFinancialYearPeriodKey,
  formatFormTypeLabel,
  formatSubmissionStatus,
} from '../../../../core/domain/submission-detail-fields';

export interface SubmissionDetailViewProps {
  detail: SubmissionDetail;
}

export function SubmissionDetailView({ detail }: SubmissionDetailViewProps) {
  const sections = buildSubmissionDetailSections(detail.payload);

  return (
    <div className="space-y-6" data-testid="submission-detail-view">
      <section
        aria-label="Submission provenance"
        className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
      >
        <h2 className="mb-4 text-sm font-semibold text-text">Provenance &amp; sync</h2>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DetailItem label="Form type" value={formatFormTypeLabel(detail.payload.formType)} />
          <DetailItem label="Status" value={formatSubmissionStatus(detail.status)} />
          <DetailItem label="Collector" value={detail.collectorName} />
          <DetailItem label="Financial year period" value={formatFinancialYearPeriodKey(detail.financialYearPeriod)} />
          <DetailItem label="Completed at" value={formatAdminTimestamp(detail.formCompletedAt)} />
          <DetailItem label="Synced at" value={formatAdminTimestamp(detail.syncedAt)} />
          <DetailItem label="Device submission ID" value={String(detail.payload.deviceSubmissionId ?? '—')} />
        </dl>
      </section>

      {sections.map((section) => (
        <section
          key={section.title}
          aria-label={section.title}
          className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
        >
          <h2 className="mb-4 text-sm font-semibold text-text">{section.title}</h2>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {section.rows.map((row) => (
              <DetailItem key={row.label} label={row.label} value={row.value} />
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-text-muted">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-sm text-text">{value}</dd>
    </div>
  );
}
