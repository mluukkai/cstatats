import React, { useState, useEffect } from 'react'
import courseService from 'Services/course'

const AdminStudentList = ({ course }) => {
  const [students, setStudents] = useState([])

  const fetchStudents = async () => {
    const newStudents = await courseService.getStudents(course.name)
    setStudents(newStudents)
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  return (
    <div>
      {students.map(student => JSON.stringify(student))}
    </div>
  )
}

export default AdminStudentList
