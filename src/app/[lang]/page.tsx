import type { Metadata } from 'next'
import { getTranslations, type Locale } from '@/lib/i18n'
import { Hero } from '@/components/hero'
import { NoraWorking } from '@/components/nora-working'
import { DayWithNora } from '@/components/day-with-nora'
import { ReceiptStory } from '@/components/receipt-story'
import { Accountability } from '@/components/accountability'
import { TryNora } from '@/components/try-nora'
import { PrivacyContext } from '@/components/privacy-context'
import { DemoVideos } from '@/components/demo-videos'
import { TrustSection } from '@/components/trust-section'
import { WhatsAppCta } from '@/components/whatsapp-cta'
import { EarlyAccessForm } from '@/components/early-access-form'

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
      {/* 1. First experience: NORA in conversation */}
      <Hero lang={lang} />

      {/* 2. NORA was already working — before the owner woke up */}
      <NoraWorking lang={lang} />

      {/* 3. A full day in NORA's memory — connected events */}
      <DayWithNora lang={lang} />

      {/* 4. One photo → three records — clean operational clarity */}
      <ReceiptStory lang={lang} />

      {/* 5. Accountability: NORA tracks facts, you make decisions */}
      <Accountability lang={lang} />

      {/* 6. Try NORA — real situations, real responses */}
      <TryNora lang={lang} />

      {/* 7. Context-aware: your business has context, your life does too */}
      <PrivacyContext lang={lang} />

      {/* 8. See NORA in action — upcoming demonstrations */}
      <DemoVideos lang={lang} />

      {/* 9. Trust, privacy, data isolation */}
      <TrustSection lang={lang} />

      {/* 10. Start from your phone */}
      <WhatsAppCta lang={lang} />

      {/* 11. Get early access */}
      <EarlyAccessForm lang={lang} />
    </>
  )
}
