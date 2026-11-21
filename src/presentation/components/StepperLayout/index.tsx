import { Group, Stepper } from '@mantine/core'
import type { StepperProps } from './types'
import { useState } from 'react'
import css from './index.module.scss'
import { AppButton } from '../AppButton'

export const StepperLayout = ({ steps }: StepperProps) => {
  const [active, setActive] = useState(0)
  const nextStep = () => setActive((current) => (current < steps.length ? current + 1 : current))
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current))

  return (
    <div className={css.container}>
      <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false}>
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <Stepper.Step
              label={step.label}
              description={step.info}
              icon={Icon ? <Icon /> : null}
              completedIcon={Icon ? <Icon /> : null}
            >
              {step.children}
            </Stepper.Step>
          )
        })}

        <Stepper.Completed>Completed</Stepper.Completed>
      </Stepper>
      <Group justify="end" mt="xl">
        <AppButton variant="default" onClick={prevStep}>
          Back
        </AppButton>
        <AppButton onClick={nextStep}>{active != steps.length ? <div>Next Step</div> : <div>Complete</div>}</AppButton>
      </Group>
    </div>
  )
}
