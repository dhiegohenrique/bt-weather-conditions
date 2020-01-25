const fastLoremIpsum = require('fast-lorem-ipsum')
const EventEmitter = require('events')
EventEmitter.defaultMaxListeners = 0

class SetValueCustom extends EventEmitter {
  command (selector, maxLength) {
    if (!maxLength) {
      maxLength = 10
    }

    this.api
      .waitForElementVisible(selector, 10000)
      .clearValue(selector)
      .sendKeys(selector, fastLoremIpsum(maxLength, 'c'))
      .perform((done) => {
        this.emit('complete')
        done()
      })
    return this
  }
}

module.exports = SetValueCustom
