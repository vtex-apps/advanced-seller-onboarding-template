import React from 'react'
import { Checkbox } from 'vtex.styleguide'

import type { OnboardingStatus } from '../../node/typings/invitations'

type StatusFilters = {
  [key in OnboardingStatus]: boolean
}

export default function StatusSelector({ onChange, value }) {
  let filters: StatusFilters = {
    Approved: true,
    Rejected: true,
    Lead: true,
    Prelead: true,
    Signed: true,
    Connected: true,
  }

  filters = { ...filters, ...(value || {}) }

  const toggleValueByKey = (key) => {
    return {
      ...(value || filters),
      [key]: value ? !value[key] : false,
    }
  }

  return (
    <div>
      {Object.keys(filters).map((key, index) => (
        <div className="mb3" key={`class-statment-object-${key}-${index}`}>
          <Checkbox
            checked={value ? value[key] : filters[key]}
            id={`class-${key}`}
            label={key}
            name="class-checkbox-group"
            onChange={() => {
              const newValue = toggleValueByKey(key)

              onChange(newValue)
            }}
            value={key}
          />
        </div>
      ))}
    </div>
  )
}
