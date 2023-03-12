/* eslint-disable dot-notation */
/* eslint-disable no-await-in-loop */
const axios = require('axios')

const { getAdminsForACourse } = require('@util/common')

const getAllForCourse = async (req, res) => {
  const { courseName } = req.params

  res.send(getAdminsForACourse(courseName))
}

const pateClient = axios.create({
  baseURL: 'https://importer.cs.helsinki.fi/api/pate',
  params: {
    token: process.env.TOKEN,
  },
})

const suotarClient = axios.create({
  baseURL: 'https://opetushallinto.cs.helsinki.fi/api/create',
  params: {
    token: process.env.SUOTAR_TOKEN,
  },
})

const sentEmail = async (targets, text, akateemiset = false) => {
  const subject = akateemiset
    ? 'Akateemiset taidot: ilmoittautuminen kurssille'
    : 'Full stack open: ilmoittautuminen kurssille / registration to the course'
  const header = akateemiset
    ? 'Sent by TKT-robot'
    : 'Sent by Full stack open -robot'

  const emails = targets.map((to) => {
    return {
      to,
      subject,
    }
  })

  const mail = {
    template: {
      text,
    },
    emails,
    settings: {
      hideToska: false,
      disableToska: true,
      header,
    },
  }

  await pateClient.post('/', mail)
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
  'akateemiset-taidot-2022-23': ['TKT50004'],
  rails2022: ['TKT21003'],
  TKT21003: ['TKT21003'],
  'docker2023-1': ['TKT21036'],
  'docker2023-2': ['TKT21037'],
  'docker2023-3': ['TKT21038'],
}

const newCodes = {
  'fs-cicd': 'CSM14112',
  'fs-typescript': 'CSM14110',
  'fs-graphql': 'CSM14113',
  'fs-rn': 'CSM14111',
  'fs-react-native-2020': 'CSM14111',
  'fs-containers': 'CSM141084',
  'fs-psql': 'CSM14114',
  'akateemiset-taidot-2022-23': 'TKT50004',
  'docker2023-1': 'TKT21036',
  'docker2023-2': 'TKT21037',
  'docker2023-3': 'TKT21038',
  rails2022: 'TKT21003',
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

      let teacher = code !== 'CSM14111' ? 'mluukkai' : 'mluukkai'
      if (code === 'TKT50004') {
        teacher = 'klemstro'
      }

      if (codes.includes(code) && reg.state === 'ENROLLED') {
        const grade = parts[1] ? parts[1] : 'Hyv.'
        const theRow = `${parts[0]};${grade};${parts[2]};${parts[3]};${parts[4]};${code};${teacher}`
        return { good: theRow }
      }
    }
  }

  return { error: nro }
}

const emailOfMissingReg = async (student) => {
  const { data } = await axios.get(
    `https://importer.cs.helsinki.fi/api/importer/students/${student}/details?token=${token}`,
  )

  const mails = []

  if (data.primaryEmail) {
    mails.push(data.primaryEmail)
  }
  if (data.secondaryEmail && data.primaryEmail !== data.secondaryEmail) {
    mails.push(data.secondaryEmail)
  }

  return mails
}

const byCode = (a, b) => (a.split(';')['5'] < b.split(';')['5'] ? -1 : 1)

const printBadRows = (bad, rows) => {
  const producedRows = []
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const student = row.split(';')[0]

    if (bad.includes(student)) {
      const parts = rows[i].split(';')
      parts[5] = newCodes[parts[5]]
      const code = parts[5]
      let teacher = code !== 'CSM14111' ? 'mluukkai' : 'mluukkai'
      if (code === 'TKT50004') {
        teacher = 'klemstro'
      }
      parts.push(teacher)
      producedRows.push(parts.join(';'))
    }
  }

  return producedRows
}

