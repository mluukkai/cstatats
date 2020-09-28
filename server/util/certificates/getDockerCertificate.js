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
const dockerCert = require('@assets/certificates/docker_certificate.svg')
const dockerTemplate = require('@assets/certificates/docker_index.html')
const fontTrueno = require('@assets/TruenoSBd.woff2')
const getCertFile = require('./getCertFile')

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

module.exports = getDockerCertificate
