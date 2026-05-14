import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Esqueci a Senha | Estetia CRM',
  robots: { index: false, follow: false },
}

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children
}
