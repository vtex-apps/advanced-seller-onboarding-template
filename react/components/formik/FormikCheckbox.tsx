import React from 'react'
import { Checkbox } from 'vtex.styleguide'
import { useField } from 'formik'

export function FormikCheckbox({ id, ...props }) {
  const [field, meta] = useField({ name: id, type: 'checkbox' })

  return (
    <div>
      <Checkbox
        id={id}
        name={field.name}
        checked={field.checked}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        {...props}
      />

      {meta.touched && meta.error ? (
        <span className="w-100 mb3 c-danger t-small lh-title">
          {meta.error}
        </span>
      ) : undefined}
    </div>
  )
}
