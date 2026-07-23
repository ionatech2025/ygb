import { describe, expect, it } from 'vitest';
import {
  buildResourceMarkdown,
  extractHeadingAnchors,
  getPdmResourcePage,
  parseMarkdownSections,
} from './pdmPublicInfoSections';
import { pdmPublicInfoMarkdown } from '../../adapters/primary/web/public/pdmResourceContent';

describe('pdmPublicInfoSections', () => {
  it('maps programme overview slug to expected heading ranges', () => {
    const page = getPdmResourcePage('programme-overview');

    expect(page.headings).toContain('About the Parish Development Model (PDM)');
    expect(page.headings).toContain('The 7 Pillars of the PDM');
    expect(page.headings).toContain('Implementation Structure');
  });

  it('builds programme overview excerpt from bundled markdown source', () => {
    const markdown = buildResourceMarkdown(
      pdmPublicInfoMarkdown,
      getPdmResourcePage('programme-overview').headings
    );

    expect(markdown).toContain('## About the Parish Development Model (PDM)');
    expect(markdown).toContain('3.5 million');
    expect(markdown).toContain('## The 7 Pillars of the PDM');
    expect(markdown).not.toContain('## Financing and Budget Allocation');
  });

  it('extracts heading anchors for in-page navigation', () => {
    const sample = '## First Topic\n\nBody\n\n### Nested Point\n\nMore';
    expect(extractHeadingAnchors(sample)).toEqual([
      { level: 2, label: 'First Topic', id: 'first-topic' },
      { level: 3, label: 'Nested Point', id: 'nested-point' },
    ]);
  });

  it('parses markdown sections by level-2 headings', () => {
    const parsed = parseMarkdownSections('## One\n\nA\n\n## Two\n\nB');
    expect(parsed.get('One')).toContain('A');
    expect(parsed.get('Two')).toContain('B');
  });
});
