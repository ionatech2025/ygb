import { Link, Navigate, useParams } from 'react-router-dom';
import {
  extractHeadingAnchors,
  getPdmResourcePage,
  isPdmResourceSlug,
} from '../../../../core/content/pdmPublicInfoSections';
import { MarkdownContent } from './MarkdownContent';
import { getPdmResourceMarkdown } from './pdmResourceContent';

export function PdmResourceDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  if (!isPdmResourceSlug(slug)) {
    return <Navigate to="/resources" replace />;
  }

  const page = getPdmResourcePage(slug);
  const markdown = getPdmResourceMarkdown(slug);
  const anchors = extractHeadingAnchors(markdown);

  return (
    <main className="min-h-screen bg-surface-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 lg:flex-row lg:px-8">
        <article className="min-w-0 flex-1 rounded-lg border border-border bg-surface p-6 shadow-sm sm:p-8">
          <Link to="/resources" className="text-sm font-medium text-brand hover:underline">
            ← All resources
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-text">{page.title}</h1>
          <p className="mt-2 text-text-muted">{page.summary}</p>
          <div className="prose prose-slate mt-8 max-w-none">
            <MarkdownContent content={markdown} />
          </div>
        </article>

        {anchors.length > 0 ? (
          <aside className="lg:w-64 lg:shrink-0">
            <nav
              aria-label="On this page"
              className="sticky top-8 rounded-lg border border-border bg-surface p-4 shadow-sm"
            >
              <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">On this page</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {anchors.map((anchor) => (
                  <li key={anchor.id} className={anchor.level === 3 ? 'pl-3' : undefined}>
                    <a href={`#${anchor.id}`} className="text-brand hover:underline">
                      {anchor.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        ) : null}
      </div>
    </main>
  );
}
