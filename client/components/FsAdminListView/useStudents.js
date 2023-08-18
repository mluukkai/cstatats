import { useState, useMemo, useEffect } from 'react'
import orderBy from 'lodash/orderBy'

import studentService from 'Services/student'

const withQuizTotalScore = (courseName) => (student) => {
  const quizAnswers = student.quizAnswers || {}
  const quizAnswersInCourse = quizAnswers[courseName] || {}

  const quizTotalScore = Object.values(quizAnswersInCourse).reduce(
    (acc, cur) => Number(acc) + Number((cur.score || {}).points || 0),
    0,
  )

  return {
    quizAnswersInCourse,
    quizTotalScore,
    ...student,
  }
}

const getFilter = (filter) => {
  if (filter.includes('https://github.com/')) {
    const acual = filter.substring(19)
    const end = acual.indexOf("/")
    return acual.substring(0, end)
  }
  return filter
}

const useStudents = (courseName, options = {}) => {
  const {
    filter,
    pageSize = 30,
    page = 0,
    orderBy: orderByField = 'username',
    orderDirection = 'asc',
  } = options

  const pageStart = page * pageSize
  const pageEnd = (1 + page) * pageSize

  const [students, setStudents] = useState([])

  const refetchStudents = async () => {
    const newStudents = await studentService.getInCourseSimple(courseName)
    setStudents(newStudents)
  }

  useEffect(() => {
    if (courseName) {
      refetchStudents()
    }
  }, [courseName])

  const updateStudent = (student) => {
    const updated = students.map((s) => (s.id !== student.id ? s : student))
    setStudents(updated)
  }

  const normalizedStudents = useMemo(() => {
    return students.map(withQuizTotalScore(courseName))
  }, [students, courseName])

  const acualFilter = getFilter(filter)

  const filteredStudents = useMemo(() => {
    const filtered = acualFilter
      ? normalizedStudents.filter((student) =>
          Object.values(student).find(
            (val) => val && val.includes && val.includes(acualFilter),
          ),
        )
      : normalizedStudents

    return orderBy(filtered, [orderByField], [orderDirection])
  }, [normalizedStudents, filter, orderDirection, orderByField])

  const paginatedFilteredStudents = useMemo(
    () => filteredStudents.slice(pageStart, pageEnd),
    [filteredStudents, page, pageSize],
  )

  return {
    students: normalizedStudents,
    filteredStudents: paginatedFilteredStudents,
    filteredStudentsTotalCount: filteredStudents.length,
    pageStart,
    pageEnd,
    refetchStudents,
    updateStudent,
  }
}

export default useStudents
