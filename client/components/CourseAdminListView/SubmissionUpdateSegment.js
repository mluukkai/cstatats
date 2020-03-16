import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Button, Segment, Input } from 'semantic-ui-react'
import studentService from 'Services/student'

const SubmissionUpdateSegment = ({ student, getStudents }) => {
  const { courseName, possibleExercises } = useSelector(({ course }) => ({
    courseName: course.info.name,
    possibleExercises: course.info.exercises,
  }))
  const [loading, setLoading] = useState(false)
  const [week, setWeek] = useState(0)
  const [time, setTime] = useState(0)
  const [github, setGithub] = useState('')
  const [comment, setComment] = useState('')
  const [exercises, setExercises] = useState([])
  const { username } = student

  const selectWeek = async () => {
    const submission = await studentService.getSubmission(courseName, week, username)

    setExercises(submission.exercises || [])
    setGithub(submission.github || '')
    setComment(submission.comment || '')
    setTime(submission.time || 0)
  }

  useEffect(() => {
    selectWeek()
  }, [week])

  const updateSubmissions = async () => {
    if (!confirm('Are you sure you want to update?')) return
    setLoading(true)

    const payload = {
      exercises,
      github,
      comment,
      time,
    }

    await studentService.updateSubmission(courseName, week, username, payload)
    await getStudents()
    setLoading(false)
  }

  const deleteSubmissions = async () => {
    if (!confirm(`DELETE SUBMISSION FOR WEEK ${week} - THIS IS PERMANENT AND IS AN ACTUAL DELETE FROM DATABASE`)) return
    setLoading(true)

    await studentService.deleteSubmission(courseName, week, username)
    await selectWeek()
    await getStudents()
    setLoading(false)
  }

  const exerciseCheckboxes = []
  for (let i = 1; i <= possibleExercises[week]; i++) { exerciseCheckboxes.push(i) }

  const onCheckChange = exerciseNumber => () => {
    const wasInList = exercises.find(e => e === exerciseNumber)
    const newExercises = wasInList
      ? exercises.filter(e => e !== exerciseNumber)
      : [...exercises, exerciseNumber]
    setExercises(newExercises)
  }

  const checks = exerciseCheckboxes.map(exerciseNumber => (
    <span key={exerciseNumber} style={{ padding: 2 }}>
      <span>{exerciseNumber}</span>
      <input
        type="checkbox"
        onChange={onCheckChange(exerciseNumber)}
        checked={exercises.find(e => e === exerciseNumber) || false}
        name={exerciseNumber}
      />
    </span>
  ))

  return (
    <Segment>
      <Input type="number" label="Week" value={week} onChange={e => setWeek(Number(e.target.value))} />
      <br />
      {checks}
      <br />
      <Input type="number" label="Hours" value={time} onChange={e => setTime(Number(e.target.value))} />
      <br />
      <Input label="Github" value={github} onChange={e => setGithub(e.target.value)} />
      <br />
      <Input label="Comments" value={comment} onChange={e => setComment(e.target.value)} />
      <br />
      <Button disabled={loading} onClick={updateSubmissions}>Update submission</Button>
      <Button disabled={loading} onClick={deleteSubmissions}>Delete submission</Button>
    </Segment>
  )
}

export default SubmissionUpdateSegment
