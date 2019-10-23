import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import quizService from 'Services/quiz'
import QuestionList from 'Components/CourseQuizView/QuestionList'
import QuizSolutionsList from 'Components/CourseQuizView/QuizSolutionsList'

const CourseQuizView = ({ match }) => {
  const { part } = match.params
  const { course, user } = useSelector(({ course, user }) => ({ course, user }))
  const { name } = course.info

  const [available, setAvailable] = useState(undefined)
  const [deadline, setDeadline] = useState(undefined)
  const [open, setOpen] = useState(undefined)
  const [questions, setQuestions] = useState([])
  const [description, setDescription] = useState('')

  const getWeeklyQuestions = async () => {
    const { available, deadline, open, questions, desc } = await quizService.getByCourse(name, part)
    setAvailable(available)
    setDeadline(deadline && new Date(deadline))
    setOpen(open && new Date(open))
    setQuestions(questions)
    setDescription(desc)
  }
  useEffect(() => { getWeeklyQuestions() }, [])
  if (!questions || !questions.length) return <div> No questions here </div>

  const locked = (((user.quizAnswers || {})[name] || {})[part] || {}).locked || false

  const deadlineHeader = deadline ? `Deadline: ${deadline.toLocaleString()}` : ''
  if (!available && !locked) {
    const openingHeader = open ? `Opens: ${open.toLocaleString()}` : ''
    const both = open && deadline ? `Quiz is available between ${open.toLocaleString()} and ${deadline.toLocaleString()}` : ''
    return (
      <div>
        <h2>{both ? both : (open ? openingHeader : deadlineHeader)}</h2>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: '3em' }}>
      <h1>{deadlineHeader}</h1>
      <div style={{ fontSize: 'large' }} dangerouslySetInnerHTML={{ __html: description }}></div>
      {locked && !available
        ? (<QuizSolutionsList part={part} questions={questions} />)
        : (
          <>
            <QuestionList
              locked={locked}
              part={part}
              questions={questions}
            />
          </>
        )}
    </div>


  )
}

export default CourseQuizView
