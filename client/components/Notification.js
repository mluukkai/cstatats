import React from 'react'
import { Message } from 'semantic-ui-react'
import { connect } from 'react-redux'

const Notification = ({ notification }) => {
  if (!notification || !notification.text) return null

  const color = notification.type === 'success' ? 'green' : 'red'
  return (
    <Message color={color}>
      {notification.text}
    </Message>
  )
}

const mapStateToProps = (state, ownProps) => ({
  notification: state.notification || ownProps.notification,
})

export default connect(mapStateToProps)(Notification)
