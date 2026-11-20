import { NumberInput, Select, TextInput } from '@mantine/core'
import type { DropdownFieldValue, NumberFieldValue, TextFieldValue } from './types'

export const TextField = (props: TextFieldValue) => {
  const LeadingIcon = props.leadingIcon
  const TrailingIcon = props.trailingIcon
  return (
    <TextInput
      label={props.label}
      description={props.description}
      placeholder={props.placeholder}
      required={props.required}
      leftSection={LeadingIcon ? <LeadingIcon /> : null}
      rightSection={TrailingIcon ? <TrailingIcon onClick={props.onTrailingIconClick} /> : null}
      loading={props.isLoading}
      error={props.isError ? props.errorDescription : null}
      radius="md"
      onChange={(event) => props.onChange(event.currentTarget.value)}
    />
  )
}

export const NumberField = (props: NumberFieldValue) => {
  const LeadingIcon = props.leadingIcon
  const TrailingIcon = props.trailingIcon
  return (
    <NumberInput
      label={props.label}
      description={props.description}
      placeholder={props.placeholder}
      required={props.required}
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
  const TrailingIcon = props.trailingIcon

  return (
    <Select
      label={props.label}
      description={props.description}
      placeholder={props.placeholder}
      required={props.required}
      leftSection={LeadingIcon ? <LeadingIcon /> : null}
      rightSection={TrailingIcon ? <TrailingIcon onClick={props.onTrailingIconClick} /> : null}
      loading={props.isLoading}
      searchable={true}
      error={props.isError ? props.errorDescription : null}
      radius="md"
      data={props.options}
      size="md"
      clearable={!TrailingIcon}
      onChange={(value) => {
        if (value !== null) props.onChange(value)
      }}
    />
  )
}
