import { seoPages, siteUrl } from './seo-pages';

export default function sitemap() {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date('2026-03-28T00:00:00.000Z'),
      changeFrequency: 'weekly',
      priority: 1
    },
    ...seoPages.map((page) => ({
      url: `${siteUrl}/${page.slug}`,
      lastModified: new Date('2026-03-28T00:00:00.000Z'),
      changeFrequency: 'weekly',
      priority: 0.8
    }))
  ];
}
