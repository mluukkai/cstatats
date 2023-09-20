const {
  submissionsToReactNativeCredits,
  submissionsToCiCdCredits,
  submissionsToDockerCredits,
  submissionsToDocker2023Credits,
  submissionsToKubernetesCredits,
  submissionsToFullstackGradeAndCredits,
  submissionsToGraphqlCredits,
  submissionsToTypeScriptCredits,
  submissionsToContainerCredits,
  submissionsToPsqlCredits,
  submissionsTddlCredits,
  submissionsToRorCreditsGrade,
  submissionsToAcademicSkillsCreits,
  submissionsToHotwireCreditsGrade,
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
      `If you complete course now you will get ${credits} credits, grade ${grade}. Are you sure?`,
  },
  ror: {
    courseNames: ['rails2022', 'rails2023'],
    getCredits: (submissions) => {
      const { credits } = submissionsToRorCreditsGrade(submissions)

      return credits
    },
    getGrade: (submissions) => {
      const { grade } = submissionsToRorCreditsGrade(submissions)

      return grade
    },
    certLanguages: ['en'],
  },
  rorHotwre: {
    courseNames: ['rails2023-hotwire'],
    getCredits: (submissions) => {
      const { credits } = submissionsToHotwireCreditsGrade(submissions)

      return credits
    },
    getGrade: (submissions) => {
      const { grade } = submissionsToHotwireCreditsGrade(submissions)

      return grade
    },
  },
  academic: {
    courseNames: ['akateemiset-taidot-2022-23', 'akateemiset-taidot'],
    getCredits: submissionsToAcademicSkillsCreits,
    useDefaultSuotarView: true,
  },
  docker: {
    courseNames: ['docker2019', 'docker2020', 'docker2021', 'docker2022', 'docker2023'],
    certLanguages: ['en'],
    getCredits: submissionsToDockerCredits,
  },
  docker23: {
    courseNames: ['docker2023'],
    certLanguages: ['en'],
    getCredits: submissionsToDocker2023Credits,
    useDefaultSuotarView: true,
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
    courseNames: ['tdd-2022', 'tdd-2023'],
    certLanguages: ['en'],
    getCredits: submissionsTddlCredits,
    useDefaultSuotarView: true,
  },
}
