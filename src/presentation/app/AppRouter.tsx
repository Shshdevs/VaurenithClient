import { Alert, Button, Center, Loader, Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { HomePage } from '@/presentation/pages/HomePage'
import { NotFoundPage } from '@/presentation/pages/NotFoundPage'
import { AuthPage } from '@/presentation/pages/identity/AuthPage'
import { useIdentitySession } from './session/useIdentitySession'

type SessionState = 'checking' | 'active' | 'inactive' | 'error'

function LocalizedHomePage() {
  const { locale } = useParams()

  return locale === 'en' || locale === 'ru' ? <HomePage /> : <NotFoundPage />
}

export function AppRouter() {
  return (
    <IdentitySessionGate>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:locale" element={<LocalizedHomePage />} />
        <Route path="/identity/create-user" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthPage />} />
        <Route path="/:locale/identity/create-user" element={<LocalizedCreateUserPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </IdentitySessionGate>
  )
}

function LocalizedCreateUserPage() {
  const { locale } = useParams()

  return locale === 'en' || locale === 'ru' ? <AuthPage /> : <NotFoundPage />
}

function IdentitySessionGate({ children }: { children: ReactNode }) {
  const identitySession = useIdentitySession()
  const { t } = useTranslation('presentation')
  const { pathname } = useLocation()
  const [state, setState] = useState<SessionState>('checking')
  const [retryCount, setRetryCount] = useState(0)
  const localeSegment = pathname.split('/')[1]
  const locale = localeSegment === 'en' || localeSegment === 'ru' ? localeSegment : ''
  const createUserPath = `${locale ? `/${locale}` : ''}/identity/create-user`
  const homePath = locale ? `/${locale}` : '/'
  const isCreateUserPage = pathname === '/identity/create-user' || /^\/(en|ru)\/identity\/create-user$/.test(pathname)
  const isIdentityFlowPage = isCreateUserPage || pathname === '/auth/callback'

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
