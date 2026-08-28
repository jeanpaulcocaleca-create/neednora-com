'use client'

import { useState, type ReactNode } from 'react'
import type { Locale } from '@/lib/i18n'
import { ContactProvider } from '@/lib/contact-context'
import { SiteEffects } from '@/components/site-effects'
import { Nav } from '@/components/nav'
import { NoraModal } from '@/components/nora-modal'

// children should include both <main> and <Footer> so #page-root dims them together
export function ClientShell({ lang, children }: { lang: Locale; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ContactProvider onOpen={() => setIsOpen(true)}>
      <SiteEffects />
      <div id="page-root">
        <Nav lang={lang} />
        {children}
      </div>
      <NoraModal lang={lang} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </ContactProvider>
  )
}
