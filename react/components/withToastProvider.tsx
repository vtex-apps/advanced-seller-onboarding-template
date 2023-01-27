import React from 'react'
import { ToastProvider } from 'vtex.styleguide'

export default function withToastProvider<T>(
  WrappedComponent: React.ComponentType<T>
) {
  // eslint-disable-next-line react/display-name
  return (props: T) => (
    <ToastProvider positioning="window">
      <WrappedComponent {...props} />
    </ToastProvider>
  )
}
