import React, { useState, useImperativeHandle } from 'react'
import { Button } from '@material-ui/core'

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div style={{ marginTop: 10 }}>
      <div style={hideWhenVisible}>
        <Button variant="contained" onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        {props.children}
        <Button variant="contained" onClick={toggleVisibility}>cancel</Button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable