/* eslint-disable no-await-in-loop */
const axios = require('axios')

const { getAdminsForACourse } = require('@util/common')

const getAllForCourse = async (req, res) => {
  const { courseName } = req.params

  res.send(getAdminsForACourse(courseName))
}

const allCodes = {
  'fs-cicd': ['CSM14112', 'AYCSM14112'],
  'fs-typescript': ['CSM14110', 'AYCSM14110'],
  'fs-graphql': ['AYCSM14113', 'CSM14113'],
  fs: ['AYCSM141081'],
  'fs-rn': ['AYCSM14111', 'CSM14111'],
  'fs-react-native-2020': ['AYCSM14111', 'CSM14111'],
  'fs-containers': ['CSM141084'],
  'fs-psql': ['CSM14114'],
}

const token = process.env.TOKEN

const formRow = async (row) => {
  const parts = row.split(';')
  if (parts.length < 4) {
    return {}
  }

  const nro = parts[0]
  const course = parts[5] ? parts[5] : 'fs-rn'
  const codes = allCodes[course]
  const res = await axios.get(
    `https://importer.cs.helsinki.fi/api/importer/students/${nro}/enrollments?token=${token}`,
  )
  for (let i = 0; i < res.data.length; i++) {
    const reg = res.data[i]
    if (reg.courseUnit) {
      const { code } = reg.courseUnit
      if (codes.includes(code) && reg.state === 'ENROLLED') {
        const grade = parts[1] ? parts[1] : 'Hyv.'
        const theRow = `${parts[0]};${grade};${parts[2]};${parts[3]};${parts[4]};${code}`
        return { good: theRow }
      }
    }
  }

  return { error: nro }
}

const handleMissingReg = async (student) => {
  const { data } = await axios.get(
    `https://importer.cs.helsinki.fi/api/importer/students/${student}/details?token=${token}`,
  )
  const mails =
    (data.primaryEmail ? data.primaryEmail + ',' : '') +
    (data.secondaryEmail && data.primaryEmail !== data.secondaryEmail
      ? data.secondaryEmail + ', '
      : '')

  return mails
}

const byCode = (a, b) => (a.split(';')['5'] < b.split(';')['5'] ? -1 : 1)

const doMangel = async (string) => {
  const rows = string.split('\n')
  const bad = []
  const goodRows = []
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const ret = await formRow(row)
    if (ret.error) {
      bad.push(ret.error)
    } else if (ret.good) {
      goodRows.push(ret.good)
    }
  }

  const mangeledRows = []

  goodRows.sort(byCode).forEach((row) => mangeledRows.push(row))

  const subject =
    'Full stack open: ilmoittautuminen kurssille / registration to the course'

  const courses = {
    'fs-graphql': [
      '8 GraphQL',
      'https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-067b1506-0307-4118-9e2b-292e0b81e491',
    ],
    'fs-typescript': [
      '9 TypeScript',
      'https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-d9125f89-a440-48e1-898a-ee4e16b06cdb',
    ],
    'fs-rn': [
      '10 React Native',
      'https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-aa395a19-4625-44a9-8301-5fbb946c6ed6',
    ],
    'fs-cicd': [
      '11 CI/CD',
      'https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-4cb66c68-da12-422e-a34d-c8e8e7c8db01',
    ],
    'fs-containers': [
      '12 Containers',
      'https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-51a6f590-607c-4e34-bd6f-2d87e2203d9a',
    ],
    'fs-psql': [
      '13 relaatiotietokannat / relational databases',
      'https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-6e548d4e-75bf-483b-8426-c65d8c4e161c',
    ],
  }

  if (bad.length > 0) {
    mangeledRows.push('')
    mangeledRows.push('missing reg')
    mangeledRows.push(bad)
    mangeledRows.push('')

    let course = rows[0].split(';')[5]
    if (!course) {
      course = 'fs-rn'
    }

    for (let i = 0; i < bad.length; i++) {
      const row = await handleMissingReg(bad[i])
      mangeledRows.push(row)
    }

    mangeledRows.push('')
    mangeledRows.push(subject)
    mangeledRows.push('')

    const mail = `Et ole ilmoittautunut kurssin Full Stack Open osaan ${courses[course][0]}. Jos haluat rekisteröidä opintopisteet, ilmoittaudu seuraavan linkin kautta ${courses[course][1]}

You have not registered to part ${courses[course][0]} of the course Full Stack Open. If you want the university credits, please register using the link ${courses[course][1]}
    
Team Full stack`

    mangeledRows.push(mail)
  }

  return mangeledRows
}

const suotarMangel = async (req, res) => {
  const { courseName } = req.params
  const { string } = req.body

  console.log(courseName)

  const mangeledString = await doMangel(string)

  console.log('mangeled', mangeledString)

  res.send(mangeledString.join('\n'))
}

module.exports = {
  getAllForCourse,
  suotarMangel,
}
