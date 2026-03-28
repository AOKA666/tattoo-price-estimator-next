import Link from 'next/link';
import { getSeoPage, seoPages, siteUrl } from '../seo-pages';

export function generateStaticParams() {
  return seoPages.map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }) {
  const page = getSeoPage(params.slug);

  if (!page) {
    return {};
  }

  return {
    title: `${page.title} | Tattoo Price Estimator`,
    description: page.description,
    keywords: [
      page.slug.replaceAll('-', ' '),
      'tattoo price estimator',
      'tattoo cost calculator',
      'how much does a tattoo cost'
    ],
    alternates: {
      canonical: `/${page.slug}`
    },
    openGraph: {
      title: `${page.title} | Tattoo Price Estimator`,
      description: page.description,
      url: `/${page.slug}`,
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${page.title} | Tattoo Price Estimator`,
      description: page.description
    }
  };
}

function buildFaqSchema(faq) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };
}

export default async function SeoPage({ params }) {
  const { slug } = await params;
  const page = getSeoPage(slug);

  if (!page) {
    return null;
  }

  const relatedPages = seoPages.filter((entry) => entry.slug !== page.slug).slice(0, 3);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.h1,
    description: page.description,
    mainEntityOfPage: `${siteUrl}/${page.slug}`,
    url: `${siteUrl}/${page.slug}`,
    datePublished: '2026-03-28T00:00:00.000Z',
    dateModified: '2026-03-28T00:00:00.000Z',
    author: {
      '@type': 'Organization',
      name: 'Tattoo Price Estimator'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tattoo Price Estimator',
      url: siteUrl
    },
    keywords: [page.slug.replaceAll('-', ' '), 'tattoo price estimator', 'tattoo cost calculator'].join(', ')
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${siteUrl}/`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: page.h1,
        item: `${siteUrl}/${page.slug}`
      }
    ]
  };

  const faqSchema = buildFaqSchema(page.faq);

  return (
    <main className="page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="hero card">
        <div>
          <span className="eyebrow">Tattoo pricing guide</span>
          <h1>{page.h1}</h1>
          <p className="lead">{page.intro}</p>
          <div className="cta-actions">
            <Link href="/" className="button">Use the tattoo price estimator</Link>
            <a href="#faq" className="button secondary">Jump to FAQ</a>
          </div>
        </div>
        <div className="hero-stat">
          <div className="stat-label">Best for</div>
          <div className="stat-value">High-intent pricing searches</div>
          <p>This page is built for people comparing tattoo quotes before they message a studio or book a session.</p>
        </div>
      </section>

      <section className="card guide-card">
        <h2>{page.h1} guide</h2>
        <div className="guide-grid">
          {page.sections.map((section) => (
            <article key={section.title}>
              <h3>{section.title}</h3>
              <p>{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card info-card">
        <h2>Use the calculator for a faster estimate</h2>
        <div className="info-grid">
          <article>
            <h3>Adjust size</h3>
            <p>Size is usually the first pricing lever, but it should be read together with style, detail, and placement.</p>
          </article>
          <article>
            <h3>Compare placement</h3>
            <p>Forearm, ribs, hands, and back all price differently because execution time and difficulty change.</p>
          </article>
          <article>
            <h3>Check artist tier</h3>
            <p>A stronger artist can charge more per hour or per session, but may still be the smarter booking choice.</p>
          </article>
        </div>
        <div className="cta-actions">
          <Link href="/" className="button">Open tattoo cost calculator</Link>
        </div>
      </section>

      <section className="card faq-card" id="faq">
        <h2>{page.h1} FAQ</h2>
        <div className="faq-list">
          {page.faq.map((item) => (
            <article key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card note-card">
        <h2>Related tattoo pricing guides</h2>
        <div className="guide-grid">
          {relatedPages.map((relatedPage) => (
            <article key={relatedPage.slug}>
              <h3>{relatedPage.h1}</h3>
              <p>{relatedPage.description}</p>
              <Link href={`/${relatedPage.slug}`} className="button" style={{ marginTop: 12 }}>
                Read guide
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
