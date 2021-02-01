const fs = require('fs')

require.extensions['.html'] = (module, filename) => {
  module.exports = fs.readFileSync(filename, 'utf8')
}

require.extensions['.svg'] = (module, filename) => {
  module.exports = fs.readFileSync(filename, 'utf8')
}

require.extensions['.png'] = (module, filename) => {
  module.exports = Buffer.from(fs.readFileSync(filename)).toString('base64')
}

require.extensions['.woff2'] = (module, filename) => {
  module.exports = Buffer.from(fs.readFileSync(filename)).toString('base64')
}

const { NotFoundError } = require('@util/customErrors')
const { submissionsToKubernetesCredits } = require('@util/common')
const kubeBackground = require('@assets/certificates/kubernetes_certificate.png')
const kubernetesTemplate = require('@assets/certificates/kubernetes_index.html')
const openSansRegular = require('@assets/OpenSans-Regular.woff2')
const robotoRegular = require('@assets/Roboto-Regular.woff2')

const getCertFile = require('./getCertFile')

const getKubernetesCertificate = (url, name, submissions) => {
  const htmlTemplate = kubernetesTemplate
  const credits = submissionsToKubernetesCredits(submissions)
  if (credits !== 5) throw NotFoundError()

  return getCertFile(htmlTemplate, {
    'open-sans-regular': openSansRegular,
    'roboto-regular': robotoRegular,
    base64png: kubeBackground,
    name,
    text: `You have completed the ${credits} ECTS online course`,
    url,
  })
}

module.exports = getKubernetesCertificate
