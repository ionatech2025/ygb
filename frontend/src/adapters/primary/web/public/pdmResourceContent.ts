import pdmPublicInfoMarkdown from '@repo-docs/pdm_public_info.md?raw';
import {
  buildResourceMarkdown,
  getPdmResourcePage,
  type PdmResourceSlug,
} from '../../../../core/content/pdmPublicInfoSections';

export function getPdmResourceMarkdown(slug: PdmResourceSlug): string {
  const page = getPdmResourcePage(slug);
  return buildResourceMarkdown(pdmPublicInfoMarkdown, page.headings);
}

export { pdmPublicInfoMarkdown };
