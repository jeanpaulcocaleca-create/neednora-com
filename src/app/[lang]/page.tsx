import type { Metadata } from 'next'
import { getTranslations, type Locale } from '@/lib/i18n'
import { Hero } from '@/components/hero'
import { PeaceOfMind } from '@/components/peace-of-mind'
import { Accountability } from '@/components/accountability'
import { ProductStory } from '@/components/product-story'
import { DomainExplorer } from '@/components/domain-explorer'
import { TrustSection } from '@/components/trust-section'
import { TryNora } from '@/components/try-nora'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const t = getTranslations(lang as Locale)
  return { title: t.meta.defaultTitle, description: t.meta.description }
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langRaw } = await params
  const lang = langRaw as Locale
  return (
    <>
      <Hero lang={lang} />
      <PeaceOfMind lang={lang} />
      <Accountability lang={lang} />
      <TryNora lang={lang} />
      <ProductStory lang={lang} />
      <DomainExplorer lang={lang} />
      <TrustSection lang={lang} />
    </>
  )
}
