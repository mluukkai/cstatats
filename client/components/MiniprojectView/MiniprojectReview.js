import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PeerReview from 'Components/PeerReview'
import { callApi } from 'Utilities/apiConnection'
import { clearNotification, setNotification } from 'Utilities/redux/notificationReducer'
import { setPeerReview } from 'Utilities/redux/userReducer'

const MiniprojectReview = () => {
  const { user } = useSelector(({ user }) => ({ user }))
  const dispatch = useDispatch()
  if (user.peerReview) {
    return <div style={{ paddingTop: 10 }}><em>Olet jättänyt vertaispalautteen!</em></div>
  }

  if (user.projectAccepted) return null
  if (!user.project) return null

  const createPeerReview = async (answers) => {
    try {
      const response = await callApi(`/users/${user.username}/peer_review`, 'post', answers)
      const newUser = { ...user, peerReview: response.data }
      dispatch(setPeerReview(newUser))
      dispatch(setNotification('peer review created'))
      setTimeout(() => { dispatch(clearNotification()) }, 8000)
    } catch (response) {
      console.log(response)
    }
  }

  return (
    <div style={{ paddingTop: 10 }}>
      <PeerReview
        users={user.project.users}
        createPeerReview={createPeerReview}
      />
    </div>
  )
}

export default MiniprojectReview
