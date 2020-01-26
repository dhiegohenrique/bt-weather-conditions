const moment = require('moment')
const xpathSectionAddress = '//section[contains(@class, "address-form")]'
const xpathSectionWeatherCard = '//section[contains(@class, "weather-card")]'
const xpathSearch = '//*[@id="search"]'
const xpathPrevious = '//div[contains(@class, "v-window__prev")]'
const xpathNext = '//div[contains(@class, "v-window__next")]'
const xpathDate = `${xpathSectionWeatherCard}//*[@id="date"]`
const xpathTransaction = '//div[contains(@class, "v-window__container--is-active")]'
const dateFormat = 'DD/MM/YYYY'
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

module.exports = {
  beforeEach: (browser) => {
    browser
      .refresh()
  },

  'Should show weather conditions by geolocation': !async function (browser) {
    await fillInFields(browser)
    await browser.click(xpathSearch)
    await browser.waitForLoadingModal()
    await browser.waitForElementVisible(xpathSectionWeatherCard, 10000)

    browser
      .expect.element(xpathSectionWeatherCard).to.be.visible

    const navigationButtons = [
      xpathNext,
      xpathPrevious
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



    browser
      .perform(() => {
        const fieldsHeader = [
          `${xpathSectionWeatherCard}//div[contains(@class, "headline")]`,
          xpathDate,
          `${xpathSectionWeatherCard}//div[contains(@class, "temp")]`
        ]

        fieldsHeader.forEach((field) => {
          browser
            .getText(field, (result) => {
              let text = result.value
              browser
                .assert.ok(text.length > 0, `Should field '${field}' has value: ${text}`)

              if (field === xpathDate) {
                text = getDate(text)
                browser
                  .assert.ok(moment(text, dateFormat).isValid(), `Should has date in format '${dateFormat}'`)
              }
            })
        })
      })

    browser
      .perform(() => {
        const xpathIcon = `${xpathSectionWeatherCard}//*[@id="icon"]//div[contains(@class, "v-image__image")]`

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

  'Should change weather conditions when click on next button': async function (browser) {
    await fillInFields(browser)
    await browser.click(xpathSearch)
    await browser.waitForLoadingModal()

    const result = await browser.getText(xpathDate)
    const firstDate = getDate(result.value)
    const nextDate = moment(firstDate, dateFormat).add(1, 'day').format(dateFormat)

    await browser.click(xpathNext)
    await browser.waitForElementNotPresent(xpathTransaction)
    await browser.waitForElementVisible(`${xpathSectionWeatherCard}//*[@id="date" and contains(text(),'${nextDate}')]`)
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

const getDate = (text) => {
  console.log('entrou aqui1: ' + text)
  text = text.substring(text.lastIndexOf(', ') + 2)
  console.log('entrou aqui2: ' + text)
  text = text.substring(0, 10)
  console.log('entrou aqui3: ' + text)
  return text
}
