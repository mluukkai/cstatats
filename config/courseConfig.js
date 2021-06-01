const {
  submissionsToReactNativeCredits,
  submissionsToCiCdCredits,
  submissionsToDockerCredits,
  submissionsToKubernetesCredits,
  submissionsToFullstackGradeAndCredits,
  submissionsToGraphqlCredits,
  submissionsToTypeScriptCredits
} = require('./gradingHelpers')

module.exports = {
  fs: {
    courseNames: ['ofs2019'],
    certLanguages: ['fi', 'en'],
    completionLanguages: ['fi', 'en'],
    getCredits: (submissions) => {
      const { credits } = submissionsToFullstackGradeAndCredits(submissions)

      return credits
    },
    getGrade: (submissions) => {
      const { grade } = submissionsToFullstackGradeAndCredits(submissions)

      return grade
    },
    getCompletionConfirmation: ({ grade, credits }) =>
      `Confirm this only if you have done the exam in Moodle or in an earlier course.\n\nIf you complete course now you will get ${credits} credits, grade ${grade}. Are you sure?`,
  },
  docker: {
    courseNames: ['docker2019', 'docker2020', 'docker2021'],
    certLanguages: ['en'],
    getCredits: submissionsToDockerCredits,
  },
  kubernetes: {
    courseNames: ['kubernetes2020'],
    certLanguages: ['en'],
    getCredits: submissionsToKubernetesCredits,
  },
  fsReactNative: {
    courseNames: ['fs-react-native-2020', 'fs-react-native-2021'],
    certLanguages: ['fi', 'en'],
    getCredits: submissionsToReactNativeCredits,
    useDefaultSuotarView: true,
  },
  fsCicd: {
    courseNames: ['fs-cicd'],
    certLanguages: ['fi', 'en'],
    getCredits: submissionsToCiCdCredits,
    useDefaultSuotarView: true,
  },
  fsGraphql: {
    courseNames: ['fs-graphql'],
    certLanguages: ['en'],
    getCredits: submissionsToGraphqlCredits,
    useDefaultSuotarView: true,
  },
  fsTypescript: {
    courseNames: ['fs-typescript'],
    certLanguages: ['en'],
    getCredits: submissionsToTypeScriptCredits,
    useDefaultSuotarView: true,
  },
}