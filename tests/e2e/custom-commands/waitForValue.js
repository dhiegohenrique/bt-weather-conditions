/* eslint-disable no-console */
const moment = require('moment')
const EventEmitter = require('events')
EventEmitter.defaultMaxListeners = 0
const waitTime = 60000

class WaitForValue extends EventEmitter {
  command (selector, value, cb) {
    const self = this
    const duration = moment().add(waitTime, 'ms')

    self.api
      .perform((done) => {
        const checkAttribute = () => {
          const timer = setTimeout(() => {
            if (moment() >= duration) {
              const currentTest = self.api.currentTest
              const currentModule = currentTest.module
              const folder = currentModule.replace('.spec', '')

              let name = currentTest.name || 'error'
              name += moment().format('_DD_MM_YYYY_HH_mm_ss_SSS')

              let message = `Waiting for value of ${selector} equals '${value}' fail in ${waitTime}ms`
              if (currentTest.name) {
                message += ` on test ${currentTest.name}`
              }

              self.api
                .saveScreenshot(`./test/e2e/screenshots/${folder}/${name}.png`)

              console.log('\x1b[31m', message)
              clearTimeout(timer)
              done()
              throw new Error()
            } else {
              self.api
                .getValue(selector, (result) => {
                  console.log(`Waiting for ${selector} value equals '${value}'... Current value: ${result.value}`)
                  if (!(String(result.value) === String(value))) {
                    checkAttribute()
                  } else {
                    clearTimeout(timer)
                    done()
                  }
                })
            }
          }, 1000)
        }
        checkAttribute()
      })

    self.api
      .perform((done) => {
        if (cb) {
          cb()
        }

        self.emit('complete')
        done()
      })

    return this
  }
}

module.exports = WaitForValue
