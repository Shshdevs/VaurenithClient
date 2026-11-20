import { Alert, Container, Paper, Stack, Title, Text } from '@mantine/core'
import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from 'react'
import { useIdentityApi } from '@/presentation/hooks/app/backend/identity/useIdentityApi'
import { useIdentityAuth } from '@/presentation/hooks/app/identity/useIdentityAuth'
import { usePlatform } from '@/presentation/hooks/app/platform/usePlatform'
import { BrandLogo } from '@/presentation/components/BrandLogo'
import { AppButton } from '@/presentation/components/AppButton'
import { completeIdentityFlow } from './identityFlow'
import { NICKNAME_STORAGE_KEY } from '@/presentation/app/identity/consts'
import css from './index.module.scss'

export function AuthPage() {
  const { t } = useTranslation('presentation')
  const platform = usePlatform()
  const identityApi = useIdentityApi()
  const identityAuth = useIdentityAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const authorizationStarted = useRef(false)

  useEffect(() => {
    if (authorizationStarted.current) return
    authorizationStarted.current = true

    void completeIdentityFlow({ identityApi, identityAuth, platform })
      .then((nickname) => {
        if (!nickname) return
        localStorage.setItem(NICKNAME_STORAGE_KEY, nickname)
        window.location.reload()
      })
      .catch((cause: unknown) => setError(getAuthorizationError(cause, t)))
  }, [identityApi, identityAuth, platform, t])

  const authorize = async (mode: 'register' | 'login') => {
    setError(null)
    setIsSubmitting(true)
    try {
      await identityAuth.authorize(mode)
    } catch (cause) {
      setError(getAuthorizationError(cause, t))
      setIsSubmitting(false)
    }
  }

  return (
    <main className={css.page}>
      <Container fluid className={css.container}>
        <Paper className={css.card} withBorder>
          <Container className={css.formPanel} mb="md">
            <BrandLogo large className={css.brandLogo} />
            <Title mb="md" order={1} className={css.title}>
              {t('registration.title')}
            </Title>
            <Text mb="xl" className={css.quote}>
              {t('registration.quote')}
            </Text>
            <Stack className={css.actions}>
              {error && <Alert color="red">{error}</Alert>}
              <AppButton
                className={css.actionButton}
                fullWidth
                disabled={isSubmitting}
                onClick={() => void authorize('register')}
              >
                {t('registration.createAccount')}
              </AppButton>
              <AppButton
                className={css.actionButton}
                fullWidth
                variant="default"
                disabled={isSubmitting}
                onClick={() => void authorize('login')}
              >
                {t('registration.signIn')}
              </AppButton>
            </Stack>
          </Container>
        </Paper>
      </Container>
    </main>
  )
}

function getAuthorizationError(cause: unknown, t: TFunction<'presentation'>): string {
  return cause instanceof Error && cause.message
    ? t('registration.oidcErrorDetails', { reason: cause.message })
    : t('registration.oidcError')
}
