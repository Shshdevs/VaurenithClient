import { NumberInput, Select, Text, Textarea, TextInput } from '@mantine/core'
import type { DropdownFieldValue, NumberFieldValue, TextareaValue, TextFieldValue } from './types'

export const TextField = (props: TextFieldValue) => {
  const LeadingIcon = props.leadingIcon
  const TrailingIcon = props.trailingIcon
  return (
    <TextInput
      value={props.value}
      label={props.label}
      description={props.description}
      placeholder={props.placeholder}
      required={props.required}
      size="md"
      leftSection={LeadingIcon ? <LeadingIcon /> : null}
      rightSection={TrailingIcon ? <TrailingIcon onClick={props.onTrailingIconClick} /> : null}
      loading={props.isLoading}
      error={props.isError ? props.errorDescription : null}
      radius="md"
      onChange={(event) => props.onChange(event.currentTarget.value)}
    />
  )
}

export const TextArea = (props: TextareaValue) => {
  const LeadingIcon = props.leadingIcon
  const TrailingIcon = props.trailingIcon
  return (
    <Textarea
      value={props.value}
      label={props.label}
      description={props.description}
      placeholder={props.placeholder}
      required={props.required}
      rightSection={LeadingIcon ? <LeadingIcon /> : null}
      leftSection={TrailingIcon ? <TrailingIcon onClick={props.onTrailingIconClick} /> : null}
      loading={props.isLoading}
      error={props.isError ? props.errorDescription : null}
      radius="md"
      autosize={true}
      minRows={4}
      bottomSection={
        props.maxLength ? (
          <Text size="xs" c="dimmed">
            {props.value.length}/{props.maxLength} characters
          </Text>
        ) : null
      }
      onChange={(event) => props.onChange(event.currentTarget.value.slice(0, props.maxLength))}
    />
  )
}

export const NumberField = (props: NumberFieldValue) => {
  const LeadingIcon = props.leadingIcon
  const TrailingIcon = props.trailingIcon
  return (
    <NumberInput
      value={props.value}
      label={props.label}
      description={props.description}
      placeholder={props.placeholder}
      required={props.required}
      size="md"
      min={props.min}
      max={props.max}
      step={props.step}
      allowDecimal={props.allowDecimal}
      allowNegative={props.allowNegative}
      clampBehavior={props.clampBehavior}
      leftSection={LeadingIcon ? <LeadingIcon /> : null}
      rightSection={TrailingIcon ? <TrailingIcon onClick={props.onTrailingIconClick} /> : null}
      loading={props.isLoading}
      error={props.isError ? props.errorDescription : null}
      radius="md"
      onChange={props.onChange}
    />
  )
}

export const DropdownField = (props: DropdownFieldValue) => {
  const LeadingIcon = props.leadingIcon

  return (
    <Select
      value={props.value ? props.value : null}
      label={props.label}
      description={props.description}
      placeholder={props.placeholder}
      required={props.required}
      leftSection={LeadingIcon ? <LeadingIcon /> : null}
      loading={props.isLoading}
      searchable={true}
      error={props.isError ? props.errorDescription : null}
      radius="md"
      size="md"
      data={props.options}
      onChange={(_value, option) => {
        if (option !== null) props.onChange(option.value)
      }}
    />
  )
}
