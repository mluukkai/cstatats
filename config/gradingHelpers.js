const fullstackCredits = (s) => {
  const e = s.total_exercises

  if (!e) return undefined
  if (e < 72) return 0
  if (e < 127) return 5
  if (e < 138) return 6
  return 7
}

const fullstackGrade = (s) => {
  const e = s.total_exercises

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

  const w1cred =
    w1 &&
    w1.exercises.length > 14
      ? 1
      : 0

  const w2cred =
    w2 &&
    w2.exercises.length > 8
      ? 1
      : 0

  const w3cred =
    w3 &&
    w3.exercises.length > 6
      ? 1
      : 0

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

  return exercises >= 22 ? 1 : 0
}

module.exports = {
  submissionsToDockerCredits,
  submissionsToFullstackGradeAndCredits,
  submissionsToReactNativeCredits,
  submissionsToKubernetesCredits,
  submissionsToCiCdCredits,
}
