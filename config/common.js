const stringSimilarity = require('string-similarity')
/**
 * Insert application wide common items here
 */

const inProduction = process.env.NODE_ENV === 'production'

const isShibboleth = process.env.USES_SHIBBOLETH === 'true'

const basePath = process.env.BASE_PATH || '/'

const multipleChoiceOptionChosen = (options, chosenString) => {
  if (!options.length) return undefined

  const easyFind = options.find(option => option.text === chosenString)
  if (easyFind) return easyFind

  const choices = options.map(option => option.text)
  const { bestMatch, bestMatchIndex } = stringSimilarity.findBestMatch(chosenString, choices)

  if (bestMatch.rating < 0.75) return undefined

  const chosenOption = options[bestMatchIndex]
  return chosenOption
}

const convertExtensionToSubmissions = (user, course) => {
  const extension = user.extensions && user.extensions.find(e => e.to === course)

  if (extension) {
    const submissions = []
    const extendSubmissions = extension.extendsWith
    const to = Math.max(...extendSubmissions.map(s => s.part), ...submissions.map(s => s.week))
    for (let index = 0; index <= to; index++) {
      const ext = extendSubmissions.find(s => s.part === index)
      const sub = submissions.find(s => s.week === index)
      if (ext && (!sub || ext.exercises > sub.exercises)) {
        const exercises = []
        for (let i = 0; i < ext.exercises; i++) {
          exercises.push(i)
        }
        submissions.push({
          exercises,
          comment: `credited from ${extension.from}`,
          week: index,
          id: index,
        })
      } else if (sub) {
        submissions.push(sub)
      } else {
        submissions.push({
          week: index, exercises: [], id: index, comment: 'no submission',
        })
      }
    }
  }
}

module.exports = {
  inProduction,
  basePath,
  isShibboleth,
  multipleChoiceOptionChosen,
  convertExtensionToSubmissions,
}
