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
const { getCreditsForUser, getGradeForUser } = require('@util/certHelpers')
const models = require('@db/models')
const htmlTemplate = require('@assets/cert_index.html')
const fullstackCert = require('@assets/fullstack_certificate.svg')
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

const getCertFile = async (mustacheFieldsObject) => {
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


const getCertificate = async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
  const { lang, courseName, id: random } = req.params
  // Use courseName to distinguish between courses. Now only supports fullstack
  if (!random) return res.send(400)

  const language = lang === 'fi' ? 'fi' : 'en'

  const user = await models.User
    .findOne({ random })
    .populate('submissions')
    .exec()

  if (!user) return res.send(404)

  const grade = getGradeForUser(user)
  const credits = getCreditsForUser(user)

  const { title, university, company, threeCred, otherCred } = translate(credits, grade)[language]

  const certFile = await getCertFile({
    'plex-mono-bold': fontIBMPlexMonoBold,
    'plex-sans-regular': fontIBMPlexSansRegular,
    certificate: fullstackCert,
    title,
    name: user.name,
    text: credits === 3 ? threeCred : otherCred,
    university,
    company,
    url: fullUrl,
  })

  const filename = 'certificate-fullstackopen.png'
  res.setHeader('Content-Length', certFile.length)
  res.setHeader('Content-Type', 'image/png')
  res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(filename)}`)
  res.send(certFile)
}

const getCertificateOld = async (req, res) => {
  await getCertificate(req, res)
}


module.exports = {
  getCertificate,
  getCertificateOld,
}
