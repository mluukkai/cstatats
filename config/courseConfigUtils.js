const { isArray, isFunction } = require('lodash')

const courseConfig = require('./courseConfig')

const CONFIG_BY_COURSENAME = Object.values(courseConfig).reduce(
  (configMap, config) => {
    if (!isArray(config.courseNames)) {
      return configMap
    }

    config.courseNames.forEach((courseName) => {
      // eslint-disable-next-line no-param-reassign
      configMap[courseName] = config
    })

    return configMap
  },
  {},
)

const getConfigForCourse = (courseName) => {
  return CONFIG_BY_COURSENAME[courseName]
}

const getCourseCertLanguages = (courseName) => {
  const config = getConfigForCourse(courseName)

  if (!config || !isArray(config.certLanguages)) {
    return []
  }

  return config.certLanguages
}

const courseHasCert = (courseName) => {
  const languages = getCourseCertLanguages(courseName)

  return languages.length > 0
}

const getCourseGrade = (courseName, submissions) => {
  const config = getConfigForCourse(courseName)

  return config && isFunction(config.getGrade)
    ? config.getGrade(submissions)
    : undefined
}

const getCourseCredits = (courseName, submissions) => {
  const config = getConfigForCourse(courseName)

  return config && isFunction(config.getCredits)
    ? config.getCredits(submissions)
    : undefined
}

const courseHasRegistration = (courseName) => {
  const config = getConfigForCourse(courseName)

  if (!config) {
    return false
  }

  return isFunction(config.getCredits) || isFunction(config.getGrade)
}

const getCourseCompletionConfirmation = (
  courseName,
  { credits, grade } = {},
) => {
  const config = getConfigForCourse(courseName)

  if (isFunction(config.getCompletionConfirmation)) {
    return config.getCompletionConfirmation({ credits, grade })
  }

  return `If you complete course now you will get ${credits} credits. Are you sure?`
}

const courseHasDefaultSuotarView = (courseName) => {
  const config = getConfigForCourse(courseName)

  return config ? Boolean(config.useDefaultSuotarView) : false
}

const getCourseCompletionLanguages = (courseName) => {
  const config = getConfigForCourse(courseName)

  if (!config || !isArray(config.completionLanguages)) {
    return []
  }

  return config.completionLanguages
}

module.exports = {
  courseConfig,
  getConfigForCourse,
  courseHasCert,
  getCourseCertLanguages,
  getCourseGrade,
  getCourseCredits,
  courseHasRegistration,
  getCourseCompletionConfirmation,
  courseHasDefaultSuotarView,
  getCourseCompletionLanguages,
}
