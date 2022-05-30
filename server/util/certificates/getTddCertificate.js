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

const { submissionsTddlCredits } = require('@util/common')
const tddCert = require('@assets/certificates/tdd_certificate.svg')
const tddTemplate = require('@assets/certificates/tdd_index.html')
const fontTrueno = require('@assets/TruenoSBd.woff2')
const getCertFile = require('./getCertFile')

const getTddCertificate = (url, name, submissions) => {
  const certSvg = tddCert
  const htmlTemplate = tddTemplate
  const credits = submissionsTddlCredits(submissions)

  const text =
    credits === 5
      ? `Test-Driven Development: Full Stack (4+1 ECTS)`
      : `Test-Driven Development (4 ECTS)`

  return getCertFile(htmlTemplate, {
    trueno: fontTrueno,
    certificate: certSvg,
    name,
    text,
    url,
  })
}

module.exports = getTddCertificate
