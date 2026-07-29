export interface PageMetaInput {
  title: string;
  description?: string;
  canonicalPath?: string;
  noIndex?: boolean;
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string): void {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function upsertLink(rel: string, href: string): void {
  let element = document.head.querySelector(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
}

export function applyPageMeta({
  title,
  description,
  canonicalPath,
  noIndex = false,
}: PageMetaInput): void {
  document.title = title;

  if (description) {
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:description', description);
    upsertMeta('name', 'twitter:description', description);
  }

  upsertMeta('property', 'og:title', title);
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:card', 'summary_large_image');

  if (canonicalPath) {
    upsertLink('canonical', canonicalPath.startsWith('http') ? canonicalPath : `${window.location.origin}${canonicalPath}`);
    upsertMeta(
      'property',
      'og:url',
      canonicalPath.startsWith('http') ? canonicalPath : `${window.location.origin}${canonicalPath}`
    );
  }

  upsertMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');
}
