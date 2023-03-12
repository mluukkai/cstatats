import React, { useState, useEffect } from 'react'
import { Table, Loader } from 'semantic-ui-react'
import studentService from 'Services/student'
import courseService from 'Services/course'
import axios from 'axios'

const Suotar = () => {
  const [courseList, setCourseList] = useState([])
  const [courses, setCourses] = useState({})
  const [akateemiset, setAkateemiset] = useState(0)
  useEffect(() => {
    courseService.getCourses().then((courses) => {
      setCourseList(courses.filter((c) => c.enabled && !c.name.includes('ber')))
    })
    axios
      .get(
        'https://study.cs.helsinki.fi/stats/api/external/courses/akateemiset-taidot-2022-23/completed',
      )
      .then((response) => {
        setAkateemiset(response.data.count)
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
        <h2>Students ready for suotar</h2>

        <Loader active inline />
      </div>
    )
  }

  return (
    <div>
      <h2>Students ready for to suotar</h2>

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
          <Table.Row>
            <Table.Cell>Akateemiset taidot (study.cs.helsinki.fi)</Table.Cell>
            <Table.Cell>{akateemiset}</Table.Cell>
            <Table.Cell>
              <a href="https://study.cs.helsinki.fi/stats/courses/akateemiset-taidot-2022-23/admin/suotar">
                go
              </a>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  )
}

export default Suotar
