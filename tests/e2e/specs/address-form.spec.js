const xpathSection = '//section[contains(@class, "address-form")]'

module.exports = {
  beforeEach: (browser) => {
    browser
      .refresh()
  },

  'Should show all fields': !function (browser) {
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

  'Should allow max characters in fields': !function (browser) {
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
        })
        .assert.valueLength(xpath, maxLength)
    })
  },

  'Should allow only numbers on number field on insert': async function (browser) {
    await validateOnlyNumbers(browser, `${xpathSection}//*[@id="number"]//input`, '12345')
  },
}

const validateOnlyNumbers = (browser, xpath, value, copyAndPaste) => {
  return new Promise((resolve) => {
    const xpathStreet = `${xpathSection}//*[@id="street"]//input`
    const invalidValue = `QWERTTYU#@ABc${value}dEF&*%%@!)-_`

    browser
      .clearValue(xpath)

    browser
      .perform((done) => {
        if (copyAndPaste) {
          return done()
        }

        browser
          .setValue(xpath, invalidValue, done)
      })

    browser
      .perform((done) => {
        if (!copyAndPaste) {
          return done()
        }

        browser
          .clearValue(xpathStreet)
          .setValue(xpathStreet, invalidValue)
          .sendKeys(xpathStreet, [browser.Keys.CONTROL, 'a'])
          .sendKeys(xpathStreet, [browser.Keys.CONTROL, 'x'])
          .sendKeys(xpath, [browser.Keys.CONTROL, 'v'], done)
      })

    browser
      .perform(() => {
        browser
          .expect.element(xpath).value.to.equal(value)

        resolve()
      })
  })
}
