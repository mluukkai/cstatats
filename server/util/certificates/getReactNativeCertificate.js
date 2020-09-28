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

const { submissionsToReactNativeCredits } = require('@util/common')
const fullstackTemplate = require('@assets/certificates/fullstack_index.html')
const fullstackCert = require('@assets/certificates/fullstack_certificate.svg')
const fontIBMPlexMonoBold = require('@assets/IBMPlexMono-Bold.woff2')
const fontIBMPlexSansRegular = require('@assets/IBMPlexSans-Regular.woff2')
const getCertFile = require('./getCertFile')

const translate = (credits = 0) => ({
  en: {
    cred: `Has successfully completed the course's React Native part in ${credits} ECTS credits`,
    title: 'Certificate of completion',
    university: 'University lecturer, University of Helsinki',
    company: 'COO, Houston Inc.',
  },
  fi: {
    cred: `On suorittanut kurssin React Native -osan hyväksytysti ${credits} opintopisteen laajuisena`,
    title: 'Kurssitodistus',
    university: 'Yliopistonlehtori, Helsingin yliopisto',
    company: 'COO, Houston Inc.',
  },
})

const getReactNativeCertificate = async (url, name, submissions, language) => {
  const certSvg = fullstackCert
  const htmlTemplate = fullstackTemplate
  const credits = submissionsToReactNativeCredits(submissions)

  const { title, university, company, cred } = translate(credits)[language]

  return getCertFile(htmlTemplate, {
    'plex-mono-bold': fontIBMPlexMonoBold,
    'plex-sans-regular': fontIBMPlexSansRegular,
    certificate: certSvg,
    title,
    name,
    text: cred,
    university,
    company,
    url,
  })
}

module.exports = getReactNativeCertificate
