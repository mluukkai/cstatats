import React, { useState, useEffect } from 'react'
import courseService from 'Services/course'

import AdminCourseList from 'Components/AdminView/AdminCourseList'
import NewCourseForm from 'Components/AdminView/NewCourseForm'

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

  return (
    <div>
      <AdminCourseList courses={courses} fetchCourses={fetchCourses} />
      <NewCourseForm submitNew={handleSubmitNew} />
    </div>
  )
}

export default AdminView
