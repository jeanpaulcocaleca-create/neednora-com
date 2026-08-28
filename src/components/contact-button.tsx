'use client'

import { useContact } from '@/lib/contact-context'

interface Props {
  children: React.ReactNode
  className?: string
}

export function ContactButton({ children, className = 'btn btn-solid' }: Props) {
  const { open } = useContact()
  return (
    <button className={className} onClick={open}>
      {children}
    </button>
  )
}
