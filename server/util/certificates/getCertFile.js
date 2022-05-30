const puppeteer = require('puppeteer')
const mustache = require('mustache')

const logger = require('../logger')

const getCertFile = async (htmlTemplate, mustacheFieldsObject) => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless'],
  })
  try {
    const page = await browser.newPage()
    const html = mustache.render(htmlTemplate, mustacheFieldsObject)

    await page.setContent(html)
    await page.setViewport({ width: 3508, height: 2480 })

    const screenshotBuffer = await page.screenshot({ encoding: 'binary' })
    return screenshotBuffer
  } catch (e) {
    logger.error('Sertit ei toimi', e)
    return null
  } finally {
    await browser.close()
  }
}

module.exports = getCertFile
