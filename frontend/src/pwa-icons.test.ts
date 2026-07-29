import { readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '../public');

describe('PWA icon assets', () => {
  it('favicon.svg shows the YGB monogram on brand green', () => {
    const svg = readFileSync(join(publicDir, 'favicon.svg'), 'utf8');

    expect(svg).toContain('aria-label="YGB"');
    expect(svg).toContain('#359661');
    expect(svg).toContain('>YGB</text>');
    expect(svg).not.toContain('M8 22V10');
    expect(svg).not.toMatch(/<circle[^>]*cx="22\.5"/);
  });

  it('ships PNG icons at required PWA sizes', () => {
    for (const fileName of ['pwa-192.png', 'pwa-512.png'] as const) {
      const filePath = join(publicDir, fileName);
      const { size } = statSync(filePath);
      expect(size).toBeGreaterThan(500);
    }
  });
});
