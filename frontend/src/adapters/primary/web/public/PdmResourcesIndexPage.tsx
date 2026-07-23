import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Landmark, ListChecks, Wallet, type LucideIcon } from 'lucide-react';
import { PDM_RESOURCE_PAGES, type PdmResourceSlug } from '../../../../core/content/pdmPublicInfoSections';
import {
  PUBLIC_RESOURCE_CARD_ACCENTS,
  publicResourcesClasses,
} from '../../../../core/domain/public-dashboard.theme';

const RESOURCE_ICONS: Record<PdmResourceSlug, LucideIcon> = {
  'programme-overview': BookOpen,
  'budget-allocations': Wallet,
  priorities: ListChecks,
};

export function PdmResourcesIndexPage() {
  return (
    <div className={publicResourcesClasses.page} data-testid="pdm-resources-index">
      <header className={publicResourcesClasses.hero} data-testid="pdm-resources-hero">
        <span className={publicResourcesClasses.heroAccent} aria-hidden="true" />
        <span className={publicResourcesClasses.heroGlow} aria-hidden="true" />

        <div className={publicResourcesClasses.heroContent}>
          <p className={publicResourcesClasses.heroEyebrow}>Public resources</p>
          <h1 className={`${publicResourcesClasses.heroTitle} flex items-center gap-3`}>
            <Landmark className="h-7 w-7 shrink-0 text-brand sm:h-8 sm:w-8" aria-hidden="true" />
            PDM Information & Resources
          </h1>
          <p className={publicResourcesClasses.heroLead}>
            Read-only programme context for the Parish Development Model — open to everyone, with no account required.
            Explore overview material, budget tables, and enterprise priorities sourced from official programme guidance.
          </p>
        </div>
      </header>

      <section aria-label="Resource topics" className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Browse topics</h2>
        <div className={publicResourcesClasses.resourceGrid}>
          {PDM_RESOURCE_PAGES.map((page, index) => {
            const accent = PUBLIC_RESOURCE_CARD_ACCENTS[index % PUBLIC_RESOURCE_CARD_ACCENTS.length];
            const Icon = RESOURCE_ICONS[page.slug];

            return (
              <Link
                key={page.slug}
                to={`/resources/${page.slug}`}
                className={publicResourcesClasses.resourceCard}
              >
                <span className={`${publicResourcesClasses.resourceCardGlow} ${accent.glow}`} aria-hidden="true" />
                <div className={`${publicResourcesClasses.resourceCardIcon} ring-1 ${accent.icon}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className={publicResourcesClasses.resourceCardTitle}>{page.title}</h2>
                <p className={publicResourcesClasses.resourceCardSummary}>{page.summary}</p>
                <span className={publicResourcesClasses.resourceCardCta}>
                  Read more
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
