import { Alert, Badge, Card, Container, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Project } from '@/domain/projects/Project'
import { AppButton } from '@/presentation/components/AppButton'
import { EmptyState } from '@/presentation/components/EmptyState'
import { PageLoader } from '@/presentation/components/PageLoader'
import { useIdentityAuth } from '@/presentation/hooks/app/identity/useIdentityAuth'
import { useProjectsApi } from '@/presentation/hooks/app/backend/projects/useProjectsApi'
import { useApiResource } from '@/presentation/hooks/api/useApiResource'
import { formatDate } from '@/presentation/utils/date/formatDate'
import { Plus } from 'lucide-react'

export function ProjectsPage() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation('presentation')
  const projectsApi = useProjectsApi()
  const identityAuth = useIdentityAuth()
  const token = identityAuth.getAccessToken()
  const request = useMemo(
    () =>
      token
        ? (signal: AbortSignal) => projectsApi.getProjects(token, signal).then((response) => response.data ?? [])
        : null,
    [projectsApi, token]
  )
  const { state, retry } = useApiResource(request)

  if (state.status === 'idle' || state.status === 'error') {
    return (
      <Container fluid py="xl">
        <Alert color="red" title={t('projects.loadError')}>
          <Stack gap="sm">
            <Text>{t('projects.loadErrorDescription')}</Text>
            <div>
              <AppButton onClick={retry}>{t('projects.retry')}</AppButton>
            </div>
          </Stack>
        </Alert>
      </Container>
    )
  }

  if (state.status === 'loading') {
    return (
      <Container fluid py="xl">
        <PageLoader label={t('projects.loading')} />
      </Container>
    )
  }

  if (state.data.length === 0) {
    return (
      <EmptyState
        fragmentName="CodeFolder"
        title={t('projects.noProjectsTitle')}
        description={t('projects.noProjectsDescription')}
        actions={[
          {
            label: t('projects.createFirstProject'),
            icon: Plus,
            onClick: () => navigate('/projects/new'),
          },
        ]}
      />
    )
  }

  return (
    <Container fluid py="xl">
      <Stack gap="lg">
        <Title order={1}>{t('projects.title')}</Title>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {state.data.map((project: Project) => (
            <Card key={project.id} withBorder padding="lg" radius="md">
              <Stack gap="md">
                <div>
                  <Title order={3}>{project.name}</Title>
                  <Text c="dimmed" size="sm">
                    {project.slug}
                  </Text>
                </div>
                <Text lineClamp={3}>{project.description || t('projects.noDescription')}</Text>
                <Group gap="xs">
                  <Badge>{t(`projects.types.${project.projectType}`)}</Badge>
                  <Badge color={project.status === 'active' ? 'green' : 'gray'}>
                    {t(`projects.statuses.${project.status}`)}
                  </Badge>
                </Group>
                <Text c="dimmed" size="sm">
                  {t('projects.updatedAt', {
                    date: formatDate(project.updatedAt, i18n.resolvedLanguage ?? i18n.language),
                  })}
                </Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  )
}
