import { useEffect } from 'react';
import type { PageMetaDefinition } from '../seo/site-meta';
import { SITE_NAME, buildAbsoluteUrl } from '../seo/site-meta';
import { applyPageMeta } from '../seo/page-meta';

function formatDocumentTitle(title: string): string {
  return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
}

export function usePageMeta(meta: PageMetaDefinition): void {
  useEffect(() => {
    applyPageMeta({
      title: formatDocumentTitle(meta.title),
      description: meta.description,
      canonicalPath: buildAbsoluteUrl(meta.canonicalPath),
      noIndex: meta.noIndex,
    });
  }, [meta.title, meta.description, meta.canonicalPath, meta.noIndex]);
}
