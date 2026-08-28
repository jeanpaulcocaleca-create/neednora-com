'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface ContactContextValue {
  open: () => void
}

const ContactContext = createContext<ContactContextValue>({ open: () => {} })

export function useContact() {
  return useContext(ContactContext)
}

export function ContactProvider({
  children,
  onOpen,
}: {
  children: ReactNode
  onOpen: () => void
}) {
  return (
    <ContactContext.Provider value={{ open: onOpen }}>
      {children}
    </ContactContext.Provider>
  )
}
