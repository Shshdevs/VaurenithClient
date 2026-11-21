import { Alert } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { StepperLayout } from '@/presentation/components/StepperLayout'
import { ProjectConfigurationForm } from '@/presentation/forms/Project/ProjectConfiguration'
import { ProjectGeneralInfoForm } from '@/presentation/forms/Project/ProjectGeneralInfo'
import type { ProjectGeneralInfoValues } from '@/presentation/forms/Project/ProjectGeneralInfo'
import { useIdentityAuth } from '@/presentation/hooks/app/identity/useIdentityAuth'
import { useProjectsApi } from '@/presentation/hooks/app/backend/projects/useProjectsApi'
import { Braces, Edit3Icon } from 'lucide-react'

type CreateProjectFormValues = ProjectGeneralInfoValues & {
  configuration: string
}

export function CreateProjectPage() {
  const { t } = useTranslation('presentation')
  const navigate = useNavigate()
  const projectsApi = useProjectsApi()
  const identityAuth = useIdentityAuth()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<CreateProjectFormValues>({
    initialValues: {
      name: '',
      description: '',
      projectType: 'software',
      version: 1,
      configuration: '',
    },
    validate: {
      name: (value) => {
        if (!value.trim()) return t('projects.forms.generalInfo.projectNameBlank')
        if (value.length > 255) return t('projects.forms.generalInfo.projectNameTooLong')
        return null
      },
      version: (value) => {
        const version = Number(value)
        if (value === '' || !Number.isFinite(version)) return t('projects.forms.generalInfo.projectVersionBlank')
        if (!Number.isSafeInteger(version) || version < 1) {
          return t('projects.forms.generalInfo.projectVersionInvalid')
        }
        return null
      },
      configuration: (value) => {
        if (!value.trim()) return null

        try {
          const configuration: unknown = JSON.parse(value)
          return isRecord(configuration) && !Array.isArray(configuration)
            ? null
            : t('projects.forms.configuration.objectRequired')
        } catch {
          return t('projects.forms.configuration.invalidJSON')
        }
      },
    },
  })

  const continueFromGeneralInfo = () => {
    const nameValidation = form.validateField('name')
    const versionValidation = form.validateField('version')
    return !nameValidation.hasError && !versionValidation.hasError
  }

  const createProject = async () => {
    const validation = form.validate()
    if (validation.hasErrors) return false

    const token = identityAuth.getAccessToken()
    if (!token) {
      setError(t('projects.forms.sessionExpired'))
      return false
    }

    setError(null)
    setIsSubmitting(true)

    try {
      const metadata = form.values.configuration.trim()
        ? (JSON.parse(form.values.configuration) as Record<string, unknown>)
        : null

      await projectsApi.createProject(token, {
        name: form.values.name.trim(),
        description: form.values.description.trim() || null,
        projectType: form.values.projectType,
        version: Number(form.values.version),
        metadata,
      })

      navigate('/projects', { replace: true })
      return true
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('projects.forms.createError'))
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {error && (
        <Alert color="red" mb="md" title={t('projects.forms.createErrorTitle')}>
          {error}
        </Alert>
      )}
      <StepperLayout
        steps={[
          {
            label: t('projects.forms.generalInfo.title'),
            info: t('projects.forms.generalInfo.description'),
            icon: Edit3Icon,
            nextLabel: t('projects.forms.nextStep'),
            onNext: continueFromGeneralInfo,
            children: (
              <ProjectGeneralInfoForm
                values={form.values}
                errors={{
                  name: typeof form.errors.name === 'string' ? form.errors.name : undefined,
                  version: typeof form.errors.version === 'string' ? form.errors.version : undefined,
                }}
                onChange={(values) => {
                  form.setValues(values)
                  setError(null)
                }}
              />
            ),
          },
          {
            label: t('projects.forms.configuration.title'),
            info: t('projects.forms.configuration.description'),
            icon: Braces,
            nextLabel: t('projects.forms.createProject'),
            isLoading: isSubmitting,
            onNext: createProject,
            children: (
              <ProjectConfigurationForm
                value={form.values.configuration}
                error={typeof form.errors.configuration === 'string' ? form.errors.configuration : undefined}
                onChange={(value) => {
                  form.setFieldValue('configuration', value)
                  setError(null)
                }}
              />
            ),
          },
        ]}
      />
    </>
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
