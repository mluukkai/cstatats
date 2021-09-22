const { ApplicationError } = require('@util/customErrors')
const models = require('@db/models')
const getFullstackCertificate = require('@util/certificates/getFullStackCertificate')
const getDockerCertificate = require('@util/certificates/getDockerCertificate')
const getKubernetesCertificate = require('@util/certificates/getKubernetesCertificate')
const getOldDockerCertificate = require('@util/certificates/getOldDockerCertificate')
const getReactNativeCertificate = require('@util/certificates/getReactNativeCertificate')
const getCiCdCertificate = require('@util/certificates/getCiCdCertificate')
const getGraphQlCertificate = require('@util/certificates/getGraphQlCertificate')
const getTypescriptCertificate = require('@util/certificates/getTypescriptCertificate')
const getContainersCertificate = require('@util/certificates/getContainersCertificate')

const getCertTypeByCourseName = (courseName) => {
  // certType: coursenames
  const mapping = {
    docker2019: ['docker2019'],
    docker: ['docker2020', 'docker2021'],
    kubernetes: ['kubernetes2020'],
    fullstack: ['ofs2019'],
    reactnative: ['fs-react-native-2020', 'fs-react-native-2021'],
    cicd: ['fs-cicd'],
    graphql: ['fs-graphql'],
    typescript: ['fs-typescript'],
    containers: ['fs-containers']
  }

  const [certType] =
    Object.entries(mapping).find(([, courseNames]) => {
      if (courseNames.includes(courseName)) return true
      return false
    }) || []

  return certType
}

const getCertFuncByType = (type, newCert) => (...args) => {
  switch (type) {
    case 'fullstack':
      return getFullstackCertificate(...args)
    case 'docker':
      return getDockerCertificate(...args)
    case 'docker2019':
      if (newCert) return getDockerCertificate(...args)
      return getOldDockerCertificate(...args)
    case 'kubernetes':
      return getKubernetesCertificate(...args)
    case 'reactnative':
      return getReactNativeCertificate(...args)
    case 'cicd':
      return getCiCdCertificate(...args)
    case 'graphql':
      return getGraphQlCertificate(...args)
    case 'typescript':
      return getTypescriptCertificate(...args)
    case 'containers':
      return getContainersCertificate(...args)
    default:
      break
  }
}

const getNameAndSubmissions = async (random, courseName) => {
  const userInstance = await models.User.findOne({
    courseProgress: {
      $elemMatch: {
        courseName,
        random,
      },
    },
  })
    .populate('submissions')
    .exec()

  if (!userInstance) throw new ApplicationError('Not found', 404)

  const user = userInstance.toJSON() // Bettered name and submissions
  const submissions = user.submissions.filter(
    (sub) => sub.courseName === courseName,
  )
  return { name: user.name, submissions }
}

const legacyCourseMankeli = (courseName) => {
  if (courseName === 'fullstackopen2019') return 'ofs2019'
  if (courseName === 'fullstackopen') return 'ofs2019'

  return courseName
}

// Only these course names are accepted
const getCertificate = async (req, res) => {
  const fullUrl = `https://${req.get('host')}/stats${req.originalUrl}`
  const { new: newCert } = req.query
  const { lang, courseName: acualCourseName, id: random } = req.params

  const courseName = legacyCourseMankeli(acualCourseName)

  if (!random) return res.send(400)
  const certificateType = getCertTypeByCourseName(courseName)
  if (!certificateType) return res.send(404)

  const { name, submissions } = await getNameAndSubmissions(random, courseName)
  const language = lang === 'fi' ? 'fi' : 'en'
  const certFile = await getCertFuncByType(certificateType, newCert)(
    fullUrl,
    name,
    submissions,
    language,
  )

  const filename = `certificate-${certificateType}.png`
  res.setHeader('Content-Length', certFile.length)
  res.setHeader('Content-Type', 'image/png')
  res.setHeader(
    'Content-Disposition',
    `inline; filename*=UTF-8''${encodeURIComponent(filename)}`,
  )
  res.send(certFile)
}

module.exports = {
  getCertificate,
}
