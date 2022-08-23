const okFor3 = (s) => {
  const w0 = s.submissions.find((s) => s.week === 0)
  const w1 = s.submissions.find((s) => s.week === 1)
  const w2 = s.submissions.find((s) => s.week === 2)
  const w3 = s.submissions.find((s) => s.week === 3)

  const w0ok =
    w0 &&
    (w0.ok ||
      w0.exercise_count > 5 ||
      (w0.exercises && w0.exercises.length > 5))
  const w1ok =
    w1 &&
    (w1.ok ||
      w1.exercise_count > 9 ||
      (w1.exercises && w1.exercises.length > 9))
  const w2ok =
    w2 &&
    (w2.ok ||
      w2.exercise_count > 12 ||
      (w2.exercises && w2.exercises.length > 12))
  const w3ok =
    w3 &&
    (w3.ok ||
      w3.exercise_count > 17 ||
      (w3.exercises && w3.exercises.length > 17))

  return w0 && w1 && w2 && w3 && w0ok && w1ok && w2ok && w3ok
}

const fullstackCredits = (s) => {
  const e = s.total_exercises

  if (e < 72 && okFor3(s)) return 3

  if (!e) return undefined
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
  const w1 = s.submissions.find((s) => s.week === 1)
  const w2 = s.submissions.find((s) => s.week === 2)
  const w3 = s.submissions.find((s) => s.week === 3)

  const w1cred = w1 && w1.exercises.length > 14 ? 1 : 0

  const w2cred = w2 && w2.exercises.length > 8 ? 1 : 0

  const w3cred = w3 && w3.exercises.length > 6 ? 1 : 0

  return w1cred + w2cred + w3cred
}

const exerciseCount = (s) => {
  if (s.exercises) {
    return s.exercises.length
  }
  return s.exercise_count
}

const getExerciseCountBySubmissions = (submissions) => {
  return submissions.map(exerciseCount).reduce((sum, e) => e + sum, 0)
}

const submissionsToFullstackGradeAndCredits = (submissions) => {
  const part8Submission = submissions.find((s) => s.week === 8)
  const part8 = part8Submission && part8Submission.exercises.length > 21
  const part9Submission = submissions.find((s) => s.week === 9)
  const part9 = part9Submission && part9Submission.exercises.length > 23

  const totalExercises = submissions
    .filter((s) => s.week < 8)
    .map(exerciseCount)
    .reduce((acc, cur) => acc + cur, 0)

  const stud = {
    total_exercises: totalExercises,
    submissions,
  }

  const baseCredits = fullstackCredits(stud)

  if (!baseCredits) {
    return {
      grade: 0,
      credits: 0,
      creditsParts0to7: 0,
      creditsPart9: 0,
      creditsPart8: 0,
    }
  }

  const creditsPart8 = part8 ? 1 : 0
  const creditsPart9 = part9 ? 1 : 0
  const credits = baseCredits + creditsPart8 + creditsPart9
  const creditsParts0to7 = baseCredits

  const grade = fullstackGrade(stud)

  return {
    grade,
    credits,
    creditsParts0to7,
    creditsPart9,
    creditsPart8,
  }
}

const submissionsToRorCreditsGrade = (submissions) => {
  const grade = (e) => {
    if (e < 52) return 0
    if (e < 62) return 1
    if (e < 72) return 2
    if (e < 82) return 3
    if (e < 92) return 4

    return 5
  }

  const totalExercises = submissions
    .filter((s) => s.week < 8)
    .map(exerciseCount)
    .reduce((acc, cur) => acc + cur, 0)

  return {
    grade: grade(totalExercises),
    credits: totalExercises >= 52 ? 5 : 0,
  }
}

const submissionsToDockerCredits = (submissions) => {
  const stud = {
    total_exercises: submissions
      .map(exerciseCount)
      .reduce((sum, e) => e + sum, 0),
    submissions,
  }
  const credits = dockerCredits(stud)
  return credits
}

const submissionsToKubernetesCredits = (submissions) => {
  const totalExercises = submissions
    .map(exerciseCount)
    .reduce((sum, e) => e + sum, 0)
  if (totalExercises >= 45) return 5

  return 0
}

const submissionsToReactNativeCredits = (submissions) => {
  const exercises = getExerciseCountBySubmissions(submissions)

  if (exercises >= 25) {
    return 2
  }

  return 0
}

const submissionsToCiCdCredits = (submissions) => {
  const exercises = getExerciseCountBySubmissions(submissions)

  return exercises >= 21 ? 1 : 0
}

const submissionsToGraphqlCredits = (submissions) => {
  const exercises = getExerciseCountBySubmissions(submissions)

  return exercises >= 22 ? 1 : 0
}

const submissionsToTypeScriptCredits = (submissions) => {
  const exercises = getExerciseCountBySubmissions(submissions)

  return exercises >= 24 ? 1 : 0
}

const submissionsToContainerCredits = (submissions) => {
  const exercises = getExerciseCountBySubmissions(submissions)

  return exercises >= 21 ? 1 : 0
}

const submissionsToPsqlCredits = (submissions) => {
  const exercises = getExerciseCountBySubmissions(submissions)

  return exercises >= 24 ? 1 : 0
}

const submissionsTddlCredits = (submissions) => {
  const exercises = getExerciseCountBySubmissions(submissions)

  if (exercises < 5) {
    return 0
  }

  if (exercises === 6) {
    return 5
  }

  const weeks = submissions.map((s) => ({ w: s.week, e: s.exercises.length }))
  const w5 = weeks.find((w) => w.w === 5)

  return w5 && w5.e === 0 ? 4 : 0
}

module.exports = {
  submissionsToDockerCredits,
  submissionsToFullstackGradeAndCredits,
  submissionsToReactNativeCredits,
  submissionsToKubernetesCredits,
  submissionsToCiCdCredits,
  submissionsToGraphqlCredits,
  submissionsToTypeScriptCredits,
  submissionsToContainerCredits,
  submissionsToPsqlCredits,
  submissionsTddlCredits,
  submissionsToRorCreditsGrade,
}
