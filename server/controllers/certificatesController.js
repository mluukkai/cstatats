const fs = require('fs')

require.extensions['.html'] = (module, filename) => {
  module.exports = fs.readFileSync(filename, 'utf8')
}
require.extensions['.svg'] = (module, filename) => {
  module.exports = fs.readFileSync(filename, 'utf8')
}
require.extensions['.woff2'] = (module, filename) => {
  module.exports = Buffer.from(fs.readFileSync(filename)).toString('base64')
}

const puppeteer = require('puppeteer')
const mustache = require('mustache')
const { getFullstackCreditsForUser, getFullstackGradeForUser, getDockerCreditsForUser } = require('@util/certHelpers')
const models = require('@db/models')
const fullstackTemplate = require('@assets/certificates/fullstack_index.html')
const fullstackCert = require('@assets/certificates/fullstack_certificate.svg')
const dockerTemplate = require('@assets/certificates/docker_index.html')
const dockerCert = require('@assets/certificates/docker_certificate.svg')
const fontGTWalsheimBold = require('@assets/GT-Walsheim-Bold.woff2')
const fontGTWalsheimRegular = require('@assets/GT-Walsheim-Regular.woff2')
const fontIBMPlexMonoBold = require('@assets/IBMPlexMono-Bold.woff2')
const fontIBMPlexSansRegular = require('@assets/IBMPlexSans-Regular.woff2')

const translate = (credits = 0, grade = 0) => ({
  en: {
    threeCred: 'This is to certify that you have succesfully completed the 3 ECTS online course',
    otherCred: `This is to certify that you have succesfully completed the ${credits} ECTS online course with grade ${grade}`,
    title: 'Certificate of completion',
    university: 'University lecturer, University of Helsinki',
    company: 'COO, Houston Inc.',
  },
  fi: {
    threeCred: 'on suorittanut kurssin hyväksytysti 3 opintopisteen laajuisena',
    otherCred: `On suorittanut kurssin hyväksytysti ${credits} opintopisteen laajuisena arvosanalla ${grade}`,
    title: 'Kurssitodistus',
    university: 'Yliopistonlehtori, Helsingin yliopisto',
    company: 'COO, Houston Inc.',
  },
})

const getCertFile = async (htmlTemplate, mustacheFieldsObject) => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome-unstable',
    args: ['--no-sandbox'],
  })
  const page = await browser.newPage()
  const html = mustache.render(htmlTemplate, mustacheFieldsObject)
  await page.setContent(html)
  await page.setViewport({ width: 3508, height: 2480 })

  return page.screenshot({ encoding: 'binary' })
}

const getFullstackCertificate = async (url, user, courseName, language) => {
  const certSvg = fullstackCert
  const htmlTemplate = fullstackTemplate
  const grade = getFullstackGradeForUser(user, courseName)
  const credits = getFullstackCreditsForUser(user)

  const { title, university, company, threeCred, otherCred } = translate(credits, grade)[language]

  return getCertFile(htmlTemplate, {
    'plex-mono-bold': fontIBMPlexMonoBold,
    'plex-sans-regular': fontIBMPlexSansRegular,
    certificate: certSvg,
    title,
    name: user.name,
    text: credits === 3 ? threeCred : otherCred,
    university,
    company,
    url,
  })
}

const getDockerCertificate = async (url, user) => {
  const certSvg = dockerCert
  const htmlTemplate = dockerTemplate
  const credits = getDockerCreditsForUser(user)

  return getCertFile(htmlTemplate, {
    'plex-mono-bold': fontIBMPlexMonoBold,
    'plex-sans-regular': fontIBMPlexSansRegular,
    certificate: certSvg,
    name: user.name,
    text: `${credits}`,
    url,
  })
}

const legacyCourseMankeli = (courseName) => {
  if (courseName === 'fullstackopen2019') return 'ofs2019'

  return courseName
}

// Only these course names are accepted
const certificateFullstackCourses = ['ofs2019']
const certificateDockerCourses = ['docker2019']

const getCertificate = async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
  const { lang, courseName: acualCourseName, id: random } = req.params
  let certificateType

  const courseName = legacyCourseMankeli(acualCourseName)

  if (!random) return res.send(400)
  if (certificateDockerCourses.includes(courseName)) certificateType = 'docker'
  if (certificateFullstackCourses.includes(courseName)) certificateType = 'fullstack'
  if (!certificateType) return res.send(404)

  const language = lang === 'fi' ? 'fi' : 'en'

  const user = await models.User
    .findOne({ random })
    .populate({
      path: 'submissions',
      match: { courseName },
    }).exec()

  if (!user) return res.send(404)

  const certFile = await (certificateType === 'fullstack'
    ? getFullstackCertificate(fullUrl, user, courseName, language)
    : getDockerCertificate(fullUrl, user)
  )

  const filename = `certificate-${certificateType}.png`
  res.setHeader('Content-Length', certFile.length)
  res.setHeader('Content-Type', 'image/png')
  res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(filename)}`)
  res.send(certFile)
}

module.exports = {
  getCertificate,
}
