import { useState, useMemo, useEffect } from 'react'
import orderBy from 'lodash/orderBy'

import studentService from 'Services/student'

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
    const newStudents = await studentService.getInCourse(courseName)
    setStudents(newStudents)
  }

  useEffect(() => {
    if (courseName) {
      refetchStudents()
    }
  }, [courseName])

  const filteredStudents = useMemo(() => {
    const filtered = filter
      ? students.filter(student =>
          Object.values(student).find(
            val => val && val.includes && val.includes(filter),
          ),
        )
      : students

    return orderBy(filtered, [orderByField], [orderDirection])
  }, [students, filter, orderDirection, orderByField])

  const paginatedFilteredStudents = useMemo(
    () => filteredStudents.slice(pageStart, pageEnd),
    [filteredStudents, page, pageSize],
  )

  return {
    students,
    filteredStudents: paginatedFilteredStudents,
    filteredStudentsTotalCount: filteredStudents.length,
    pageStart,
    pageEnd,
    refetchStudents,
  }
}

export default useStudents
