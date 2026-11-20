import { StepperLayout } from '@/presentation/components/StepperLayout'
import { Edit3Icon } from 'lucide-react'

export function CreateProjectPage() {
  return (
    <StepperLayout
      steps={[
        {
          label: 'General',
          info: 'Define the basic properties of your project',
          icon: Edit3Icon,
          children: <div />,
        },
        {
          label: 'Configuration (Optional)',
          info: 'Define your project configuration',
          children: <div />,
        },
      ]}
    />
  )
}
