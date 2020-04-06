const { intersection } = require('lodash')

const okFor3 = (s) => {
  const w0 = s.submissions.find(s => s.week === 0)
  const w1 = s.submissions.find(s => s.week === 1)
  const w2 = s.submissions.find(s => s.week === 2)
  const w3 = s.submissions.find(s => s.week === 3)

  const w0ok = w0 && (w0.ok || (w0.exercise_count > 5) || (w0.exercises && w0.exercises.length > 5))
  const w1ok = w1 && (w1.ok || (w1.exercise_count > 9) || (w1.exercises && w1.exercises.length > 9))
  const w2ok = w2 && (w2.ok || (w2.exercise_count > 12) || (w2.exercises && w2.exercises.length > 12))
  const w3ok = w3 && (w3.ok || (w3.exercise_count > 17) || (w3.exercises && w3.exercises.length > 17))

  return w0 && w1 && w2 && w3 && w0ok && w1ok && w2ok && w3ok
}

const fullstackCredits = (s) => {
  const e = s.total_exercises

  if (e < 72 && okFor3(s)) return 3

  if (!e) return 'Na'
  if (e < 72) return 0
  if (e < 127) return 5
  if (e < 138) return 6
  return 7
}

const fullstackGrade = (s) => {
  const e = s.total_exercises

  if (fullstackCredits(s) === 3) return 'hyväksytty/accepted'

  if (e < 72) return 0
  if (e < 83) return 1
  if (e < 94) return 2
  if (e < 105) return 3
  if (e < 116) return 4

  return 5
}

const dockerCredits = (s) => {
  const w1 = s.submissions.find(s => s.week === 1)
  const w2 = s.submissions.find(s => s.week === 2)
  const w3 = s.submissions.find(s => s.week === 3)

  const must = {
    1: [10, 11, 12],
    2: [3],
    3: [3],
  }

  const w1cred = w1
    && w1.exercises.length > 14
    && intersection(must[1], w1.exercises).length === must[1].length
    ? 1 : 0

  const w2cred = w2
    && w2.exercises.length > 8
    && intersection(must[2], w2.exercises).length === must[2].length
    ? 1 : 0

  const w3cred = w3
    && w3.exercises.length > 6
    && intersection(must[3], w3.exercises).length === must[3].length
    ? 1 : 0

  return w1cred + w2cred + w3cred
}

const exerciseCount = (s) => {
  if (s.exercises) {
    return s.exercises.length
  }
  return s.exercise_count
}


const submissionsToFullstackGradeAndCredits = (submissions) => {
  const part8Submission = submissions.find(s => s.week === 8)
  const part8 = part8Submission && part8Submission.exercises.length > 21
  const part9Submission = submissions.find(s => s.week === 9)
  const part9 = part9Submission && part9Submission.exercises.length > 23
  const totalExercises = submissions.filter(s => s.week < 8)
    .map(exerciseCount).reduce((acc, cur) => acc + cur, 0)

  const stud = {
    total_exercises: totalExercises,
    submissions,
  }
  const credits = fullstackCredits(stud) + (part8 ? 1 : 0) + (part9 ? 1 : 0)
  const creditsParts0to8 = fullstackCredits(stud) + (part8 ? 1 : 0)

  const grade = fullstackGrade(stud)
  return [grade, credits, creditsParts0to8, part9]
}

const submissionsToDockerCredits = (submissions) => {
  const stud = {
    total_exercises: submissions.map(exerciseCount).reduce((sum, e) => e + sum, 0),
    submissions,
  }
  const credits = dockerCredits(stud)
  return credits
}

module.exports = {
  submissionsToDockerCredits,
  submissionsToFullstackGradeAndCredits,
}
