import React from 'react'
import { Message } from 'semantic-ui-react'
import { connect } from 'react-redux'

const Notification = (props) => {
  if (props.notification===null) {
    return null
  }

  const color = props.notification.type ==='success' ? 'green' : 'red'
  return (
    <Message color={color}>
      {props.notification.text}
    </Message>
  )
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification
  }
}

export default connect(mapStateToProps)(Notification)