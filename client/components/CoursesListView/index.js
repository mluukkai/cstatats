import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import courseService from 'Services/course'

const Courses = () => {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const fetchCourses = async () => {
      const courses = await courseService.getCourses()
      setCourses(courses)
    }
    fetchCourses()
  }, [])

  return (
    <div>
      <ul>
        {courses.filter(c => c.enabled).map(c => (
          <li key={c._id}>
            <Link to={`/courses/${c.name}`}>
              {c.fullName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Courses
