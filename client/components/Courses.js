import React, { useState, useEffect } from 'react'
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
            <a href={`/courses/${c.name}`}>
              {c.fullName}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Courses
