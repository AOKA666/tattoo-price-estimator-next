'use client';

import { useMemo, useState } from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tatcost.online';

const PRICING = {
  base: 120,
  size: { tiny: 0, small: 60, medium: 180, large: 380, xl: 900 },
  placement: { arm: 0, wrist: 40, chest: 120, back: 260, leg: 100, ribs: 220, hand: 180 },
  style: { flash: 0, 'fine-line': 40, traditional: 80, 'black-grey': 180, 'color-realism': 280, ornamental: 140 },
  color: { black: 0, limited: 70, full: 180 },
  detail: { low: 0, medium: 80, high: 180, extreme: 340 },
  city: { budget: 0.9, standard: 1, premium: 1.3 },
  artist: { junior: 0.9, established: 1, specialist: 1.35, elite: 1.8 }
};

const defaults = {
  size: 'small',
  placement: 'arm',
  style: 'flash',
  color: 'black',
  detail: 'medium',
  city: 'standard',
  artist: 'established'
};

const LABELS = {
  size: { tiny: 'Tiny (1-2 in)', small: 'Small (3-4 in)', medium: 'Medium (5-7 in)', large: 'Large (8-10 in)', xl: 'XL / half sleeve+' },
  placement: { arm: 'Arm / forearm', wrist: 'Wrist / ankle', chest: 'Chest / shoulder', back: 'Back', leg: 'Leg / thigh', ribs: 'Ribs / side body', hand: 'Hand / fingers / neck' },
  style: { flash: 'Flash / simple linework', 'fine-line': 'Fine line', traditional: 'Traditional', 'black-grey': 'Black & grey realism', 'color-realism': 'Color realism', ornamental: 'Ornamental / geometric' },
  color: { black: 'Black ink only', limited: 'Limited accent color', full: 'Full color' },
  detail: { low: 'Low', medium: 'Medium', high: 'High', extreme: 'Extreme' },
  city: { budget: 'Smaller / lower-cost market', standard: 'Standard metro', premium: 'Major expensive city' },
  artist: { junior: 'Junior artist', established: 'Established artist', specialist: 'Specialist / in-demand', elite: 'Elite / waitlist artist' }
};

function currency(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.round(n));
}

function sessionEstimate(total) {
  if (total < 250) return 'Likely 1 short session';
  if (total < 700) return 'Likely 1 full session';
  if (total < 1400) return 'Likely 2 sessions';
  if (total < 2400) return 'Likely 3-4 sessions';
  return 'Likely 5+ sessions';
}

function buildFactors(data) {
  const factors = [];
  if (data.size === 'xl' || data.size === 'large') factors.push('Large coverage is the main cost driver. More area means more linework, shading, and artist time.');
  if (data.placement === 'ribs' || data.placement === 'hand') factors.push('Placement adds complexity. Ribs, hands, neck, and awkward body areas usually quote above easy arm placements.');
  if (data.color === 'full' || data.style === 'color-realism') factors.push('Color work increases time through palette setup, saturation passes, and touch-up sensitivity.');
  if (data.detail === 'high' || data.detail === 'extreme') factors.push('High detail pushes time up fast. Dense shading, realism, and texture work can move quotes significantly.');
  if (data.artist === 'specialist' || data.artist === 'elite') factors.push('Artist tier matters a lot. Reputation, demand, consistency, and waitlist pressure all get priced in.');
  if (data.city === 'premium') factors.push('Major-city shop rates and studio minimums raise the baseline versus smaller markets.');
  if (!factors.length) factors.push('This setup sits close to the market middle, so shop minimums and artist preference will decide most of the spread.');
  return factors.slice(0, 5);
}

function buildInquiryTemplate(data, low, high) {
  return `Hi, I'd like a quote for a ${LABELS.size[data.size].toLowerCase()} tattoo on my ${LABELS.placement[data.placement].toLowerCase()}. I'm looking for a ${LABELS.style[data.style].toLowerCase()} piece with ${LABELS.color[data.color].toLowerCase()} and ${LABELS.detail[data.detail].toLowerCase()} detail. My rough budget expectation is ${currency(low)}-${currency(high)}. Could you tell me whether this is realistic, how many sessions it may take, and what reference images you'd want from me?`;
}

