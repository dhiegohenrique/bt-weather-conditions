/* eslint-disable no-console */
const moment = require('moment')
const EventEmitter = require('events')
EventEmitter.defaultMaxListeners = 0
const waitTime = 120000

class WaitForCondition extends EventEmitter {
  command (condition, cb) {
    const self = this
    const duration = moment().add(waitTime, 'ms')

    self.api
      .perform((done) => {
        const checkCondition = () => {
          const timer = setTimeout(async () => {
            if (moment() >= duration) {
              const currentTest = self.api.currentTest
              const currentModule = currentTest.module
              const folder = currentModule.replace('.spec', '')

              let name = currentTest.name || 'error'
              name += moment().format('_DD_MM_YYYY_HH_mm_ss_SSS')

              let message = `Waiting for condition ${condition} fail in ${waitTime}ms`
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
              console.log('Waiting for condition...')
              if (!await condition()) {
                checkCondition()
              } else {
                clearTimeout(timer)
                done()
              }
            }
          }, 500)
        }
        checkCondition()
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

module.exports = WaitForCondition
