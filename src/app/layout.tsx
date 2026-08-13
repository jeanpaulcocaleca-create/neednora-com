import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://neednora.com'),
  openGraph: {
    type: 'website',
    siteName: 'NORA',
    images: [{
      url: '/og-default.png',
      width: 1200,
      height: 630,
      alt: 'NORA — Networked Operations & Response Assistant',
    }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-default.png'] },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
