export type PdmResourceSlug = 'programme-overview' | 'budget-allocations' | 'priorities';

export interface PdmResourcePageConfig {
  slug: PdmResourceSlug;
  title: string;
  summary: string;
  headings: readonly string[];
}

export const PDM_RESOURCE_PAGES: readonly PdmResourcePageConfig[] = [
  {
    slug: 'programme-overview',
    title: 'Programme Overview',
    summary: 'About PDM, the seven pillars, implementation structure, and progress highlights.',
    headings: [
      'About the Parish Development Model (PDM)',
      'The 7 Pillars of the PDM',
      'Implementation Structure',
      'Implementation Status (Progress Highlights)',
    ],
  },
  {
    slug: 'budget-allocations',
    title: 'Budget Allocations',
    summary: 'Financing and budget allocation tables by financial year.',
    headings: ['Financing and Budget Allocation'],
  },
  {
    slug: 'priorities',
    title: 'Priorities & Resources',
    summary: 'Eligible enterprises, support provided, complementary programmes, and contacts.',
    headings: [
      'Enterprises Eligible for Support',
      'What is Provided Under the PDM?',
      'Complementary Wealth-Creation Programmes',
      'Contacts and Resources',
      'Further Reading',
    ],
  },
] as const;

export function isPdmResourceSlug(value: string | undefined): value is PdmResourceSlug {
  return PDM_RESOURCE_PAGES.some((page) => page.slug === value);
}

export function getPdmResourcePage(slug: PdmResourceSlug): PdmResourcePageConfig {
  const page = PDM_RESOURCE_PAGES.find((entry) => entry.slug === slug);
  if (!page) {
    throw new Error(`Unknown PDM resource slug: ${slug}`);
  }
  return page;
}

export function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function parseMarkdownSections(markdown: string): Map<string, string> {
  const sections = new Map<string, string>();
  const parts = markdown.split(/\n(?=## )/);

  for (const part of parts) {
    const match = part.match(/^## (.+?)(?:\r?\n|$)/);
    if (!match) {
      continue;
    }
    sections.set(match[1].trim(), part.trim());
  }

  return sections;
}

export function buildResourceMarkdown(sourceMarkdown: string, headings: readonly string[]): string {
  const parsed = parseMarkdownSections(sourceMarkdown);
  return headings
    .map((heading) => parsed.get(heading))
    .filter((section): section is string => Boolean(section))
    .join('\n\n---\n\n');
}

export function extractHeadingAnchors(markdown: string): { id: string; label: string; level: number }[] {
  return [...markdown.matchAll(/^(#{2,3})\s+(.+)$/gm)].map((match) => {
    const label = match[2].trim();
    return {
      level: match[1].length,
      label,
      id: slugifyHeading(label),
    };
  });
}
