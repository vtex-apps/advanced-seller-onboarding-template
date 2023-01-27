import React from 'react'
import { Dropdown } from 'vtex.styleguide'
import { useField } from 'formik'
import { applyModifiers } from 'vtex.css-handles'

export function FormikDropdown({ id, inputHandle = '', ...props }) {
  const [field, meta] = useField(id)

  const handleChange = (e) => {
    field.onBlur(e)
    field.onChange(e)
  }

  return (
    <div className={`mb5 ${applyModifiers(inputHandle, id)}`}>
      <Dropdown
        id={id}
        name={field.name}
        value={field.value}
        errorMessage={meta.touched ? meta.error : ''}
        onChange={handleChange}
        {...props}
      />
    </div>
  )
}
