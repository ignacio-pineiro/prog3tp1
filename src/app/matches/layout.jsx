"use client"
import { MatchesProvider } from "./MatchesContext"

function LayoutContent({ children }) {
  return (
    <>
      {children}
    </>
  )
}

export default function MatchesLayout({ children }) {
  return (
    <MatchesProvider>
      <LayoutContent>{children}</LayoutContent>
    </MatchesProvider>
  )
}