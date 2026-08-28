import type { Metadata } from 'next'
import { getTranslations, type Locale } from '@/lib/i18n'
import { Hero } from '@/components/hero'
import { Switchboard } from '@/components/switchboard'
import { WatchNora } from '@/components/watch-nora'
import { Threshold } from '@/components/threshold'
import { MemoryFlip } from '@/components/memory-flip'
import { IndustriesSection } from '@/components/industries-section'
import { TimeSection } from '@/components/time-section'
import { TrustSection } from '@/components/trust-section'
import { TryNora } from '@/components/try-nora'
import { StartCta } from '@/components/start-cta'

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
      <div className="lworld light" data-nav="light">
        <div className="qline" aria-hidden="true"><span className="track" /><span className="fill" /></div>
        <Switchboard lang={lang} />
        <WatchNora lang={lang} />
        <Threshold lang={lang} />
        <MemoryFlip lang={lang} />
        <IndustriesSection lang={lang} />
        <TimeSection lang={lang} />
        <TrustSection lang={lang} />
        <TryNora lang={lang} />
      </div>
      <StartCta lang={lang} />
    </>
  )
}
