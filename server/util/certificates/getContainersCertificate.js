const { submissionsToContainerCredits } = require('@util/common')
const getFullstackCertFile = require('./getFullstackCertFile')

const translate = (credits = 0) => ({
  en: {
    cred: `Has successfully completed the course's Containers part in ${credits} ECTS credits`,
    title: 'Certificate of completion',
    university: 'University lecturer, University of Helsinki',
    company: 'COO, Houston Inc.',
  },
  fi: {
    cred: `On suorittanut kurssin konttiteknologiaa käsittelevän osan hyväksytysti ${credits} opintopisteen laajuisena`,
    title: 'Kurssitodistus',
    university: 'Yliopistonlehtori, Helsingin yliopisto',
    company: 'COO, Houston Inc.',
  },
})

const getCertificate = async (url, name, submissions, language) => {
  const credits = submissionsToContainerCredits(submissions)

  const { title, university, company, cred } = translate(credits)[language]

  return getFullstackCertFile({
    title,
    name,
    text: cred,
    university,
    company,
    url,
  })
}

module.exports = getCertificate
