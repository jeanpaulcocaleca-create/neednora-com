import type { Metadata } from 'next'
import { Bricolage_Grotesque, Plus_Jakarta_Sans, Inter } from 'next/font/google'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: false,
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://neednora.com'),
  openGraph: {
    type: 'website',
    siteName: 'NORA',
    images: [{
      url: '/og-default.png',
      width: 1200,
      height: 630,
      alt: 'NORA: Business. Organized.',
    }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-default.png'] },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${bricolage.variable} ${jakarta.variable} ${inter.variable}`}
      data-industry="hospitality"
    >
      <body>{children}</body>
    </html>
  )
}
