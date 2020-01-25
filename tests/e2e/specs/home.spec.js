const b64 = require('base64-async')
const path = require('path')
const fs = require('fs')
const axios = require('axios')
const util = require('util')
const readFile = util.promisify(fs.readFile)
const xpathLogo = '//*[@id="logo"]'

module.exports = {
  beforeEach: (browser) => {
    browser
      .refresh()
  },

  'Should show logo': function (browser) {
    browser
      .waitForElementVisible(xpathLogo)
      .expect.element(xpathLogo).to.be.visible
  },

  'Should correct image': async function (browser) {
    const buffer = await readFile(path.join(process.cwd(), 'src/assets/rain.png'))
    const imgBase64 = await b64.encode(buffer)

    const result = await browser.url()
    const url = result.value.replace('/#/', '')

    browser
      .getAttribute(`${xpathLogo}//div[contains(@class, "v-image__image")]`, 'style', async (result) => {
        const style = result.value
        let backgroundImage = `background-image: url("`
        backgroundImage = style.substring(style.lastIndexOf(backgroundImage) + backgroundImage.length)
        backgroundImage = backgroundImage.substring(0, backgroundImage.lastIndexOf('")'))

        const res = await axios.get(`${url}${backgroundImage}`, { responseType: 'arraybuffer' })
        const resImgBase64 = await b64.encode(res.data)
        browser
          .assert.ok(imgBase64 === resImgBase64, 'Should has corret image')
      })
  }
}
