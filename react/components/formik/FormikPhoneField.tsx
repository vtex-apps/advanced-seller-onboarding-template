import React from 'react'
import { useField } from 'formik'
import { PhoneField } from 'vtex.phone-field'

export function FormikPhoneField({ id, ...props }) {
  const [field, meta, { setTouched, setValue }] = useField(id)

  const handleChange = (phone) => {
    setTouched(true)
    setValue(phone)
  }

  return (
    <PhoneField
      id={id}
      name={field.name}
      value={field.value}
      errorMessage={meta.touched ? meta.error : ''}
      onChange={({ value }) => handleChange(value)}
      onBlur={field.onBlur}
      {...props}
    />
  )
}
