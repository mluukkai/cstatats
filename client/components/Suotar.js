import React, { useState, useEffect } from 'react'
import { Table, Loader } from 'semantic-ui-react'
import studentService from 'Services/student'
import courseService from 'Services/course'

const Suotar = () => {
  const [courseList, setCourseList] = useState([])
  const [courses, setCourses] = useState({})
  useEffect(() => {
    courseService.getCourses().then((courses) => {
      console.log(courses)
      setCourseList(courses.filter((c) => c.enabled && !c.name.includes('ber')))
    })
  }, [])

  const fetchCourses = async () => {
    const results = await Promise.all(
      courseList.map((c) => studentService.getCompletedInCourse(c.name)),
    )

    const courses = {}

    const nograding = (g) => {
      if (!g) return true

      return !g.exam1.graded && !g.exam2.graded
    }

    for (let i = 0; i < courseList.length; i++) {
      const result = results[i]
      const course = courseList[i]
      const waiting = result
        .map((s) => s.courseProgress.find((p) => p.courseName === course.name))
        .filter((p) => p && p.completed && !p.oodi && nograding(p.grading))

      courses[course.name] = waiting.length
    }

    setCourses(courses)
  }

  useEffect(() => {
    if (courseList.length !== 0) {
      fetchCourses()
    }
  }, [courseList])

  if (Object.keys(courses).length === 0) {
    return (
      <div>
        <h2>Students to suotar</h2>

        <Loader active inline />
      </div>
    )
  }

  return (
    <div>
      <h2>Students to suotar</h2>

      <Table celled striped compact>
        <Table.Body>
          {Object.keys(courses).map((c) => (
            <Table.Row key={c}>
              <Table.Cell>{c}</Table.Cell>
              <Table.Cell>{courses[c]}</Table.Cell>
              <Table.Cell>
                <a href={`/stats/courses/${c}/admin/suotar`}>go</a>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default Suotar
