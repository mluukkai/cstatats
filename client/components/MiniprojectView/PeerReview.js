import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { callApi } from 'Utilities/apiConnection'
import PeerReviewQuestion from 'Components/MiniprojectView/PeerReviewQuestion'

const PeerReview = ({ users, createPeerReview }) => {
  const { course } = useSelector(({ course }) => ({ course }))
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [formVisible, setFormVisible] = useState(false)
  const [missingField, setMissingField] = useState({})

  useEffect(() => {
    callApi(`/peer_review/course/${course.info.name}/questions`)
      .then((response) => {
        const questions = response.data
        const initialAnswers = {}
        questions.forEach((q) => {
          initialAnswers[q.id] = q.type === 'rating' ? {} : ''
        })
        setQuestions(questions)
        setAnswers(initialAnswers)
      }).catch((response) => {
        console.log(response)
      })
  }, [])

  useEffect(() => {
    const notAnswered = () => {
      return questions.find((q) => {
        if (q.type === 'rating') {
          const answerCount = Object.keys(answers[q.id]).length
          return answerCount < users.length
        }
        return !answers[q.id].length
      })
    }
    const missingAnswer = notAnswered()
    if (!missingAnswer) return setMissingField(false)
    if (missingAnswer.id === missingField.id) return

    setMissingField(missingAnswer)
  }, [answers])

  const onRadioChange = ({ question, target, value }) => {
    const newAnswers = {
      ...answers,
      [question]: {
        ...answers[question],
        [target]: value,
      },
    }
    setAnswers(newAnswers)
  }

  const onChange = ({ target }) => {
    const question = target.name
    const newAnswers = {
      ...answers,
      [question]: target.value,
    }
    setAnswers(newAnswers)
  }

  const create = () => {
    if (missingField) return alert(`Please answer "${missingField.title}"`)

    createPeerReview(answers)
  }

  const { peerReviewOpen } = course.info
  if (!peerReviewOpen) return null
  if (!questions.length) return null

  if (!formVisible) return <Button onClick={() => setFormVisible(true)}> Create peer review</Button>
  return (
    <div>
      <div style={{ paddingTop: 10 }}>
        <h4>Peer review</h4>
        {questions.map(q => (
          <PeerReviewQuestion
            key={q.id}
            onChange={onChange}
            onRadioChange={onRadioChange}
            users={users}
            question={q}
          />
        ))}
        <div style={{ paddingTop: 20 }}>
          <span style={{ paddingRight: 10 }}>
            <Button
              color={missingField ? 'grey' : 'blue'}
              onClick={create}
            >
              create
            </Button>
          </span>
          <Button onClick={() => setFormVisible(false)}>cancel</Button>
        </div>
      </div>
    </div>
  )
}

export default PeerReview
