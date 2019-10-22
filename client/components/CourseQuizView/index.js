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

  const getWeeklyQuestions = async () => {
    const { available, deadline, open, questions } = await quizService.getByCourse(name, part)
    setAvailable(available)
    setDeadline(deadline && new Date(deadline))
    setOpen(open && new Date(open))
    setQuestions(questions)
  }
  useEffect(() => { getWeeklyQuestions() }, [])

  const locked = (((user.quizAnswers || {})[name] || {})[part] || {}).locked || false

  if (locked && !available) {
    return <QuizSolutionsList part={part} questions={questions} />
  }

  const deadlineHeader = deadline ? `Deadline: ${deadline.toLocaleString()}` : ''
  if (!available) {
    const openingHeader = open ? `Opens: ${open.toLocaleString()}` : ''
    const both = open && deadline ? `Quiz is available between ${open.toLocaleString()} and ${deadline.toLocaleString()}` : ''
    return (
      <div>
        <h2>{both ? both : (open ? openingHeader : deadlineHeader)}</h2>
      </div>
    )
  }
  if (!questions || !questions.length) return <div> No questions here </div>

  return (
    <QuestionList
      locked={locked}
      part={part}
      deadlineHeader={deadlineHeader}
      questions={questions}
    />
  )
}

export default CourseQuizView
