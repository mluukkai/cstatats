const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  const style = {
    color: notification.type ==='error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderTadius: 5,
    padding: 10,
    marginBottom: 10
  }


  return (
    <div style={style}>
      {notification.content}
    </div>
  )
}

export default Notification