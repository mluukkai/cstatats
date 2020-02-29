const stringSimilarity = require('string-similarity')
/**
 * Insert application wide common items here
 */

const inProduction = process.env.NODE_ENV === 'production'

const isShibboleth = process.env.USES_SHIBBOLETH || false

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

module.exports = {
  inProduction,
  basePath,
  isShibboleth,
  multipleChoiceOptionChosen,
}
