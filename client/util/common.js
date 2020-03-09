/**
 * Insert common items here
 */
import toscalogoColor from 'Assets/toscalogo_color.svg'
import toscalogoGrayscale from 'Assets/toscalogo_grayscale.svg'

export const images = {
  toska_color: toscalogoColor,
  toska_grayscale: toscalogoGrayscale,
}

export const colors = {

}

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

export const credits = (s) => {
  const e = s.total_exercises

  if (e < 72 && okFor3(s)) return 3

  if (!e) return 'Na'
  if (e < 72) return 0
  if (e < 127) return 5
  if (e < 138) return 6
  return 7
}

export const grade = (s) => {
  const e = s.total_exercises

  if (credits(s) === 3) return 'hyväksytty/accepted'

  if (e < 72) return 0
  if (e < 83) return 1
  if (e < 94) return 2
  if (e < 105) return 3
  if (e < 116) return 4

  return 5

}

export * from '@root/config/common'
