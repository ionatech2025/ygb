import { buildWebApplicationJsonLd } from '../../../../core/seo/site-meta';

export function PublicSeoJsonLd() {
  const jsonLd = JSON.stringify(buildWebApplicationJsonLd());

  return (
    <script
      type="application/ld+json"
      data-testid="public-seo-json-ld"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  );
}
