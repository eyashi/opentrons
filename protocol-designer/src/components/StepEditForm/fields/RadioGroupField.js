// @flow
import * as React from 'react'
import { RadioGroup } from '@opentrons/components'
import type { StepFieldName } from '../../../steplist/fieldLevel'
import type { FocusHandlers } from '../types'
import { FieldConnector } from './FieldConnector'

type RadioGroupFieldProps = {|
  ...FocusHandlers,
  name: StepFieldName,
  options: $PropertyType<React.ElementProps<typeof RadioGroup>, 'options'>,
|}

export const RadioGroupField = (props: RadioGroupFieldProps) => {
  const {
    name,
    onFieldFocus,
    onFieldBlur,
    focusedField,
    dirtyFields,
    ...radioGroupProps
  } = props
  return (
    <FieldConnector
      name={name}
      focusedField={focusedField}
      dirtyFields={dirtyFields}
      render={({ value, updateValue, errorToShow }) => (
        <RadioGroup
          {...radioGroupProps}
          value={value ? String(value) : ''}
          error={errorToShow}
          onChange={(e: SyntheticEvent<*>) => {
            updateValue(e.currentTarget.value)
            onFieldBlur(name)
          }}
        />
      )}
    />
  )
}
