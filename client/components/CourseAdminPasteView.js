import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import studentService from 'Services/student'

const AdminPasteView = () => {
  const { courseName } = useSelector(({ course }) => {
    const courseName = ((course || {}).info || {}).name

    if (!courseName) return {}

    return {
      courseName: course.info.name,
      exercises: course.info.exercises,
      miniproject: course.info.miniproject,
    }
  })
  const [students, setStudents] = useState([])

  useEffect(() => {
    studentService.getInCourse(courseName).then((students) => {
      setStudents(students)
    })
  }, [])

  const github = (s) => {
    let sub = s[1]
    if (!sub) {
      return "-"
    }

    const github = sub.github.substring(19)
    return github.substring(0, github.indexOf("/"))
  }

  let csv = ""
  students.forEach(s=>{
    let project = "NOT_ASSIGNED"
    if (s.projectAccepted == true) {
      project = "ACCEPTED"
    } else if (s.project && s.project.name ) {
      project = s.project.name
    }

    csv += `${s.student_number};${s.email};${project};${github(s.submissions)}\n`
  }) 
  
  return (
    <pre>
      {csv} 
    </pre>
  )
}

export default AdminPasteView