function estimate(data) {
  const raw = PRICING.base + PRICING.size[data.size] + PRICING.placement[data.placement] + PRICING.style[data.style] + PRICING.color[data.color] + PRICING.detail[data.detail];
  const adjusted = raw * PRICING.city[data.city] * PRICING.artist[data.artist];
  const low = Math.max(100, adjusted * 0.85);
  const high = adjusted * 1.2;
  return { low, high, sessions: sessionEstimate(adjusted), factors: buildFactors(data), inquiry: buildInquiryTemplate(data, low, high) };
}

const faqItems = [
  {
    question: 'Does shop minimum affect small tattoos?',
    answer: 'Yes. Tiny tattoos are often dominated by the studio minimum charge rather than pure design time.'
  },
  {
    question: 'Hourly vs flat rate?',
    answer: 'Simple work is often quoted flat. Complex or custom work is commonly estimated by hourly range or session count.'
  },
  {
    question: 'Is tipping included?',
    answer: 'No. This estimator shows the tattoo quote itself. Tip and aftercare are separate budget items.'
  },
  {
    question: 'How much does a small tattoo usually cost?',
    answer: 'Many small tattoos still end up near the shop minimum, so size alone does not always make the quote cheap.'
  },
  {
    question: 'Why do tattoo prices vary so much by city and artist?',
    answer: 'Tattoo prices change with shop overhead, local demand, artist reputation, and the complexity of the design and placement.'
  }
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tattoo Price Estimator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: `${siteUrl}/`,
  description:
    'Free tattoo cost calculator that estimates tattoo pricing by size, placement, style, color, detail level, city, and artist tier.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  }
};

const webpageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Tattoo Price Estimator',
  url: `${siteUrl}/`,
  description:
    'Free tattoo price estimator and tattoo cost calculator for size, placement, style, color, detail, city, and artist tier.',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${siteUrl}/`
      }
    ]
  }
};

const jumpLinks = [
  { href: '#calculator', label: 'Tattoo cost calculator' },
  { href: '#pricing-guide', label: 'Tattoo pricing guide' },
  { href: '#faq', label: 'Tattoo cost FAQ' }
];

export default function Page() {
  const [form, setForm] = useState(defaults);
  const result = useMemo(() => estimate(form), [form]);

  return (
    <main className="page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }} />

      <section className="hero card">
        <div>
          <span className="eyebrow">Free tattoo cost calculator</span>
          <h1>How Much Does a Tattoo Cost?</h1>
          <p className="lead">Use this tattoo price estimator to calculate a realistic tattoo cost range based on size, placement, style, color, detail, artist tier, and city pricing pressure.</p>
          <ul className="hero-points">
            <li>Instant tattoo quote range in seconds</li>
            <li>Estimated session count</li>
            <li>Clear explanation of the biggest pricing drivers</li>
          </ul>
          <div className="hero-points">
            {jumpLinks.map((link) => (
              <a key={link.href} href={link.href} className="button" style={{ marginRight: 12, marginBottom: 12 }}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="hero-stat">
          <div className="stat-label">Built for</div>
          <div className="stat-value">Pre-booking research</div>
          <p>Good for people searching “how much will my tattoo cost” before they message a studio.</p>
        </div>
      </section>

      <section className="card info-card">
        <h2>How to use this tattoo price estimator</h2>
        <div className="info-grid">
          <article>
            <h3>1. Choose your tattoo size</h3>
            <p>Small tattoos often sit near a studio minimum, while large tattoos and sleeves scale with artist time, shading, and session count.</p>
          </article>
          <article>
            <h3>2. Adjust placement and style</h3>
            <p>Ribs, hands, neck, realism, and dense detail all push quotes upward because they add complexity and time.</p>
          </article>
          <article>
            <h3>3. Compare the estimate with local reality</h3>
            <p>City rates and artist tier can change tattoo prices fast, so use the estimate as a realistic starting range before asking a shop for a final quote.</p>
          </article>
        </div>
      </section>

      <section className="grid" id="calculator">
        <section className="card form-card">
          <h2>Tattoo Cost Calculator</h2>
          <p className="section-intro">Choose your tattoo size, placement, style, color, detail level, city pricing, and artist tier to get a fast tattoo cost estimate.</p>
          <div className="form-grid">
            {Object.entries(LABELS).map(([field, options]) => (
              <label key={field}>
                {field === 'city' ? 'City pricing' : field === 'artist' ? 'Artist tier' : field === 'detail' ? 'Detail level' : field.charAt(0).toUpperCase() + field.slice(1)}
                <select value={form[field]} onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}>
                  {Object.entries(options).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <a href="#result" className="button">See Estimate</a>
        </section>

        <section className="card result-card" id="result">
          <h2>Your tattoo price estimate</h2>
          <div className="price">{currency(result.low)} - {currency(result.high)}</div>
          <div className="meta">Typical tattoo quote range for the inputs you selected. Final pricing still depends on the studio, custom design complexity, and minimum charge.</div>
          <div className="session-pill">{result.sessions}</div>

          <div className="result-section">
            <h3>Top pricing drivers</h3>
            <ul>{result.factors.map((factor) => <li key={factor}>{factor}</li>)}</ul>
          </div>

          <div className="result-section">
            <h3>What to send a tattoo artist</h3>
            <p>{result.inquiry}</p>
          </div>

          <div className="result-section">
            <h3>Best next steps</h3>
            <ul>
              <li>Save this tattoo estimate before messaging studios</li>
              <li>Use the inquiry template when you ask for a tattoo quote</li>
              <li>Compare tattoo prices by city and artist tier before booking</li>
            </ul>
          </div>
        </section>
      </section>

      <section className="card info-card">
        <h2>Average tattoo cost depends on these variables</h2>
        <div className="info-grid">
          <article>
            <h3>Placement matters</h3>
            <p>Hands, ribs, neck, and awkward body areas usually cost more because they take longer and require more precision.</p>
          </article>
          <article>
            <h3>Color adds time</h3>
            <p>Full color usually means more setup, layering, and longer sessions than black-only tattoos.</p>
          </article>
          <article>
            <h3>Artist demand is real</h3>
            <p>A sought-after artist can cost 2-4× more than a junior artist for the same concept.</p>
          </article>
        </div>
      </section>

      <section className="card guide-card" id="pricing-guide">
        <h2>Tattoo pricing guide for common searches</h2>
        <p className="section-intro">These are the high-intent searches people use before they ask for a tattoo quote. This page is designed to answer those questions fast.</p>
        <div className="guide-grid">
          <article>
            <h3>Small tattoo cost</h3>
            <p>Many small tattoos still land near the shop minimum, so the cheapest idea is not always dramatically cheaper.</p>
          </article>
          <article>
            <h3>Half sleeve tattoo cost</h3>
            <p>Half sleeve pricing usually rises fast because of coverage, design cohesion, and multi-session work.</p>
          </article>
          <article>
            <h3>Fine line tattoo cost</h3>
            <p>Fine line work can look simple, but a clean result often requires a more experienced artist and careful execution.</p>
          </article>
          <article>
            <h3>Forearm tattoo cost</h3>
            <p>Forearm tattoos are usually easier to price than ribs or hands, but style, detail, and artist tier still change the final quote a lot.</p>
          </article>
          <article>
            <h3>Color tattoo cost</h3>
            <p>Color tattoos usually cost more than black ink tattoos because layering, saturation, and session length all increase.</p>
          </article>
          <article>
            <h3>Tattoo artist hourly rate</h3>
            <p>Hourly tattoo pricing varies by city, shop positioning, and artist reputation, so the same concept can quote very differently across studios.</p>
          </article>
        </div>
      </section>

      <section className="card faq-card" id="faq">
        <h2>Tattoo cost FAQ</h2>
        <div className="faq-list">
          {faqItems.map((item) => (
            <article key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card note-card">
        <h2>Important note about tattoo estimates</h2>
        <p className="subtle">This tattoo cost calculator gives a realistic starting range, not a final quote. Actual tattoo pricing depends on the artist, reference quality, exact placement, skin conditions, custom design time, and shop minimums in your market.</p>
        <p className="subtle">For the most accurate quote, send your preferred size, placement, style references, and budget range to the artist before booking.</p>
      </section>
    </main>
  );
}
