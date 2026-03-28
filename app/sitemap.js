const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tatcost.online';

export default function sitemap() {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date('2026-03-28T00:00:00.000Z'),
      changeFrequency: 'weekly',
      priority: 1
    }
  ];
}
