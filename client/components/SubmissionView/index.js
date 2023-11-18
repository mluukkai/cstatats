import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Table } from 'semantic-ui-react'
import { getUserAction } from 'Utilities/redux/userReducer'
import QuizResults from 'Components/SubmissionView/QuizResults'
import SubmissionForm from 'Components/SubmissionView/SubmissionForm'
import OpenQuizzesList from 'Components/SubmissionView/OpenQuizzesList'
import CourseRegistration from 'Components/SubmissionView/CourseRegistration'
import CreditingLink from 'Components/SubmissionView/CreditingLink'

const Banner = ({ course }) => {
  if (true) {
    return null
  }

  const style = {
    color: "black",
    borderStyle: "solid", 
    borderWidth: "thick",
    borderColor: "green",
    padding: 10, 
    marginBottom: 30, 
    marginTop: 10, 
    backgroundColor: "#F1EFEF"
  }

  return (
    <div style={style}>
    Miniprojekti käynnistyy 13.11. alkavalla viikolla. Ilmoittautuminen on päättynyt.

    <br /><br />
    Oman aloitustilaisuutesi näet <a href='/ryhmajako'>täältä</a>, ryhmäjako tehdään aloitustilaisuudessa.
    </div>
  )
}

const SubmissionView = () => {
  const { user, course } = useSelector(({ user, course }) => ({ user, course }))
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUserAction())
  }, [])

  if (!user || !user.submissions) return null
  const courseName = (course.info || {}).name
  if (!courseName) return null
  const submissions = user.submissions.filter(
    (s) => s.courseName === courseName,
  )

  const week = course.info ? course.info.week : 0

  const submissionForWeeks = submissions.map((s) => s.week)

  const byPart = (p1, p2) => p1.week - p2.week

  const isTdd = (course.info.name === 'tdd-2022') || (course.info.name === 'tdd-2023')

  const isAkateemisetTaidot = course.info.name.includes('akateemiset-taidot')

  const solutions = (part) => {
    if (part === 0) return <div>not available</div>
    if (isTdd && part < 6) return <div>not available</div>
    return <Link to={`solutions/${part}`}>show</Link>
  }

  const maxWeek = Math.max(submissionForWeeks, week - 1)

  if (!user) return null

  const sum = (acc, cur) => acc + (cur || 0)
  const exerciseTotal = submissions
    .map((s) => s.exercises.length)
    .reduce(sum, 0)
  const hoursTotal = submissions.map((s) => s.time).reduce(sum, 0)

  for (let week = 1; week <= maxWeek; week++) {
    if (!submissionForWeeks.includes(week)) {
      submissions.push({
        week,
        id: week,
        exercises: [],
      })
    }
  }

  const { completed } =
    (user.courseProgress || []).find((c) => c.courseName === courseName) || {}

  return (
    <div>
      <h3>My submissions for course {course.info.fullName}</h3>
      <Banner course={course}/>
      <CreditingLink />
      {completed ? null : <SubmissionForm />}
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>part</Table.HeaderCell>
            <Table.HeaderCell>exercises</Table.HeaderCell>
            {!isAkateemisetTaidot && <Table.HeaderCell>hours</Table.HeaderCell>}
            {!isAkateemisetTaidot && (
              <Table.HeaderCell>GitHub</Table.HeaderCell>
            )}
            {!isAkateemisetTaidot && (
              <Table.HeaderCell>comment</Table.HeaderCell>
            )}
            {!isAkateemisetTaidot && (
              <Table.HeaderCell>example solutions</Table.HeaderCell>
            )}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {submissions.sort(byPart).map((s) => (
            <Table.Row key={s.week}>
              <Table.Cell>{s.week}</Table.Cell>
              <Table.Cell>{s.exercises.length}</Table.Cell>
              {!isAkateemisetTaidot && <Table.Cell>{s.time}</Table.Cell>}
              {!isAkateemisetTaidot && (
                <Table.Cell>
                  <a href={`${s.github}`}>{s.github}</a>
                </Table.Cell>
              )}
              {!isAkateemisetTaidot && <Table.Cell>{s.comment}</Table.Cell>}
              {!isAkateemisetTaidot && (
                <Table.Cell>{solutions(s.week)}</Table.Cell>
              )}
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell>total</Table.HeaderCell>
            <Table.HeaderCell>{exerciseTotal}</Table.HeaderCell>
            {!isAkateemisetTaidot && (
              <Table.HeaderCell>{hoursTotal}</Table.HeaderCell>
            )}
            {!isAkateemisetTaidot && <Table.HeaderCell></Table.HeaderCell>}
            {!isAkateemisetTaidot && <Table.HeaderCell></Table.HeaderCell>}
            {!isAkateemisetTaidot && <Table.HeaderCell></Table.HeaderCell>}
          </Table.Row>
        </Table.Footer>
      </Table>
      <QuizResults />
      <OpenQuizzesList />
      <CourseRegistration />
    </div>
  )
}

export default SubmissionView