const doMangel = async (string, shouldMail) => {
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

  let mangeledRows = []

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
    'fs-react-native-2020': [
      '10 React Native',
      'https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-aa395a19-4625-44a9-8301-5fbb946c6ed6',
    ],
    'akateemiset-taidot-2022-23': [
      'Akateemiset taidot',
      'https://studies.helsinki.fi/opintotarjonta/cur/hy-opt-cur-2223-5af44499-5e8a-42f1-9d05-3dd52d4517fe/TKT50004/Akateemiset_taidot_Luento_opetus',
    ],
    'docker2023-1': [
      'DevOps with Docker',
      'https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-a1a074e0-dc7f-4644-8796-04fab528ba36',
    ],
    'docker2023-2': [
      'DevOps with Docker: Docker Compose',
      'https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-d37daa67-f5b1-4bdb-88a5-98107d2c63ea',
    ],
    'docker2023-3': [
      'DevOps with Docker: Security and Optimization',
      'https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-68b6e802-0b55-438c-85aa-1fd9d0ad80be',
    ],
    TKT21003: [['a', 'b']],
  }

  if (bad.length > 0) {
    mangeledRows.push('')
    mangeledRows.push('missing registrations')
    mangeledRows.push('')
    mangeledRows = mangeledRows.concat(printBadRows(bad, rows))
    mangeledRows.push('')

    let course = rows[0].split(';')[5]
    if (!course) {
      course = 'fs-rn'
    }

    let missingRegEmails = []

    for (let i = 0; i < bad.length; i++) {
      const mails = await emailOfMissingReg(bad[i])
      missingRegEmails = missingRegEmails.concat(mails)
      if (!shouldMail) {
        mangeledRows.push(mails.join(', '))
      }
    }

    const mail = `Et ole ilmoittautunut kurssin Full Stack Open osaan ${courses[course][0]}. Jos haluat rekisteröidä opintopisteet, ilmoittaudu seuraavan linkin kautta ${courses[course][1]}

You have not registered to part ${courses[course][0]} of the course Full Stack Open. If you want the university credits, please register using the link ${courses[course][1]}
    
Team Full stack`

    if (!shouldMail) {
      mangeledRows.push('')
      mangeledRows.push(subject)
      mangeledRows.push('')
      mangeledRows.push(mail)
    }

    if (shouldMail) {
      missingRegEmails = missingRegEmails.concat('matti.luukkainen@helsinki.fi')
      await sentEmail(missingRegEmails, mail)
    }
  }

  return mangeledRows
}

const doMangelDocker = async (string, shouldMail) => {
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

  let mangeledRows = []

  goodRows.sort(byCode).forEach((row) => mangeledRows.push(row))

  const subject =
    'DevOps with Docker: ilmoittautuminen kurssille / registration to the course'

  const courses = {
    'docker2023-1': [
      'DevOps with Docker: part 1',
      'https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-a1a074e0-dc7f-4644-8796-04fab528ba36',
    ],
    'docker2023-2': [
      'DevOps with Docker: Docker Compose (part 2)',
      'https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-d37daa67-f5b1-4bdb-88a5-98107d2c63ea',
    ],
    'docker2023-3': [
      'DevOps with Docker: Security and Optimization (part 3)',
      'https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-68b6e802-0b55-438c-85aa-1fd9d0ad80be',
    ],
  }

  if (bad.length > 0) {
    mangeledRows.push('')
    mangeledRows.push('missing registrations')
    mangeledRows.push('')
    mangeledRows = mangeledRows.concat(printBadRows(bad, rows))
    mangeledRows.push('')

    let missingRegEmails = []

    for (let i = 0; i < bad.length; i++) {
      const mails = await emailOfMissingReg(bad[i])
      missingRegEmails = missingRegEmails.concat(mails)
      missingRegEmails = [...new Set(missingRegEmails)]
    }

    if (!shouldMail) {
      mangeledRows.push(missingRegEmails.join(', '))
    }

    const mail = `Et ole ilmoittautunut kurssin DevOps with Docker kaikkiin tarvittaviin osiin. Jos haluat rekisteröidä opintopisteet, ilmoittaudu kurssisivun kautta jokaiseen osaan minkä suoritusmerkintää haet}

You have not registered properly to the course DevOps with Docker. If you want the university credits, please register using the links in the course page.}
    
Team DevOps with Docker`

    if (!shouldMail) {
      mangeledRows.push('')
      mangeledRows.push(subject)
      mangeledRows.push('')
      mangeledRows.push(mail)
    }

    if (shouldMail) {
      missingRegEmails = missingRegEmails.concat('matti.luukkainen@helsinki.fi')
      await sentEmail(missingRegEmails, mail)
    }
  }

  return mangeledRows
}


const allCodesFs = {
  ext2: ['AYCSM141083', 'AYCSM141083en', 'CSM141083'],
  ext1: ['AYCSM141082', 'AYCSM141082en', 'CSM141082'],
  fs: [
    'AYCSM141081',
    'AYCSM141081en',
    'AYCSM14108',
    'AYCSM14108en',
    'CSM141081',
  ],
}

let goodRowsFs = {
  AYCSM141081: [],
  AYCSM141081en: [],
  AYCSM14108: [],
  AYCSM14108en: [],
  AYCSM141082: [],
  AYCSM141082en: [],
  AYCSM141083: [],
  AYCSM141083en: [],
  CSM141081: [],
  CSM141082: [],
  CSM141083: [],
}

