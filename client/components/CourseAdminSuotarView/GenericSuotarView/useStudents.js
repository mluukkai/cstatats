import { useState, useEffect, useMemo, useCallback } from 'react'

import studentService from 'Services/student'

const defaultGetCreditsBySubmissions = () => 0

const completedDateSort = (a, b) =>
  new Date(b.completed).getTime() - new Date(a.completed).getTime()

const getRelevantCourseProgress = (student, courseName) =>
  ((student || {}).courseProgress || []).find(
    (c) => c.courseName === courseName,
  ) || {}

const makeNormalizeStudent =
  (courseName, getCreditsBySubmissions) => (student) => {
    const courseProgress = getRelevantCourseProgress(student, courseName)

    return {
      studentNumber: student.student_number,
      username: student.username,
      name: student.name,
      completed: courseProgress.completed,
      language: courseProgress.language,
      oodi: courseProgress.oodi,
      suotarReady: courseProgress.suotarReady,
      credits: getCreditsBySubmissions(student.submissions),
      courseProgress,
    }
  }

const defaultProgressIsCompletedNotMarked = (progress) => {
  // progress.oodi is undefined if the student has not resumed progress, this is an actual false check
  if (progress.completed && progress.oodi === false) {
    return true
  }

  return progress.completed && !progress.oodi
}

const useStudents = (courseName, options = {}) => {
  const {
    getCreditsBySubmissions = defaultGetCreditsBySubmissions,
    progressIsCompletedNotMarked = defaultProgressIsCompletedNotMarked,
  } = options

  const [rawStudents, setRawStudents] = useState([])

  const updateStudentProgress = useCallback(
    async (username, update) => {
      await studentService.updateStudentCourseProgress(username, update)

      setRawStudents((previousRawStudents) => {
        return previousRawStudents.map((s) =>
          s.username === username
            ? {
                ...s,
                courseProgress: s.courseProgress.map((cp) =>
                  cp.courseName === courseName ? { ...cp, ...update } : cp,
                ),
              }
            : s,
        )
      })
    },
    [courseName, setRawStudents, rawStudents],
  )

  const updateStudentProgressLocally = useCallback(
    (username, update) => {
      setRawStudents((previousRawStudents) => {
        return previousRawStudents.map((s) =>
          s.username === username
            ? {
                ...s,
                courseProgress: s.courseProgress.map((cp) =>
                  cp.courseName === courseName ? { ...cp, ...update } : cp,
                ),
              }
            : s,
        )
      })
    },
    [courseName, setRawStudents, rawStudents],
  )

  const refetch = async () => {
    if (!courseName) return

    const newStudents = await studentService.getCompletedInCourse(courseName)

    setRawStudents(newStudents)
  }

  useEffect(() => {
    refetch()
  }, [courseName])

  const students = useMemo(() => {
    return rawStudents.map(
      makeNormalizeStudent(courseName, getCreditsBySubmissions),
    )
  }, [rawStudents, courseName, getCreditsBySubmissions])

  const notMarkedStudents = useMemo(() => {
    return students
      .filter((student) => progressIsCompletedNotMarked(student.courseProgress))
      .sort(completedDateSort)
  }, [students, progressIsCompletedNotMarked])

  const markedStudents = useMemo(() => {
    return students
      .filter(
        (student) => !progressIsCompletedNotMarked(student.courseProgress),
      )
      .sort(completedDateSort)
  }, [students, progressIsCompletedNotMarked])

  return {
    students,
    markedStudents,
    notMarkedStudents,
    refetch,
    updateStudentProgress,
    updateStudentProgressLocally,
  }
}

export default useStudents
