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

const fullstackTemplate = require('@assets/certificates/fullstack_index.html')
const fullstackCert = require('@assets/certificates/fullstack_certificate.svg')
const fontIBMPlexMonoBold = require('@assets/IBMPlexMono-Bold.woff2')
const fontIBMPlexSansRegular = require('@assets/IBMPlexSans-Regular.woff2')
const getCertFile = require('./getCertFile')

const getFullstackCertFile = (data = {}) => getCertFile(fullstackTemplate, {
  'plex-mono-bold': fontIBMPlexMonoBold,
  'plex-sans-regular': fontIBMPlexSansRegular,
  certificate: fullstackCert,
  ...data
})

module.exports = getFullstackCertFile
