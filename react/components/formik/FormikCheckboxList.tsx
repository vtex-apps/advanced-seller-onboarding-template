import React from 'react'
import { Checkbox } from 'vtex.styleguide'
import { applyModifiers, useCssHandles } from 'vtex.css-handles'
import { useField } from 'formik'

export interface CheckboxItem {
  label: string
  value: any
  isChecked?: boolean
}

interface CheckboxListProps {
  id: string
  options: CheckboxItem[]
  label: string | JSX.Element
  disabled?: boolean
  inputHandle?: string
}

const cssNames = [
  'checkboxListContainer',
  'checkboxListError',
  'checkboxListLabel',
  'checkboxListItem',
] as const

export function FormikCheckboxList({
  id,
  options,
  label,
  disabled = false,
  inputHandle = '',
}: CheckboxListProps) {
  const handles = useCssHandles(cssNames)
  const [field, meta] = useField(id)

  const hasError = meta.touched && !!meta.error

  return (
    <div
      className={`
        ${handles.checkboxListContainer}
        ${applyModifiers(inputHandle, id)}
      `}
    >
      <span
        className={`
          ${handles.checkboxListLabel}
          ${!hasError ? 'mb3' : ''}
          db w-100 c-on-base t-small
        `}
      >
        {label}
      </span>

      {hasError ? (
        <span
          className={`${handles.checkboxListError} w-100 mb3 c-danger t-small lh-title`}
        >
          {meta.error}
        </span>
      ) : undefined}

      {options.map((option, index) => (
        <div
          id={`checkbox-li-${field.name}-${index}`}
          key={`checkbox-li-${field.name}-${index}`}
          className={`${handles.checkboxListItem} mb3`}
        >
          <Checkbox
            id={option.value}
            key={`key-${field.name}-${index}`}
            name={field.name}
            value={option.value}
            label={option.label}
            checked={field.value?.includes(option.value)}
            disabled={disabled}
            onChange={(e) => {
              field.onBlur(e)
              field.onChange(e)
            }}
          />
        </div>
      ))}
    </div>
  )
}
