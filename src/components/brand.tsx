import Image from 'next/image'

export function NoraBrand({ compact = false, priority = false }: { compact?: boolean; priority?: boolean }) {
  if (compact) {
    return (
      <span className="nora-brand-compact">
        <Image src="/brand/nora-icon.png" alt="NORA" width={32} height={32} priority={priority} />
        <span>NORA</span>
      </span>
    )
  }

  return (
    <Image
      src="/brand/nora-logo.png"
      alt="NORA — Networked Operations & Response Assistant"
      width={460}
      height={190}
      priority={priority}
      className="nora-full-logo"
    />
  )
}
