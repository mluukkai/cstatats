const {
  submissionsToReactNativeCredits,
  submissionsToCiCdCredits,
  submissionsToDockerCredits,
  submissionsToKubernetesCredits,
  submissionsToFullstackGradeAndCredits,
  submissionsToGraphqlCredits,
  submissionsToTypeScriptCredits,
  submissionsToContainerCredits,
  submissionsToPsqlCredits,
  submissionsTddlCredits,
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
    courseNames: ['docker2019', 'docker2020', 'docker2021', 'docker2022'],
    certLanguages: ['en'],
    getCredits: submissionsToDockerCredits,
  },
  kubernetes: {
    courseNames: ['kubernetes2020', 'kubernetes2022'],
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
  fsContainers: {
    courseNames: ['fs-containers'],
    certLanguages: ['en'],
    getCredits: submissionsToContainerCredits,
    useDefaultSuotarView: true,
  },
  fsPsql: {
    courseNames: ['fs-psql'],
    certLanguages: ['fi', 'en'],
    getCredits: submissionsToPsqlCredits,
    useDefaultSuotarView: true,
  },
  tdd: {
    courseNames: ['tdd-2022'],
    certLanguages: ['en'],
    getCredits: submissionsTddlCredits,
    useDefaultSuotarView: true,
  },
}
