import type { ComponentType } from 'react'
import { Route, Routes, useParams } from 'react-router-dom'
import { Layout } from '@/presentation/components/Layout'
import { APP_NAV_SECTIONS } from './consts'
import { HomePage } from '@/presentation/pages/HomePage'
import { NotFoundPage } from '@/presentation/pages/NotFoundPage'
import { AuthPage } from '@/presentation/pages/identity/AuthPage'
import { IdentitySessionGate } from './IdentitySessionGate'
import { ProjectsPage } from '@/presentation/pages/ProjectsPage'

type SupportedLocale = 'en' | 'ru'

function isSupportedLocale(locale: string | undefined): locale is SupportedLocale {
  return locale === 'en' || locale === 'ru'
}

function LocalizedPage({ page: Page }: { page: ComponentType }) {
  const { locale } = useParams()

  return isSupportedLocale(locale) ? <Page /> : <NotFoundPage />
}

export function AppRouter() {
  return (
    <IdentitySessionGate>
      <Routes>
        <Route element={<Layout navSections={APP_NAV_SECTIONS} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/:locale" element={<LocalizedPage page={HomePage} />} />
        </Route>
        <Route path="/identity/create-user" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthPage />} />
        <Route path="/:locale/identity/create-user" element={<LocalizedPage page={AuthPage} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </IdentitySessionGate>
  )
}
