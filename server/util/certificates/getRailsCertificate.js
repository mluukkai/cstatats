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

const rorCert = require('@assets/certificates/rails_certificate.svg')
const template = require('@assets/certificates/rails_index.html')
const fontTrueno = require('@assets/FreightMacro-Semibold.ttf')
const getCertFile = require('./getCertFile')

const getCertificate = (url, name) => {
  const certSvg = rorCert
  const htmlTemplate = template

  return getCertFile(htmlTemplate, {
    trueno: fontTrueno,
    certificate: certSvg,
    name,
    text: `Has succesfully completed the course Server-side Web Development Ruby on Rails (5 ECTS)`,
    url,
  })
}

module.exports = getCertificate