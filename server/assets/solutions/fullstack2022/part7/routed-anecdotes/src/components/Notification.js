const Notification = ({ notification }) => {
  if ( notification===null) {
    return null
  }

  const style={
    padding: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    marginTop: 10
  }

  return <div style={style}>
    {notification}
  </div>
}

export default Notification