const allExtRows = {
  AYCSM141082: [],
  AYCSM141082en: [],
  AYCSM141083: [],
  AYCSM141083en: [],
  CSM141082: [],
  CSM141083: [],
}

const formRowFs = async (row) => {
  const parts = row.split(';')
  const nro = parts[0]
  const course = parts[5]
  const codes = allCodesFs[course]
  const res = await axios.get(
    `https://importer.cs.helsinki.fi/api/importer/students/${nro}/enrollments?token=${token}`,
  )

  if (['ext1', 'ext2'].includes(course)) {
    const theCode = course === 'ext1' ? 'AYCSM141082' : 'AYCSM141083'
    const theRow = `${parts[0]};${parts[1]};${parts[2]};${parts[3]};${parts[4]};${theCode};mluukkai`
    allExtRows[theCode].push(theRow)
  }

  for (let i = 0; i < res.data.length; i++) {
    const reg = res.data[i]
    if (reg.courseUnit) {
      const { code } = reg.courseUnit
      let teacher = code !== 'CSM14111' ? 'mluukkai' : 'mluukkai'
      if (code === 'TKT50004') {
        teacher = 'klemstro'
      }
      if (codes.includes(code) && reg.state === 'ENROLLED') {
        const theRow = `${parts[0]};${parts[1]};${parts[2]};${parts[3]};${parts[4]};${code};${teacher}`
        goodRowsFs[code].push(theRow)
        return
      }
    }
  }

  return nro
}

const getRowsFs = async (file, postfix, rows) => {
  const bads = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]

    if (!row.endsWith(postfix)) {
      continue
    }

    const ret = await formRowFs(row)
    if (ret) {
      bads.push(ret)
    }
  }

  return bads
}

const printBadRowsFs = async (file, bad, code, extension, rows) => {
  const producedRows = []
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const student = row.split(';')[0]

    if (bad.includes(student) && row.endsWith(extension)) {
      let teacher = code !== 'CSM14111' ? 'mluukkai' : 'mluukkai'
      if (code === 'TKT50004') {
        teacher = 'klemstro'
      }
      const parts = rows[i].split(';')
      parts[5] = code
      parts.push(teacher)
      producedRows.push(parts.join(';'))
    }
  }

  return producedRows
}

const printRowsFs = (rows, except = []) => {
  const rowsToPrint = []
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const student = row.split(';')[0]

    if (!except.includes(student)) {
      rowsToPrint.push(row)
    }
  }

  return rowsToPrint
}

const has_old_course = () => {
  const students = goodRowsFs['AYCSM14108'].map((r) => r.split(';')[0])
  return students.concat(goodRowsFs['AYCSM14108en'].map((r) => r.split(';')[0]))
}

const minus = (set1, set2) => set1.filter((a) => !set2.includes(a))

const has_ext1 = (student) => {
  const a = allExtRows['AYCSM141082']
    .map((r) => r.split(';')[0])
    .includes(student)

  return a ? 1 : 0
}

const has_ext2 = (student) => {
  const a = allExtRows['AYCSM141083']
    .map((r) => r.split(';')[0])
    .includes(student)

  return a ? 1 : 0
}

const betterRowFs = (row) => {
  const parts = row.split(';')
  const student = parts[0]
  const op = `${String(
    Number(parts[2].replace(',', '.')) + has_ext1(student) + has_ext2(student),
  ).replace('.', ',')},0`
  return [parts[0], parts[1], op, parts[3], parts[4], parts[5]].join(';')
}

