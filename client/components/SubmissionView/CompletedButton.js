import React, { useState } from 'react'
import { Button } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserAction, setCourseCompletedAction, setCourseNotCompletedAction } from 'Utilities/redux/userReducer'

const CompletedButton = () => {
  const dispatch = useDispatch()
  const [sure, setSure] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const { completed, courseName } = useSelector(({ course, user }) => {
    const courseName = (course.info || {}).name
    const { completed } = (((user || {}).courseProgress || []).find(c => c.courseName === courseName) || {})

    return { completed, courseName }
  })
  const handleToggleCompleted = async () => {
    setTimeout(() => setDisabled(false), 1000)
    setDisabled(true)
    if (!sure) return setSure(true)
    setSure(false)

    if (completed) await dispatch(setCourseNotCompletedAction(courseName))
    if (!completed) await dispatch(setCourseCompletedAction(courseName))

    dispatch(getUserAction())
  }

  const getText = () => {
    if (!completed && !sure) {
      return 'If you want to end your completion and get reviewed, press here.'
    }
    if (!completed && sure) {
      return 'Are you sure? Make sure everything is ready for submission.'
    }
    if (completed && !sure) {
      return 'If you want to continue your progress, press here.'
    }
    if (completed && sure) {
      return 'Press again to continue your progress.'
    }
  }

  const text = getText()
  return (
    <Button type="button" onClick={handleToggleCompleted} disabled={disabled} color={sure ? 'orange' : 'vk'}>
      {text}
    </Button>
  )
}

export default CompletedButton
