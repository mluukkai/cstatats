import React from 'react'
import { connect } from 'react-redux'
import { Table, Button } from 'semantic-ui-react'
import SubmissionForm from 'Components/SubmissionForm'
import courseService from 'Services/course'
import { initializeCourse } from 'Utilities/redux/courseReducer'
const Highlight = require('react-syntax-highlight')

class Submissions extends React.Component {

  componentWillMount = async () => {
    const info = await courseService.getInfoOf(this.props.course)
    this.props.store.dispatch(initializeCourse(info))
  }

  showModelSolutuions = (part) => () => {
    this.props.history.push(`solutions/${part}`)
  }

  render() {

    if (this.props.submissions.length === 0 && this.props.week===1) {
      return (
        <div>
          <SubmissionForm />
        </div>
      )
    }

    const byPart = (p1, p2) => p1.week - p2.week

    const solutions = (part) => {
      if ( part===0) {
        return <div>not available</div>
      }
      return(
        <Button onClick={this.showModelSolutuions(part)}>
          show
        </Button>
      )
    }

    const maxWeek = Math.max(submissionForWeeks, this.props.week-1)    
    let submissions = this.props.submissions
    const user = this.props.store.getState().user

    if (!user) return null

    const extension = user.extensions && user.extensions.find(e => e.to === this.props.course)

    if ( extension ) {
      submissions = []
      const extendSubmissions = extension.extendsWith
      const to = Math.max(...extendSubmissions.map(s => s.part), ...this.props.submissions.map(s => s.week))
      for (let index = 0; index <= to ; index++) {
        const ext = extendSubmissions.find(s => s.part === index)
        const sub = this.props.submissions.find(s => s.week === index)
        if (ext && (!sub || ext.exercises > sub.exercises)) {
          const exercises = []
          for (let i = 0; i < ext.exercises ; i++) {
            exercises.push(i)       
          }
          submissions.push({
            exercises,
            comment: `credited from ${extension.from}`,
            week: index,
            _id: index
          })
        } else if (sub) {
          submissions.push(sub)
        } else {
          submissions.push({ week: index, exercises: [], _id: index, comment: 'no submission' })
        }
      }
    }

    const submissionForWeeks = submissions.map(s => s.week)

    const sum = (s, i) => s + i
    const exerciseTotal =
      submissions.map(s => s.exercises.length).reduce(sum, 0)
    const hoursTotal =
      this.props.submissions.map(s => s.time).reduce(sum, 0)

    for (let week = 1; week <= maxWeek; week++) {
      if (!submissionForWeeks.includes(week)) {
        submissions.push({
          week,
          _id: week,
          exercises: []
        })
      }
    }

    return (
      <div>
        <h3>My submissions</h3>
        <SubmissionForm />
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>part</Table.HeaderCell>
              <Table.HeaderCell>exercises</Table.HeaderCell>
              <Table.HeaderCell>hours</Table.HeaderCell>
              <Table.HeaderCell>github</Table.HeaderCell>
              <Table.HeaderCell>comment</Table.HeaderCell>  
              <Table.HeaderCell>solutions</Table.HeaderCell>    
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {submissions.sort(byPart).map(s=>(
              <Table.Row key={s._id}>
                <Table.Cell>{s.week}</Table.Cell>
                <Table.Cell>{s.exercises.length}</Table.Cell>
                <Table.Cell>{s.time}</Table.Cell>
                <Table.Cell><a href={`${s.github}`}>{s.github}</a></Table.Cell>
                <Table.Cell>{s.comment}</Table.Cell>
                <Table.Cell>
                  {solutions(s.week)}
                </Table.Cell>
              </Table.Row>)
            )}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell>total</Table.HeaderCell>
              <Table.HeaderCell>{exerciseTotal}</Table.HeaderCell>
              <Table.HeaderCell>{hoursTotal}</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    submissions: state.user && state.course.info  ? 
      state.user.submissions.filter(s => s.courseName === state.course.info.name) : 
      [],
    week: state.course.info ? state.course.info.week : 0
  }
}

export default connect(mapStateToProps)(Submissions)
