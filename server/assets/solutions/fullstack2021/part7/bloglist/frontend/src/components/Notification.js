import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from '@material-ui/lab'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  if ( !notification ) {
    return null
  }

  return <Alert severity={notification.type} style={{ marginBottom: 10, marginTop: 10 }} >
    {notification.message}
  </Alert>
}

export default Notification