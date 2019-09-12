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
        {courses.filter(c => c.enabled === true).map(c => (
          <li>
            <a href={`#${c.name}`}>
              {c.fullName}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Courses
