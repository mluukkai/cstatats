import React, { useState, useEffect } from 'react'
import { Table } from 'semantic-ui-react'
import studentService from 'Services/student'
import courseService from 'Services/course'

const Suotar = () => {
  const [courseList, setCourseList] = useState([])
  const [courses, setCourses] = useState({})
  useEffect(() => {
    courseService.getCourses().then((courses) => {
      setCourseList(courses)
    })
  }, [])

  const fetchCourses = async () => {
    const course = courseList[2]

    Promise.all(
      courseList.map((c) => studentService.getCompletedInCourse(c.name)),
    ).then((results) => {
      const obj = results.reduce((o, result) => {
        const waiting = result
          .map((s) =>
            s.courseProgress.find((p) => p.courseName === course.name),
          )
          .filter((p) => p && p.completed && !p.oodi)

        return { ...o, [course.name]: waiting.length }
      }, {})

      setCourses(obj)
    })
  }

  useEffect(() => {
    if (courseList.length !== 0) {
      fetchCourses()
    }
  }, [courseList])

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
                <a href={`/courses/${c}/admin/suotar`}>go</a>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default Suotar
