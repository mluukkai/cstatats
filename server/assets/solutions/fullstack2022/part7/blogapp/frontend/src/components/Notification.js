import { useSelector } from 'react-redux'

import { Info } from '.'

const Notification = () => {
  const notification = useSelector(({ notification }) => notification)

  if (notification === null) {
    return null
  }

  return (
    <Info alert={notification.type === 'alert'}>{notification.message}</Info>
  )
}

export default Notification
