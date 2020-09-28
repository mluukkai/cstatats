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

const { submissionsToDockerCredits } = require('@util/common')
const oldDockerTemplate = require('@assets/certificates/docker_old_index.html')
const oldDockerCert = require('@assets/certificates/docker_old_certificate.svg')
const fontIBMPlexMonoBold = require('@assets/IBMPlexMono-Bold.woff2')
const fontIBMPlexSansRegular = require('@assets/IBMPlexSans-Regular.woff2')
const getCertFile = require('./getCertFile')

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

module.exports = getOldDockerCertificate
