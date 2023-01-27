import React from 'react'
import { RadioGroup } from 'vtex.styleguide'
import { useField } from 'formik'
import { applyModifiers } from 'vtex.css-handles'

export function FormikRadioGroup({ id, inputHandle = '', ...props }) {
  const [field, meta] = useField(id)

  return (
    <div className={`mb5 ${applyModifiers(inputHandle, id)}`}>
      <RadioGroup
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
