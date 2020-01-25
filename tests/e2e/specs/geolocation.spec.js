const moment = require('moment')
const xpathSectionAddress = '//section[contains(@class, "address-form")]'
const xpathSectionWeatherCard = '//section[contains(@class, "weather-card")]'
const fields = [
  `${xpathSectionAddress}//*[@id="street"]//input`, `${xpathSectionAddress}//*[@id="number"]//input`, `${xpathSectionAddress}//*[@id="neighborhood"]//input`,
  `${xpathSectionAddress}//*[@id="cep"]//input`, `${xpathSectionAddress}//*[@id="city"]//input`, `${xpathSectionAddress}//*[@id="state"]//input`
]

const address = {
  street: 'bocaiúva',
  number: '2468',
  neighborhood: 'centro',
  cep: '88015902',
  city: 'florianópolis',
  state: 'sc'
}

let firstDate

module.exports = {
  beforeEach: (browser) => {
    browser
      .refresh()
  },

  'Should show weather conditions by geolocation': async function (browser) {
    const xpathWeatherCard = `//section[contains(@class, "weather-card")]`

    await fillInFields(browser)
    await browser.click('//*[@id="search"]')
    await browser.waitForLoadingModal()
    await browser.waitForElementVisible(xpathWeatherCard, 10000)

    browser
      .expect.element(xpathWeatherCard).to.be.visible

    const navigationButtons = [
      '//div[contains(@class, "v-window__prev")]',
      '//div[contains(@class, "v-window__next")]'
    ]

    browser
      .perform(() => {
        navigationButtons.forEach((xpath) => {
          browser
            .waitForElementVisible(xpath)

          browser
            .expect.element(xpath).to.be.visible
        })
      })

    const xpathDate = `(${xpathSectionWeatherCard}//*[@id="date"])[1]`

    browser
      .perform(() => {
        const fieldsHeader = [
          `(${xpathSectionWeatherCard}//div[contains(@class, "headline")])[1]`,
          xpathDate,
          `(${xpathSectionWeatherCard}//div[contains(@class, "temp")])[1]`
        ]

        fieldsHeader.forEach((field) => {
          browser
            .getText(field, (result) => {
              let text = result.value
              browser
                .assert.ok(text.length > 0, `Should field '${field}' has value: ${text}`)

              if (field === xpathDate) {
                text = text.substring(text.lastIndexOf(','))
                text = text.replace(', ', '')
                text = text.substring(0, text.indexOf(' ')).trim()
                firstDate = text
                const dateFormat = 'DD/MM/YYYY'

                browser
                  .assert.ok(moment(text, dateFormat).isValid(), `Should has date in format '${dateFormat}'`)
              }
            })
        })
      })

    browser
      .perform(() => {
        const xpathIcon = `(${xpathSectionWeatherCard}//*[@id="icon"]//div[contains(@class, "v-image__image")])[1]`

        browser
          .getAttribute(xpathIcon, 'style', (result) => {
            const style = result.value
            browser
              .assert.ok(style.includes('background-image: url("'), 'Should has icon')
          })
      })

    const xpathFields = `${xpathSectionWeatherCard}//div[contains(@class, "fields")]`
    const xpathFieldsLeft = `${xpathFields}//div[contains(@class, "text-left")]`
    const xpathFieldsRight = `${xpathFields}//div[contains(@class, "text-right")]`

    const tempFields = [
      'Temperatura mínima',
      'Temperatura máxima',
      'Vento',
      'Pressão',
      'Humidade',
      'Nascer do sol',
      'Pôr do sol'
    ]

    browser
      .elements('xpath', xpathFieldsLeft, (elements) => {
        elements.value.forEach((el, index) => {
          browser
            .elementIdText(el.ELEMENT, (result) => {
              const text = result.value.trim()
              const label = tempFields[index]
              browser
                .assert.ok(text === label, `Should field has text: '${label}'`)
            })
        })
      })

    browser
      .elements('xpath', xpathFieldsRight, (elements) => {
        elements.value.forEach((el, index) => {
          browser
            .elementIdText(el.ELEMENT, (result) => {
              const text = result.value.trim()
              const label = tempFields[index]

              browser
                .assert.ok(text.length > 0, `Should field '${label}' has value: '${text}'`)
            })
        })
      })
  },

  'Should clear all fields when click on clear button': !async function (browser) {
    await fillInFields(browser)
  },
}

const fillInFields = (browser) => {
  return new Promise((resolve) => {
    fields.forEach(async (field, index) => {
      let id = '//*[@id="'
      id = field.substring(field.lastIndexOf(id) + id.length)
      id = id.replace('"]//input', '')

      await browser.sendKeys(field, address[id])
      if (index === fields.length - 1) {
        resolve()
      }
    })
  })
}

const validateSaveHistory = (browser) => {
  return new Promise((resolve) => {

  })
}