const fsMangel = async (rawString, shouldMail) => {
  const rawRows = rawString.split('\n')
  goodRowsFs = {
    AYCSM141081: [],
    AYCSM141081en: [],
    AYCSM14108: [],
    AYCSM14108en: [],
    AYCSM141082: [],
    AYCSM141082en: [],
    AYCSM141083: [],
    AYCSM141083en: [],
    CSM141081: [],
    CSM141082: [],
    CSM141083: [],
  }
  const bads = await getRowsFs('./rows.csv', ';fs', rawRows)

  const subject =
    'Full stack open: ilmoittautuminen kurssille / registration to the course'

  const mail1 = `Et ole ilmoittautunut kaikkiin kurssin Full Stack Open osiin. Jos haluat kaikki opintopisteet, ilmoittaudu lisäosaan 1 seuraavan linkin kautta https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-c67dc747-1d6a-43cb-b40b-9eacf425dcc0

You have not registered to all course parts of Full Stack Open. If you want all credits registered, please register to extension 1 with the link https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-c67dc747-1d6a-43cb-b40b-9eacf425dcc0

Team Full stack`

  const mail2 = `Et ole ilmoittautunut kaikkiin kurssin Full Stack Open osiin. Jos haluat kaikki opintopisteet, ilmoittaudu lisäosaan 2 seuraavan linkin kautta
https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-3016e9c9-0fdc-4ee3-9e9b-38176359f9f3

You have not registered to all course parts of Full Stack Open. If you want all credits registered, please register to extension 2 with the link https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-3016e9c9-0fdc-4ee3-9e9b-38176359f9f3

Team Full stack`

  const mail3 = `Ilmoittautumisesi kurssille Full Stack Open ei ole voimassa, tee uusi ilmoittautuminen/ilmoittautumiset kurssimateriaalin ohjeiden mukaan, ks. https://fullstackopen.com/osa0/yleista

You have not properly registered to the course Full Stack Open. If you want credits registered, register by following the advice given in the course page https://fullstackopen.com/en/part0/general_info

Team Full stack`

  let producedRows = []

  producedRows = producedRows.concat(printRowsFs(goodRowsFs['AYCSM141081']))
  producedRows = producedRows.concat(printRowsFs(goodRowsFs['AYCSM141081en']))
  producedRows = producedRows.concat(printRowsFs(goodRowsFs['CSM141081']))

  const olds = has_old_course()

  const badsExt1 = await getRowsFs('./rows.csv', ';ext1', rawRows)

  producedRows = producedRows.concat(
    printRowsFs(goodRowsFs['AYCSM141082'], olds),
  )
  producedRows = producedRows.concat(
    printRowsFs(goodRowsFs['AYCSM141082en'], olds),
  )
  producedRows = producedRows.concat(printRowsFs(goodRowsFs['CSM141082'], olds))

  const badsExt2 = await getRowsFs('./rows.csv', ';ext2', rawRows)

  producedRows = producedRows.concat(
    printRowsFs(goodRowsFs['AYCSM141083'], olds),
  )
  producedRows = producedRows.concat(
    printRowsFs(goodRowsFs['AYCSM141083en'], olds),
  )
  producedRows = producedRows.concat(printRowsFs(goodRowsFs['CSM141083'], olds))

  for (let i = 0; i < goodRowsFs['AYCSM14108'].length; i++) {
    const row = goodRowsFs['AYCSM14108'][i]
    producedRows.push(betterRowFs(row))
  }

  for (let i = 0; i < goodRowsFs['AYCSM14108en'].length; i++) {
    const row = goodRowsFs['AYCSM14108en'][i]
    producedRows.push(betterRowFs(row))
  }

  const missingExt1 = minus(minus(badsExt1, olds), bads)
  const missingExt2 = minus(minus(badsExt2, olds), bads)

  if (missingExt1.length + missingExt2.length > 0) {
    producedRows.push('')
    producedRows.push('')
    producedRows.push('no ilmo found for exts:')
  }

  if (missingExt1.length > 0) {
    producedRows = producedRows.concat(
      await printBadRowsFs(
        './rows.csv',
        missingExt1,
        'CSM141082',
        'ext1',
        rawRows,
      ),
    )
  }

  if (missingExt2.length > 0) {
    producedRows = producedRows.concat(
      await printBadRowsFs(
        './rows.csv',
        missingExt2,
        'CSM141083',
        'ext2',
        rawRows,
      ),
    )
    producedRows.push('')
  }

  if (missingExt1.length > 0) {
    let missingRegEmails = []

    if (!shouldMail) {
      producedRows.push('')
      producedRows.push('')
      producedRows.push('no ilmo found ext 1:')
    }

    for (let i = 0; i < missingExt1.length; i++) {
      const mails = await emailOfMissingReg(missingExt1[i])
      missingRegEmails = missingRegEmails.concat(mails)
      if (!shouldMail) {
        producedRows.push(mails.join(', '))
      }
    }

    if (!shouldMail) {
      producedRows.push('')
      producedRows.push(subject)
      producedRows.push('')
      producedRows.push(mail1)
    }

    if (shouldMail) {
      missingRegEmails = missingRegEmails.concat('matti.luukkainen@helsinki.fi')
      await sentEmail(missingRegEmails, mail1)
    }
  }

  if (missingExt2.length > 0) {
    let missingRegEmails = []

    if (!shouldMail) {
      producedRows.push('')
      producedRows.push('')
      producedRows.push('no ilmo found ext 2:')
    }

    for (let i = 0; i < missingExt2.length; i++) {
      const mails = await emailOfMissingReg(missingExt2[i])
      missingRegEmails = missingRegEmails.concat(mails)
      if (!shouldMail) {
        producedRows.push(mails.join(', '))
      }
    }

    if (!shouldMail) {
      producedRows.push('')
      producedRows.push(subject)
      producedRows.push('')
      producedRows.push(mail2)
    }

    if (shouldMail) {
      missingRegEmails = missingRegEmails.concat('matti.luukkainen@helsinki.fi')
      await sentEmail(missingRegEmails, mail2)
    }
  }

  if (bads.length > 0) {
    producedRows.push('')
    producedRows.push('')
    producedRows.push('ilmo entirely missing')
    producedRows.push(bads)

    let missingRegEmails = []

    for (let i = 0; i < bads.length; i++) {
      const mails = await emailOfMissingReg(bads[i])
      missingRegEmails = missingRegEmails.concat(mails)
      producedRows = producedRows.concat(mails.join(', '))
    }

    if (!shouldMail) {
      producedRows.push('')
      producedRows.push(subject)
      producedRows.push('')
      producedRows.push(mail3)
    }

    if (shouldMail) {
      missingRegEmails = missingRegEmails.concat('matti.luukkainen@helsinki.fi')
      await sentEmail(missingRegEmails, mail3)
    }
  }

  return producedRows
}

