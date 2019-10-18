import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import courseService from 'Services/course'
import AdminCourseList from 'Components/AdminView/AdminCourseList'
import NewCourseForm from 'Components/AdminView/NewCourseForm'

const AdminView = () => {
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(undefined)

  const fetchCourses = async () => {
    const courses = await courseService.getCourses()
    setCourses(courses)
  }
  const selectCourse = (course) => {
    setSelectedCourse(course)
  }

  useEffect(() => { fetchCourses() }, [])

  const handleSubmitNew = async (newCourse) => {
    await courseService.create(newCourse)
    fetchCourses()
  }

  if (selectedCourse) return <Redirect to={`/courses/${selectedCourse.name}/admin`} />

  return (
    <div>
      <AdminCourseList courses={courses} fetchCourses={fetchCourses} selectCourse={selectCourse} />
      <NewCourseForm submitNew={handleSubmitNew} />
    </div>
  )
}

export default AdminView
