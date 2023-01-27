import React from 'react'
import { Input } from 'vtex.styleguide'
import { useField } from 'formik'
import { applyModifiers } from 'vtex.css-handles'

export function FormikInput({ id, inputHandle = '', ...props }) {
  const [field, meta] = useField(id)

  return (
    <div className={`mb5 ${applyModifiers(inputHandle, id)}`}>
      <Input
        id={id}
        name={field.name}
        value={field.value}
        errorMessage={meta.touched ? meta.error : ''}
        onChange={field.onChange}
        onBlur={field.onBlur}
        {...props}
      />
    </div>
  )
}
