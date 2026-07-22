import { Link } from 'react-router-dom';
import { PDM_RESOURCE_PAGES } from '../../../../core/content/pdmPublicInfoSections';

export function PdmResourcesIndexPage() {
  return (
    <main className="min-h-screen bg-surface-muted">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Public Resources</p>
          <h1 className="mt-2 text-3xl font-bold text-text">PDM Information & Resources</h1>
          <p className="mt-3 max-w-3xl text-text-muted">
            Read-only programme context for the Parish Development Model. These pages are open to everyone — no account
            is required.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {PDM_RESOURCE_PAGES.map((page) => (
            <Link
              key={page.slug}
              to={`/resources/${page.slug}`}
              className="rounded-lg border border-border bg-surface p-5 shadow-sm transition hover:border-brand hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-text">{page.title}</h2>
              <p className="mt-2 text-sm leading-6 text-text-muted">{page.summary}</p>
              <span className="mt-4 inline-block text-sm font-medium text-brand">Read more →</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
