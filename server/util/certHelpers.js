const okFor3 = (s) => {
  const w0 = s.submissions.find(s => s.week === 0)
  const w1 = s.submissions.find(s => s.week === 1)
  const w2 = s.submissions.find(s => s.week === 2)
  const w3 = s.submissions.find(s => s.week === 3)

  const w0ok = w0 && (w0.ok || (w0.exercise_count === 6) || (w0.exercises && w0.exercises.length === 6))
  const w1ok = w1 && (w1.ok || (w1.exercise_count > 9) || (w1.exercises && w1.exercises.length > 9))
  const w2ok = w2 && (w2.ok || (w2.exercise_count > 12) || (w2.exercises && w2.exercises.length > 12))
  const w3ok = w3 && (w3.ok || (w3.exercise_count > 17) || (w3.exercises && w3.exercises.length > 17))

  return w0 && w1 && w2 && w3 && w0ok && w1ok && w2ok && w3ok
}
const credits = (s) => {
  const e = s.total_exercises

  if (okFor3(s) && e < 72) {
    return 3
  }

  if (!e) return 'Na'
  if (e < 72) return 0
  if (e < 127) return 5
  if (e < 138) return 6
  return 7
}
const grade = (s) => {
  const e = s.total_exercises

  if (credits(s) === 3) return 'Hyv.'

  if (e < 72) return 0
  if (e < 83) return 1
  if (e < 94) return 2
  if (e < 105) return 3
  if (e < 116) return 4

  return 5
}
const extendSubmissions = (student) => {
  let { submissions } = student

  if (student.extensions) {
    submissions = []
    const extendSubmissions = student.extensions.extendsWith
    const to = Math.max(...extendSubmissions.map(s => s.part), ...student.submissions.map(s => s.week))
    for (let index = 0; index <= to; index++) {
      const ext = extendSubmissions.find(s => s.part === index)
      const sub = student.submissions.find(s => s.week === index)
      if (ext && (!sub || ext.exercises > sub.exercises)) {
        submissions.push({
          week: index,
          exercise_count: ext.exercises
        })
      } else if (sub) {
        submissions.push(sub)
      }
    }
  }
  return submissions
}

const getGradeForUser = (user) => {
  const submissions = extendSubmissions(user)

  const exerciseCount = (s) => {
    if (s.exercises) {
      return s.exercises.length
    }
    return s.exercise_count
  }

  const stud = {
    total_exercises: submissions.map(exerciseCount).reduce((sum, e) => e + sum, 0),
    submissions,
  }

  return grade(stud)
}

const getCreditsForUser = (user) => {
  const submissions = extendSubmissions(user)

  const exerciseCount = (s) => {
    if (s.exercises) {
      return s.exercises.length
    }
    return s.exercise_count
  }

  const stud = {
    total_exercises: submissions.map(exerciseCount).reduce((sum, e) => e + sum, 0),
    submissions,
  }

  const part8 = submissions.find(s => s.week === 8)
  const p8credit = part8 ? part8.exercises.length > 21 : 0

  return credits(stud) + p8credit
}

module.exports = {
  getCreditsForUser,
  getGradeForUser,
}
