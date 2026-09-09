import { Download, FileDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  downloadHubPath,
  type ToolDownloadDataset,
} from '../../../../core/domain/tool-field-download.model';
import { publicDashboardClasses } from '../../../../core/domain/public-dashboard.theme';

export interface PublicDownloadHubCtaProps {
  /** When set, deep-links the hub with that tool preselected. Omit for the general hub (e.g. PDM charts). */
  dataset?: ToolDownloadDataset | null;
  layout?: 'card' | 'inline';
  title?: string;
  description?: string;
}

export function PublicDownloadHubCta({
  dataset = null,
  layout = 'card',
  title = 'Download field data',
  description = 'Choose a questionnaire tool, optionally filter by location and demographics, then export CSV or Excel from the Download hub.',
}: PublicDownloadHubCtaProps) {
  const href = downloadHubPath(dataset);
  const content = (
    <>
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-brand/15 p-2 text-brand">
          <Download className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-text">{title}</p>
          <p className="mt-1 text-xs leading-relaxed text-text-muted sm:text-sm">{description}</p>
        </div>
      </div>
      <Link
        to={href}
        data-testid="public-download-hub-cta-link"
        className={`${publicDashboardClasses.exportButton} ${publicDashboardClasses.exportButtonPrimary} mt-4 w-full sm:w-auto`}
      >
        <FileDown className="h-4 w-4" aria-hidden="true" />
        Open Download hub
      </Link>
    </>
  );

  if (layout === 'inline') {
    return (
      <div
        className="rounded-2xl border border-border/80 bg-surface-muted/40 p-4 sm:p-5"
        data-testid="public-download-hub-cta"
      >
        {content}
      </div>
    );
  }

  return (
    <section
      aria-label="Download field data"
      className={`${publicDashboardClasses.panel} p-5 sm:p-6`}
      data-testid="public-download-hub-cta"
    >
      {content}
    </section>
  );
}
