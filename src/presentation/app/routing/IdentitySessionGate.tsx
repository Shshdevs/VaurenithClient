import { Alert, Center, Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useIdentitySessionStatus } from '@/presentation/hooks/app/backend/session/useIdentitySessionStatus'
import { AppButton } from '@/presentation/components/AppButton'
import { PageLoader } from '@/presentation/components/PageLoader'

function getLocalePath(pathname: string) {
  const locale = pathname.split('/')[1]
  return locale === 'en' || locale === 'ru' ? `/${locale}` : ''
}

function isIdentityFlowPath(pathname: string) {
  return pathname === '/auth/callback' || /^\/(?:(?:en|ru)\/)?identity\/create-user$/.test(pathname)
}

export function IdentitySessionGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation('presentation')
  const { pathname } = useLocation()
  const { status, retry } = useIdentitySessionStatus()
  const localePath = getLocalePath(pathname)
  const createUserPath = `${localePath}/identity/create-user`
  const homePath = localePath || '/'
  const isIdentityFlowPage = isIdentityFlowPath(pathname)

  if (status === 'checking') {
    return <PageLoader label={t('identity.sessionLoading')} minHeight="100dvh" />
  }

  if (status === 'error') {
    return (
      <Center mih="100vh" p="md">
        <Alert color="red" title={t('identity.sessionCheckError')}>
          <Stack gap="sm">
            <Text>{t('identity.sessionCheckErrorDescription')}</Text>
            <AppButton onClick={retry}>{t('identity.retry')}</AppButton>
          </Stack>
        </Alert>
      </Center>
    )
  }

  if (status === 'inactive' && !isIdentityFlowPage) {
    return <Navigate to={createUserPath} replace />
  }

  if (status === 'active' && isIdentityFlowPage) {
    return <Navigate to={homePath} replace />
  }

  return children
}
