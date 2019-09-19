import React, { useState, useEffect } from 'react'
import NewCourseForm from 'Components/AdminView/NewCourseForm'
import courseService from 'Services/course'

const AdminView = () => {
  const [courses, setCourses] = useState([])

  const fetchCourses = async () => {
    const courses = await courseService.getCourses()
    setCourses(courses)
  }

  useEffect(() => { fetchCourses() }, [])

  const handleSubmitNew = async (newCourse) => {
    await courseService.create(newCourse)
    fetchCourses()
  }

  const todos = 'Course toggle, '
  return (
    <div>
      Admin page! Todos -
      {todos}
      {courses.map(course => (
        <div>
          {JSON.stringify(course)}
        </div>
      ))}
      <NewCourseForm submitNew={handleSubmitNew} />
    </div>
  )
}

export default AdminView
