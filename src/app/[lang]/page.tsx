import type { Metadata } from 'next'
import { getTranslations, type Locale } from '@/lib/i18n'
import { Hero } from '@/components/hero'
import { ProductStory } from '@/components/product-story'
import { SignalSection } from '@/components/signal-section'
import { DomainExplorer } from '@/components/domain-explorer'
import { TrustSection } from '@/components/trust-section'
import { EarlyAccessForm } from '@/components/early-access-form'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = getTranslations(lang as Locale)
  return {
    title: t.meta.defaultTitle,
    description: t.meta.description,
  }
}

function DarkToLight() {
  return (
    <div
      aria-hidden="true"
      style={{ height: 72, background: 'linear-gradient(to bottom, var(--ds-bg), var(--ls-bg))' }}
    />
  )
}

function LightToDark() {
  return (
    <div
      aria-hidden="true"
      style={{ height: 72, background: 'linear-gradient(to bottom, var(--ls-bg), var(--ds-bg))' }}
    />
  )
}

function WhiteToDark() {
  return (
    <div
      aria-hidden="true"
      style={{ height: 72, background: 'linear-gradient(to bottom, var(--ls-surface), var(--ds-bg))' }}
    />
  )
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: langRaw } = await params
  const lang = langRaw as Locale
  return (
    <>
      <Hero lang={lang} />
      <DarkToLight />
      <ProductStory lang={lang} />
      <LightToDark />
      <SignalSection lang={lang} />
      <DarkToLight />
      <DomainExplorer lang={lang} />
      <TrustSection lang={lang} />
      <WhiteToDark />
      <EarlyAccessForm lang={lang} />
    </>
  )
}