const doMangelAkat = async (string, shouldMail) => {
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

  let mangeledRows = []

  goodRows.sort(byCode).forEach((row) => mangeledRows.push(row))

  const subject = 'Akateemiset taidot: ilmoittautuminen kurssille'

  const courses = {
    'akateemiset-taidot-2022-23': [
      'Akateemiset taidot',
      'https://studies.helsinki.fi/opintotarjonta/cur/hy-opt-cur-2223-5af44499-5e8a-42f1-9d05-3dd52d4517fe/TKT50004/Akateemiset_taidot_Luento_opetus',
    ],
  }

  if (bad.length > 0) {
    mangeledRows.push('')
    mangeledRows.push('missing registrations')
    mangeledRows.push('')
    mangeledRows = mangeledRows.concat(printBadRows(bad, rows))
    mangeledRows.push('')

    let missingRegEmails = []

    for (let i = 0; i < bad.length; i++) {
      const mails = await emailOfMissingReg(bad[i])
      missingRegEmails = missingRegEmails.concat(mails)
      if (!shouldMail) {
        mangeledRows.push(mails.join(', '))
      }
    }

    const mail = `Et ole ilmoittautunut kurssille Akateemiset taidot. Suoritusmerkintää ei voida kirjata ilman ilmoittautumista. Ilmoittaudu seuraavan linkin kautta https://studies.helsinki.fi/opintotarjonta/cur/hy-opt-cur-2223-5af44499-5e8a-42f1-9d05-3dd52d4517fe/TKT50004/Akateemiset_taidot_Luento_opetus`

    if (!shouldMail) {
      mangeledRows.push('')
      mangeledRows.push(subject)
      mangeledRows.push('')
      mangeledRows.push(mail)
    }

    if (shouldMail) {
      missingRegEmails = missingRegEmails.concat('matti.luukkainen@helsinki.fi')
      await sentEmail(missingRegEmails, mail, true)
    }
  }

  return mangeledRows
}

const suotarMangel = async (req, res) => {
  const { courseName } = req.params
  const { string, email } = req.body

  if (courseName === 'ofs19') {
    const mangeledString = await fsMangel(string, email)
    res.send(mangeledString.join('\n'))
  } else if (courseName === 'akateemiset-taidot-2022-23') {
    const mangeledString = await doMangelAkat(string, email)
    res.send(mangeledString.join('\n'))
  } else if (courseName.includes('docker')) {
    const mangeledString = await doMangelDocker(string, email)
    res.send(mangeledString.join('\n'))  
  } else {
    const mangeledString = await doMangel(string, email)
    res.send(mangeledString.join('\n'))
  }
}

const sisu = async (req, res) => {
  const { mangeled, courseName } = req.body

  const body = {
    entries: mangeled.split('\n'),
    senderUid: courseName !== 'fs-react-native-2020' ? 'mluukkai' : 'mluukkai',
  }

  const response = await suotarClient.post('/', body)

  res.send({ status: response.status, data: response.data })
}

module.exports = {
  getAllForCourse,
  suotarMangel,
  sisu,
}
