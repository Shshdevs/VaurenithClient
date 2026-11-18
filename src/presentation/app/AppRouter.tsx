import { Alert, Button, Center, Loader, Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import type { ComponentType, ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { Layout } from '@/presentation/components/Layout'
import { APP_NAV_SECTIONS } from './consts'
import { HomePage } from '@/presentation/pages/HomePage'
import { NotFoundPage } from '@/presentation/pages/NotFoundPage'
import { AuthPage } from '@/presentation/pages/identity/AuthPage'
import { useIdentitySession } from './session/useIdentitySession'

type SessionState = 'checking' | 'active' | 'inactive' | 'error'
type SupportedLocale = 'en' | 'ru'

function isSupportedLocale(locale: string | undefined): locale is SupportedLocale {
  return locale === 'en' || locale === 'ru'
}

function LocalizedPage({ page: Page }: { page: ComponentType }) {
  const { locale } = useParams()

  return isSupportedLocale(locale) ? <Page /> : <NotFoundPage />
}

function getLocalePath(pathname: string) {
  const locale = pathname.split('/')[1]
  return isSupportedLocale(locale) ? `/${locale}` : ''
}

function isIdentityFlowPath(pathname: string) {
  return pathname === '/auth/callback' || /^\/(?:en|ru)?\/identity\/create-user$/.test(pathname)
}

export function AppRouter() {
  return (
    <IdentitySessionGate>
      <Routes>
        <Route element={<Layout navSections={APP_NAV_SECTIONS} />}>
          <Route path="/" element={<HomePage />} />
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

function IdentitySessionGate({ children }: { children: ReactNode }) {
  const identitySession = useIdentitySession()
  const { t } = useTranslation('presentation')
  const { pathname } = useLocation()
  const [state, setState] = useState<SessionState>('checking')
  const [retryCount, setRetryCount] = useState(0)
  const localePath = getLocalePath(pathname)
  const createUserPath = `${localePath}/identity/create-user`
  const homePath = localePath || '/'
  const isIdentityFlowPage = isIdentityFlowPath(pathname)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    void identitySession
      .isActive(controller.signal)
      .then((isActive) => {
        if (isMounted) {
          setState(isActive ? 'active' : 'inactive')
        }
      })
      .catch(() => {
        if (isMounted) {
          setState('error')
        }
      })

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [identitySession, retryCount])

  if (state === 'checking') {
    return (
      <Center mih="100vh">
        <Loader />
      </Center>
    )
  }

  if (state === 'error') {
    return (
      <Center mih="100vh" p="md">
        <Alert color="red" title={t('identity.sessionCheckError')}>
          <Stack gap="sm">
            <Text>{t('identity.sessionCheckErrorDescription')}</Text>
            <Button
              onClick={() => {
                setState('checking')
                setRetryCount((count) => count + 1)
              }}
            >
              {t('identity.retry')}
            </Button>
          </Stack>
        </Alert>
      </Center>
    )
  }

  if (state === 'inactive' && !isIdentityFlowPage) {
    return <Navigate to={createUserPath} replace />
  }

  if (state === 'active' && isIdentityFlowPage) {
    return <Navigate to={homePath} replace />
  }

  return children
}
