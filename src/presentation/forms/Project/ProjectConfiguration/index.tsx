import { TextArea } from '@/presentation/components/InputField'
import { useTranslation } from 'react-i18next'

type ProjectConfigurationFormProps = {
  value: string
  error?: string
  onChange: (value: string) => void
}

export function ProjectConfigurationForm({ value, error, onChange }: ProjectConfigurationFormProps) {
  const { t } = useTranslation('presentation')

  return (
    <TextArea
      value={value}
      label={t('projects.forms.configuration.configurationTitle')}
      placeholder={t('projects.forms.configuration.configurationAdd')}
      isError={Boolean(error)}
      errorDescription={error}
      onChange={onChange}
    />
  )
}
