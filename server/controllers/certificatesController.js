const fs = require('fs')
const { ApplicationError } = require('@util/customErrors')
require.extensions['.html'] = (module, filename) => {
  module.exports = fs.readFileSync(filename, 'utf8')
}
require.extensions['.svg'] = (module, filename) => {
  module.exports = fs.readFileSync(filename, 'utf8')
}
require.extensions['.woff2'] = (module, filename) => {
  module.exports = Buffer.from(fs.readFileSync(filename)).toString('base64')
}
require.extensions['.ttf'] = (module, filename) => {
  module.exports = Buffer.from(fs.readFileSync(filename)).toString('base64')
}
const puppeteer = require('puppeteer')
const mustache = require('mustache')
const { submissionsToFullstackGradeAndCredits, submissionsToDockerCredits } = require('@util/common')
const models = require('@db/models')
const fullstackTemplate = require('@assets/certificates/fullstack_index.html')
const fullstackCert = require('@assets/certificates/fullstack_certificate.svg')
const oldDockerTemplate = require('@assets/certificates/docker_old_index.html')
const oldDockerCert = require('@assets/certificates/docker_old_certificate.svg')
const dockerCert = require('@assets/certificates/docker_certificate.svg')
const dockerTemplate = require('@assets/certificates/docker_index.html')
// const fontGTWalsheimBold = require('@assets/GT-Walsheim-Bold.woff2')
// const fontGTWalsheimRegular = require('@assets/GT-Walsheim-Regular.woff2')
const fontIBMPlexMonoBold = require('@assets/IBMPlexMono-Bold.woff2')
const fontIBMPlexSansRegular = require('@assets/IBMPlexSans-Regular.woff2')
const fontTrueno = require('@assets/TruenoSBd.woff2')

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
    executablePath: '/usr/bin/google-chrome-stable',
    args: ['--no-sandbox'],
  })
  try {
    const page = await browser.newPage()
    const html = mustache.render(htmlTemplate, mustacheFieldsObject)

    await page.setContent(html)
    await page.setViewport({ width: 3508, height: 2480 })

    const screenshotBuffer = await page.screenshot({ encoding: 'binary' })
    return screenshotBuffer
  } catch (e) {
    console.log('Sertit ei toimi', e)
    return null
  } finally {
    await browser.close()
  }
}

const getFullstackCertificate = async (url, name, submissions, language) => {
  const certSvg = fullstackCert
  const htmlTemplate = fullstackTemplate
  const [grade, credits] = submissionsToFullstackGradeAndCredits(submissions)

  const { title, university, company, threeCred, otherCred } = translate(credits, grade)[language]

  return getCertFile(htmlTemplate, {
    'plex-mono-bold': fontIBMPlexMonoBold,
    'plex-sans-regular': fontIBMPlexSansRegular,
    certificate: certSvg,
    title,
    name,
    text: credits === 3 ? threeCred : otherCred,
    university,
    company,
    url,
  })
}

const getDockerCertificate = (url, name, submissions) => {
  const certSvg = dockerCert
  const htmlTemplate = dockerTemplate
  const credits = submissionsToDockerCredits(submissions)

  return getCertFile(htmlTemplate, {
    trueno: fontTrueno,
    certificate: certSvg,
    name,
    text: `${credits}`,
    url,
  })
}

const getOldDockerCertificate = async (url, name, submissions) => {
  const certSvg = oldDockerCert
  const htmlTemplate = oldDockerTemplate
  const credits = submissionsToDockerCredits(submissions)

  return getCertFile(htmlTemplate, {
    'plex-mono-bold': fontIBMPlexMonoBold,
    'plex-sans-regular': fontIBMPlexSansRegular,
    certificate: certSvg,
    name,
    text: `${credits}`,
    url,
  })
}

const getCertTypeByCourseName = (courseName) => {
  // certType: coursenames
  const mapping = {
    "docker2019": ["docker2019"],
    "docker": ["docker2020"],
    "fullstack": ["ofs2019"]
  }
  const [certType] = Object.entries(mapping).find(([certType, courseNames]) => {
    if (courseNames.includes(courseName)) return true
    return false
  }) || []
  return certType
}

const getCertFuncByType = (type, newCert) => (...args) => {
  switch (type) {
    case "fullstack":
      return getFullstackCertificate(...args)
    case "docker":
      return getDockerCertificate(...args)
    case "docker2019":
      if (newCert) return getDockerCertificate(...args)
      return getOldDockerCertificate(...args)
    default:
      break;
  }
}

const getNameAndSubmissions = async (random, courseName) => {
  const userInstance = await models.User
    .findOne({
      courseProgress: {
        $elemMatch: {
          courseName,
          random
        }
      }
    })
    .populate('submissions').exec()

  if (!userInstance) throw new ApplicationError("Not found", 404)

  const user = userInstance.toJSON() // Bettered name and submissions
  const submissions = user.submissions.filter(sub => sub.courseName === courseName)
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
  const certFile = await getCertFuncByType(certificateType, newCert)(fullUrl, name, submissions, language)

  const filename = `certificate-${certificateType}.png`
  res.setHeader('Content-Length', certFile.length)
  res.setHeader('Content-Type', 'image/png')
  res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(filename)}`)
  res.send(certFile)
}

module.exports = {
  getCertificate,
}
