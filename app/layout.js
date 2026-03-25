import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
const siteName = 'Tattoo Price Estimator';
const defaultTitle = 'Tattoo Price Estimator | Free Tattoo Cost Calculator by Size, Placement, and Style';
const defaultDescription =
  'Use this free tattoo price estimator to calculate a realistic tattoo cost range by size, placement, style, color, detail level, city, and artist tier.';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: defaultTitle,
  description: defaultDescription,
  applicationName: siteName,
  keywords: [
    'tattoo price estimator',
    'tattoo cost calculator',
    'tattoo price calculator',
    'how much does a tattoo cost',
    'tattoo quote estimator',
    'tattoo pricing guide',
    'average tattoo cost',
    'small tattoo cost',
    'half sleeve tattoo cost'
  ],
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: '/',
    siteName,
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription
  },
  category: 'tattoo',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
