import { STATUS_COLORS } from './constants'
import { Tag } from 'vtex.styleguide'
import React from 'react'

export const getTotalizerWithColorValue = (label: string, value?: string) => (
  <Tag bgColor={STATUS_COLORS[label]} color="#fff">
    <span className="nowrap">{value}</span>
  </Tag>
)
