const xpathSection = '//section[contains(@class, "address-form")]'
const VMasker = require('vanilla-masker')

module.exports = {
  '@disabled': true,
  beforeEach: (browser) => {
    browser
      .refresh()
  },

  'Should show all fields': function (browser) {
    const fields = [
      `${xpathSection}//*[@id="street"]`, `${xpathSection}//*[@id="number"]`, `${xpathSection}//*[@id="neighborhood"]`,
      `${xpathSection}//*[@id="cep"]`, `${xpathSection}//*[@id="city"]`, `${xpathSection}//*[@id="state"]`
    ]

    fields.forEach((field) => {
      browser
        .waitForElementVisible(field)
        .expect.element(field).to.be.visible
    })
  },

  'Should allow max characters in fields': function (browser) {
    const fields = [
      {
        xpath: `${xpathSection}//*[@id="street"]//input`,
        maxLength: 50
      },
      {
        xpath: `${xpathSection}//*[@id="number"]//input`,
        maxLength: 5,
        value: '123456'
      },
      {
        xpath: `${xpathSection}//*[@id="neighborhood"]//input`,
        maxLength: 50
      },
      {
        xpath: `${xpathSection}//*[@id="cep"]//input`,
        maxLength: 9,
        value: '8801590212'
      },
      {
        xpath: `${xpathSection}//*[@id="city"]//input`,
        maxLength: 50
      },
      {
        xpath: `${xpathSection}//*[@id="state"]//input`,
        maxLength: 2
      }
    ]

    fields.forEach((field) => {
      const { xpath, maxLength, value } = field

      browser
        .waitForElementVisible(xpath)
        .perform((done) => {
          if (!value) {
            browser
              .setValueCustom(xpath, (maxLength + 1))
            return done()
          }

          browser
            .sendKeys(xpath, value, done)
            .assert.valueLength(xpath, maxLength)
        })
    })
  },

  'Should allow only numbers on number field on insert': async function (browser) {
    await validateOnlyNumbers(browser, `${xpathSection}//*[@id="number"]//input`, '12345')
  },

  'Should allow only numbers on number field on copy and paste': async function (browser) {
    await validateOnlyNumbers(browser, `${xpathSection}//*[@id="number"]//input`, '12345', true)
  },

  'Should allow only numbers on cep field on insert': async function (browser) {
    await validateOnlyNumbers(browser, `${xpathSection}//*[@id="cep"]//input`, '88015-902')
  },

  'Should allow only numbers on cep field on copy and paste': async function (browser) {
    await validateOnlyNumbers(browser, `${xpathSection}//*[@id="cep"]//input`, '88015-902', true)
  },

  'Should apply mask on cep field': async function (browser) {
    const xpath = `${xpathSection}//*[@id="cep"]//input`
    const value = '11111111'
    const maskValue = VMasker.toPattern(value, '99999-999')

    await browser.sendKeys(xpath, [value, browser.Keys.TAB])

    browser
      .expect.element(xpath).value.to.equal(maskValue)
  },

  'Should clear state field when state is invalid': async function (browser) {
    const xpath = `${xpathSection}//*[@id="state"]//input`
    const value = 'ed'

    await browser.sendKeys(xpath, [value, browser.Keys.TAB])

    browser
      .expect.element(xpath).value.to.equal('')
  },

  'Should disable search button when fields is not filled': function (browser) {
    const xpathSearch = '//*[@id="search"]'

    browser
      .assert.disabledProp(xpathSearch, true)
      .sendKeys('//*[@id="street"]//input', 'abc')
      .assert.disabledProp(xpathSearch, false)
  }
}

const validateOnlyNumbers = async (browser, xpath, value, copyAndPaste) => {
  return new Promise(async (resolve) => {
    const xpathStreet = `${xpathSection}//*[@id="street"]//input`
    const invalidValue = `QWERTTYU#@ABc${value}dEF&*%%@!)-_`

    await browser.clearValue(xpath)

    browser
      .perform((done) => {
        if (copyAndPaste) {
          return done()
        }

        browser
          .setValue(xpath, invalidValue, done)
      })

    browser
      .perform(async (done) => {
        if (!copyAndPaste) {
          return done()
        }

        await browser.clearValue(xpathStreet)
        await browser.sendKeys(xpathStreet, invalidValue)
        await browser.sendKeys(xpathStreet, [browser.Keys.CONTROL, 'a'])
        await browser.sendKeys(xpathStreet, [browser.Keys.CONTROL, 'x'])
        await browser.sendKeys(xpath, [browser.Keys.CONTROL, 'v'], done)
      })

    browser
      .perform(() => {
        browser
          .expect.element(xpath).value.to.equal(value)

        resolve()
      })
  })
}
