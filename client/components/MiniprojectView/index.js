import React from 'react'
import { useSelector } from 'react-redux'
import MiniprojectProject from 'Components/MiniprojectView/MiniprojectProject'
import MiniprojectReview from 'Components/MiniprojectView/MiniprojectReview'
import MiniprojectForm from 'Components/MiniprojectView/MiniprojectForm'

const MiniprojectView = () => {
  const { user } = useSelector(({ user }) => ({ user }))

  if (!user) return null

  return (
    <div>
      <MiniprojectForm />
      <MiniprojectProject />
      <MiniprojectReview />
    </div>
  )
}

export default MiniprojectView
