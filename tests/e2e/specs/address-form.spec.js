const xpathSection = '//section[contains(@class, "address-form")]'

module.exports = {
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
        })
        .assert.valueLength(xpath, maxLength)
    })
  },

  // 'Should allow only numbers on sla field on insert': async function (browser) {
  //   await validateSla(browser)
  // },
}
