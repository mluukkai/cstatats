import React from 'react'
import cn from 'classnames'

import styles from './TableSortLabel.module.css'

const iconClassNameByOrderDirection = {
  asc: 'sort up icon',
  desc: 'sort down icon',
}

const getIconClassName = orderDirection => {
  const defaultClassName = 'sort icon'

  return orderDirection
    ? iconClassNameByOrderDirection[orderDirection] || defaultClassName
    : defaultClassName
}

const TableSortLabel = ({ direction, children, className, ...props }) => {
  const iconClassName = getIconClassName(direction)

  return (
    <span className={cn(styles.tableSortLabel, className)} role="button" {...props}>
      <i className={iconClassName} />
      {children}
    </span>
  )
}

export default TableSortLabel
