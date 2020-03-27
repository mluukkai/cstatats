import React from 'react'
import cn from 'classnames'

const Icon = ({ name, className, ...props }) => {
  const classNames = cn(name, 'icon', className)

  return <i className={classNames} {...props} />
}

export default Icon
