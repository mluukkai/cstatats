import React from 'react'
import { Route } from 'react-router-dom'
import courseService from 'Services/course'
import { initializeCourse, initializeStats } from 'Utilities/redux/courseReducer'
import Statistics from 'Components/Statistics'

class Course extends React.Component {

  componentWillMount = async () => {
    const info = await courseService.getInfoOf(this.props.course)
    this.props.store.dispatch(initializeCourse(info))

    const stats = await courseService.getStatsOf(this.props.course)
    this.props.store.dispatch(initializeStats(stats))
  }

  render() {
    if (this.props.store.getState().course.info === null) {
      return null
    }

    const course = this.props.store.getState().course.info

    return (
      <div>
        <Route path="/" render={() => (
          <div>
            <h2>{course.fullName}</h2>
            <div style={{paddingBottom: 10}}>
              <em>{course.term.replace('fall', 'syksy')} {course.year}</em>
            </div>         
            <p><a href={course.url}>course page</a></p>
            <Statistics /> 
          </div>
        )} />

      </div>
    )
  }
}

export default Course