import { useState, useImperativeHandle, forwardRef } from 'react'
import { SmallButton } from './styled'

const Togglable = forwardRef((props, ref) => {
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
    <div style={{ marginTop: 20 }}>
      <div style={hideWhenVisible}>
        <SmallButton onClick={toggleVisibility}>{props.buttonLabel}</SmallButton>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <SmallButton onClick={toggleVisibility}>cancel</SmallButton>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable