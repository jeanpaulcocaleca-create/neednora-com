import type { Metadata } from 'next'
import { locales, getTranslations, type Locale } from '@/lib/i18n'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const locale = lang as Locale
  const t = getTranslations(locale)
  return {
    title: {
      template: t.meta.titleTemplate,
      default: t.meta.defaultTitle,
    },
    description: t.meta.description,
    alternates: {
      canonical: locale === 'es' ? '/es' : '/en',
      languages: { es: '/es', en: '/en' },
    },
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as Locale
  return (
    <>
      <Nav lang={locale} />
      <main>{children}</main>
      <Footer lang={locale} />
    </>
  )
}
