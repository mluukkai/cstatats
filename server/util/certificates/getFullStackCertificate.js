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

require.extensions['.ttf'] = (module, filename) => {
  module.exports = Buffer.from(fs.readFileSync(filename)).toString('base64')
}

const { submissionsToFullstackGradeAndCredits } = require('@util/common')
const fullstackTemplate = require('@assets/certificates/fullstack_index.html')
const fullstackCert = require('@assets/certificates/fullstack_certificate.svg')
const fontIBMPlexMonoBold = require('@assets/IBMPlexMono-Bold.woff2')
const fontIBMPlexSansRegular = require('@assets/IBMPlexSans-Regular.woff2')
const getCertFile = require('./getCertFile')

const translate = (credits = 0, grade = 0) => ({
  en: {
    threeCred: 'This is to certify that you have successfully completed the 3 ECTS online course',
    otherCred: `This is to certify that you have successfully completed the ${credits} ECTS online course with grade ${grade}`,
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

const getFullstackCertificate = async (url, name, submissions, language) => {
  const certSvg = fullstackCert
  const htmlTemplate = fullstackTemplate
  const { grade, credits } = submissionsToFullstackGradeAndCredits(submissions)

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

module.exports = getFullstackCertificate
