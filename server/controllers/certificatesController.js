const getCertificate = async (req, res) => {
  const random = req.params.id
  const lang = req.params.lang

  const user = await models.User
    .findOne({ random })
    .populate('submissions')
    .exec()

  if (!user) {
    return res.status(404).end()
  }

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.setExtraHTTPHeaders({
    'Authorization': `Bearer ${SECRET_KEY}`,
  })

  const baseurl = process.env.NODE_ENV === 'production' ?
    'https://studies.cs.helsinki.fi/fullstackopen2019' :
    'http://localhost:3000'

  const url = `${baseurl}/admin/certificate/${lang}/${random}.html`

  await page.goto(url, {
    waitUntil: 'networkidle2'
  })

  await page.setViewport({ width: 3508, height: 2480 })
  const format = 'png'
  let certFile, mime, extension
  if (format === 'png') {
    certFile = await page.screenshot({ encoding: 'binary' })
    mime = 'image/png'
    extension = 'png'
  } else if (format === 'pdf') {
    certFile = await page.pdf({ format: 'A4', landscape: true, scale: 0.33, pageRanges: '1', printBackground: true })
    mime = 'application/pdf'
    extension = 'pdf'
  } else {
    return res.status(400).end()
  }
  await browser.close()
  res.setHeader('Content-Length', certFile.length)
  res.setHeader('Content-Type', mime)
  const filename = `certificate-fullstackopen.${extension}`
  res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(filename)}`)
  res.send(certFile)
}

const getCertificateHTML = async (req, res) => {
  const random = req.params.id
  const lang = req.params.lang

  const user = await models.User
    .findOne({ random })
    .populate('submissions')
    .exec()

  const submissions = util.extendSubmissions(user)

  const exerciseCount = (s) => {
    if (s.exercises) {
      return s.exercises.length
    }
    return s.exercise_count
  }

  const stud = {
    total_exercises: submissions.map(exerciseCount).reduce((sum, e) => e + sum, 0),
    submissions
  }

  const d = new Date(user.completed)
  const date = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`

  const part8 = submissions.find(s => s.week === 8)
  const p8credit = part8 ? part8.exercises.length > 21 : 0

  const grade = util.grade(stud)
  const credits = util.credits(stud) + p8credit

  const data = {
    name: user.name,
    id: user.random,
    date,
    title: lang === 'fi' ? 'Kurssitodistus' : 'Certificate of completion',
    text: credits === 3 ?
      (lang === 'fi' ? 'on suorittanut kurssin hyväksytysti 3 opintopisteen laajuisena' : 'This is to certify that you have succesfully completed the 3 ECTS online course') :
      (lang === 'fi' ? `On suorittanut kurssin hyväksytysti ${credits} opintopisteen laajuisena arvosanalla ${grade}` : `This is to certify that you have succesfully completed the ${credits} ECTS online course with grade ${grade}`)
  }

  res.render(`${lang}/index.html`, data)
}

module.exports = {
  getCertificate,
  getCertificateHTML,
}