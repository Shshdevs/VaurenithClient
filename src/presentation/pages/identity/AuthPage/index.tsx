import { Alert, Button, Container, Paper, Stack, Title } from '@mantine/core'
import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from 'react'
import { useIdentityApi } from '@/presentation/app/identity/useIdentityApi'
import { useIdentityAuth } from '@/presentation/app/identity/useIdentityAuth'
import { usePlatform } from '@/presentation/app/usePlatform'
import { BrandLogo } from '@/presentation/components/BrandLogo'
import { completeIdentityFlow } from './identityFlow'
import css from './index.module.scss'

const NICKNAME_KEY = 'vaurenith.nickname'

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
        localStorage.setItem(NICKNAME_KEY, nickname)
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
      <Container size={440}>
        <Paper className={css.card} withBorder p="xl" radius="lg">
          <BrandLogo className={css.brandLogo} />
          <Title order={1} className={css.title}>
            {t('registration.title')}
          </Title>
          <Stack gap="md">
            {error && <Alert color="red">{error}</Alert>}
            <Button fullWidth disabled={isSubmitting} onClick={() => void authorize('register')}>
              {t('registration.createAccount')}
            </Button>
            <Button fullWidth variant="default" disabled={isSubmitting} onClick={() => void authorize('login')}>
              {t('registration.signIn')}
            </Button>
          </Stack>
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
