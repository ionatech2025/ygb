import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const LEGACY_PUBLIC_DOWNLOAD_PATTERNS = [
  '/api/v1/public/dashboard/download/csv',
  '/api/v1/public/dashboard/download/excel',
  '/api/v1/public/dashboard/budget-priorities/download/',
  '/api/v1/public/dashboard/lgo-budget-allocation/download/',
] as const;

function walkSourceFiles(dir: string, collected: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      if (entry === 'node_modules' || entry === 'dist') {
        continue;
      }
      walkSourceFiles(fullPath, collected);
      continue;
    }
    if (/\.(ts|tsx)$/.test(entry) && !entry.endsWith('.test.ts') && !entry.endsWith('.test.tsx')) {
      collected.push(fullPath);
    }
  }
  return collected;
}

describe('legacy public chart download cutover (008)', () => {
  it('has zero callers of retired public dashboard download URLs', () => {
    const srcRoot = join(process.cwd(), 'src');
    const offenders: string[] = [];

    for (const filePath of walkSourceFiles(srcRoot)) {
      const contents = readFileSync(filePath, 'utf8');
      for (const pattern of LEGACY_PUBLIC_DOWNLOAD_PATTERNS) {
        if (contents.includes(pattern)) {
          offenders.push(`${filePath} → ${pattern}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
