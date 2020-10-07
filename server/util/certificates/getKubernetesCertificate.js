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

const { NotFoundError } = require('@util/customErrors')
const { submissionsToKubernetesCredits } = require('@util/common')
const kubernetesCert = require('@assets/certificates/kubernetes_certificate.svg')
const kubernetesTemplate = require('@assets/certificates/kubernetes_index.html')
const fontTrueno = require('@assets/TruenoSBd.woff2')
const getCertFile = require('./getCertFile')

const getKubernetesCertificate = (url, name, submissions) => {
  const certSvg = kubernetesCert
  const htmlTemplate = kubernetesTemplate
  const credits = submissionsToKubernetesCredits(submissions)
  if (credits !== 5) throw NotFoundError()

  return getCertFile(htmlTemplate, {
    trueno: fontTrueno,
    certificate: certSvg,
    name,
    text: `${credits}`,
    url,
  })
}

module.exports = getKubernetesCertificate
