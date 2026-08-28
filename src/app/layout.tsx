import type { Metadata } from 'next'
import { Bricolage_Grotesque, Figtree, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
  axes: ['opsz'],
  weight: 'variable',
})

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap',
  weight: ['400', '500', '600'],
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://neednora.com'),
  openGraph: {
    type: 'website',
    siteName: 'NORA',
    images: [{
      url: '/img/hero-poster.jpg',
      width: 1920,
      height: 1080,
      alt: 'NORA: Business. Organized.',
    }],
  },
  twitter: { card: 'summary_large_image', images: ['/img/hero-poster.jpg'] },
  robots: { index: true, follow: true },
  icons: {
    icon: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 64 64\'%3E%3Crect width=\'64\' height=\'64\' rx=\'14\' fill=\'%230F1613\'/%3E%3Ccircle cx=\'32\' cy=\'32\' r=\'13\' fill=\'none\' stroke=\'%233FB58A\' stroke-width=\'3.5\'/%3E%3Ccircle cx=\'32\' cy=\'32\' r=\'4.5\' fill=\'%23F1EDE3\'/%3E%3C/svg%3E',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${figtree.variable} ${ibmPlexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
