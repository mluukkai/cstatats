import React, { useState, useEffect } from 'react'
import { Table, Button } from 'semantic-ui-react'
import examService from 'Services/exam'
import moment from 'moment'
import { Link } from 'react-router-dom'

const AdminExamView = () => {
  const [exams, setExams] = useState([])

  useEffect(() => {
    examService.getAll().then((exams) => {
      setExams(exams)
    })
  }, [])

  const onReset = async (user) => {
    const ok = window.confirm(`sure to delete exam of ${user.student_number}`)
    if (ok) {
      examService.resetExam(user.username).then(() => {
        setExams(exams.filter((e) => e.username !== user.username))
      })
    }
  }

  const tformat = (stamp) => {
    if (!stamp) {
      return 'doing...'
    }
    return moment(stamp).format('HH:mm:ss MMMM Do YYYY')
  }

  const sformat = (e) => {
    if (!e.endtime) {
      return '...'
    }

    return e.passed ? 'passed' : 'failed'
  }

  const byTime = (a, b) => {
    if (moment(a.endtime).isAfter(moment(b.endtime))) {
      return -1
    }

    return 1
  }

  return (
    <div>
      <h2>Full stack Exams</h2>

      <Link to={`/courses/fullstackopen/admin/exception`}>Exception View</Link>

      <Table celled striped compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>started</Table.HeaderCell>
            <Table.HeaderCell>ended</Table.HeaderCell>
            <Table.HeaderCell>status</Table.HeaderCell>
            <Table.HeaderCell>points</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {exams.sort(byTime).map((e) => (
            <Table.Row key={e._id}>
              <Table.Cell>{e.user.student_number}</Table.Cell>
              <Table.Cell>{e.user.name}</Table.Cell>
              <Table.Cell>{e.username}</Table.Cell>
              <Table.Cell>{tformat(e.starttime)}</Table.Cell>
              <Table.Cell>{tformat(e.endtime)}</Table.Cell>
              <Table.Cell>{sformat(e)}</Table.Cell>
              <Table.Cell>{e.points ? e.points.toFixed(2) : ''}</Table.Cell>
              <Table.Cell>
                <Button onClick={() => onReset(e.user)}>reset</Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default AdminExamView
