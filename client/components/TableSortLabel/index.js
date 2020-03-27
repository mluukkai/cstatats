import React from 'react'
import cn from 'classnames'
import { Icon } from 'semantic-ui-react'

import styles from './TableSortLabel.module.css'

const iconNameByOrderDirection = {
  asc: 'sort up',
  desc: 'sort down',
}

const getIconName = orderDirection => {
  const defaultName = 'sort'

  return orderDirection
    ? iconNameByOrderDirection[orderDirection] || defaultName
    : defaultName
}

const TableSortLabel = ({ direction, children, className, ...props }) => {
  const iconName = getIconName(direction)

  return (
    <span className={cn(styles.tableSortLabel, className)} role="button" {...props}>
      <Icon name={iconName} />
      {children}
    </span>
  )
}

export default TableSortLabel
