import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  extractHeadingAnchors,
  getPdmResourcePage,
  isPdmResourceSlug,
} from '../../../../core/content/pdmPublicInfoSections';
import { publicResourcesClasses } from '../../../../core/domain/public-dashboard.theme';
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
    <div className={`${publicResourcesClasses.page} ${publicResourcesClasses.detailLayout}`} data-testid="pdm-resource-detail">
      <article className={publicResourcesClasses.article}>
        <header className={publicResourcesClasses.articleHeader}>
          <Link to="/resources" className={publicResourcesClasses.backLink}>
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            All resources
          </Link>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-brand">Resource article</p>
          <h1 className={publicResourcesClasses.articleTitle}>{page.title}</h1>
          <p className={publicResourcesClasses.articleSummary}>{page.summary}</p>
        </header>

        <div className={publicResourcesClasses.articleBody}>
          <MarkdownContent content={markdown} />
        </div>
      </article>

      {anchors.length > 0 ? (
        <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-72">
          <nav aria-label="On this page" className={publicResourcesClasses.tocNav}>
            <h2 className={publicResourcesClasses.tocHeading}>On this page</h2>
            <ul className="mt-3 space-y-0.5">
              {anchors.map((anchor) => (
                <li key={anchor.id}>
                  <a
                    href={`#${anchor.id}`}
                    className={`${publicResourcesClasses.tocLink} ${anchor.level === 3 ? 'pl-4' : ''}`}
                  >
                    {anchor.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      ) : null}
    </div>
  );
}
