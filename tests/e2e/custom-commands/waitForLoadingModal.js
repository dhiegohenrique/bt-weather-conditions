/* eslint-disable no-console */
const moment = require('moment')
const EventEmitter = require('events')
EventEmitter.defaultMaxListeners = 0
const xpath = '//*[@id="loading-modal"]/parent::section[contains(@style, "display: none")]'
const waitTime = 300000

class WaitForLoadingModal extends EventEmitter {
  command (cb) {
    const self = this
    const duration = moment().add(waitTime, 'ms')

    self.api
      .waitForElementPresent(xpath, waitTime)
      .perform((done) => {
        const checkAttribute = () => {
          const timer = setTimeout(() => {
            if (moment() >= duration) {
              const currentTest = self.api.currentTest
              const currentModule = currentTest.module
              const folder = currentModule.replace('.spec', '')

              let name = currentTest.name || 'error'
              name += moment().format('_DD_MM_YYYY_HH_mm_ss_SSS')

              let message = `Waiting for loading modal contains style: 'display none' fail in ${waitTime}ms`
              if (currentTest.name) {
                message += ` on test ${currentTest.name}`
              }

              self.api
                .saveScreenshot(`./tests/e2e/screenshots/${folder}/${name}.png`)

              console.log('\x1b[31m', message)
              clearTimeout(timer)
              done()
              throw new Error()
            } else {
              console.log('Waiting for loading modal is not visible...')
              self
                .api.elements('xpath', xpath, (result) => {
                  if (!result.value.length) {
                    checkAttribute()
                  } else {
                    clearTimeout(timer)
                    done()
                  }
                })
            }
          }, 500)
        }
        checkAttribute()
      })

    self.api
      .perform(() => {
        self
          .api
          .waitForElementPresent(xpath, waitTime)
      })

    self.api
      .perform((done) => {
        if (cb) {
          cb()
        }

        this.emit('complete')
        done()
      })

    return this
  }
}

module.exports = WaitForLoadingModal
