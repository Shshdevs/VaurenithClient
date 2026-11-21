import { useTranslation } from 'react-i18next'
import type { ProjectType } from '@/domain/projects/Project'
import { DropdownField, NumberField, TextArea, TextField } from '@/presentation/components/InputField'
import css from './index.module.scss'

export type ProjectGeneralInfoValues = {
  name: string
  description: string
  projectType: ProjectType
  version: number | string
}

export type ProjectGeneralInfoFormProps = {
  values: ProjectGeneralInfoValues
  errors: Partial<Record<'name' | 'version', string>>
  onChange: (values: Partial<ProjectGeneralInfoValues>) => void
}

const projectTypes: ProjectType[] = ['software', 'infrastructure', 'fullstack', 'other']

export function ProjectGeneralInfoForm({ values, errors, onChange }: ProjectGeneralInfoFormProps) {
  const { t } = useTranslation('presentation')

  return (
    <div className={css.form}>
      <TextField
        value={values.name}
        label={t('projects.forms.generalInfo.projectName')}
        placeholder={t('projects.forms.generalInfo.projectNamePlaceholder')}
        required
        isError={Boolean(errors.name)}
        errorDescription={errors.name}
        onChange={(value) => onChange({ name: value })}
      />
      <TextArea
        value={values.description}
        label={t('projects.forms.generalInfo.projectDescription')}
        placeholder={t('projects.forms.generalInfo.projectDescriptionPlaceholder')}
        maxLength={255}
        onChange={(value) => onChange({ description: value })}
      />
      <div className={css.row}>
        <DropdownField
          value={values.projectType}
          label={t('projects.forms.generalInfo.projectType')}
          placeholder={t('projects.forms.generalInfo.projectTypePlaceholder')}
          options={projectTypes.map((value) => ({ value, label: t(`projects.types.${value}`) }))}
          onChange={(value) => onChange({ projectType: value as ProjectType })}
        />
        <NumberField
          value={values.version}
          label={t('projects.forms.generalInfo.version')}
          placeholder={t('projects.forms.generalInfo.versionPlaceholder')}
          required
          min={1}
          max={Number.MAX_SAFE_INTEGER}
          step={1}
          allowDecimal={false}
          allowNegative={false}
          clampBehavior="strict"
          isError={Boolean(errors.version)}
          errorDescription={errors.version}
          onChange={(value) => onChange({ version: value })}
        />
      </div>
    </div>
  )
}
