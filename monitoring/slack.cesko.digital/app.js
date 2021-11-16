const URL = 'https://slack.cesko.digital'

const EXPECTED_TITLE = 'Join Česko.Digital on Slack | Slack'
const EXPECTED_TEXT = 'See what Česko.Digital is up to'

const puppeteer = require('puppeteer')

let browser = null

module.exports.main = async (event) => {
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--headless',
        '--single-process',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox'
      ]
    })

    const page = await browser.newPage()

    let url = URL

    if (event && event.queryStringParameters && event.queryStringParameters.test) {
      url = 'http://example.com'
    }

    await page.goto(url)

    const pageTitle = await page.title()
    console.log('Title:', pageTitle)

    const pageText = await page.$eval('h1', el => el.textContent)
    console.log('Text: ', pageText)

    const errors = []

    if (pageTitle !== EXPECTED_TITLE) {
      errors.push('Unexpected page title')
    }

    if (pageText !== EXPECTED_TEXT) {
      errors.push('Unexpected page text')
    }

    if (errors.length > 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'ERROR', errors: errors })
      }
    } else {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'OK' })
      }
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'FAILURE', errors: [error] })
    }
  } finally {
    if (browser !== null) {
      await browser.close()
    }
  }
}
