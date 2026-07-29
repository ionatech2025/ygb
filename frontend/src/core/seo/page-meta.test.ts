import { describe, expect, it } from 'vitest';
import { applyPageMeta } from './page-meta';

describe('applyPageMeta', () => {
  it('sets document title and description meta tags', () => {
    applyPageMeta({
      title: 'Public PDM Dashboard | Youth Go Budget App',
      description: 'Explore anonymised Parish Development Model survey data.',
      canonicalPath: 'https://youthgobudgetapp.org/dashboard',
    });

    expect(document.title).toBe('Public PDM Dashboard | Youth Go Budget App');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      'Explore anonymised Parish Development Model survey data.'
    );
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(
      'Public PDM Dashboard | Youth Go Budget App'
    );
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://youthgobudgetapp.org/dashboard'
    );
  });

  it('marks staff routes as noindex when requested', () => {
    applyPageMeta({
      title: 'Staff Sign In | Youth Go Budget App',
      description: 'Staff portal sign in.',
      canonicalPath: 'https://youthgobudgetapp.org/login',
      noIndex: true,
    });

    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex, nofollow');
  });
});
