import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { PUBLIC_SITEMAP_PATHS } from './site-meta';

describe('public sitemap', () => {
  it('includes the main public discovery routes', () => {
    const sitemapPath = join(dirname(fileURLToPath(import.meta.url)), '../../../public/sitemap.xml');
    const sitemap = readFileSync(sitemapPath, 'utf8');

    for (const path of PUBLIC_SITEMAP_PATHS) {
      expect(sitemap).toContain(`https://youthgobudgetapp.org${path}`);
    }
  });
});
