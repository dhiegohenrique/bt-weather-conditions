const waitTime = 60000

exports.assertion = function (selector, boolean) {
  this.message = `Testing if button (${selector}) is disabled or not according boolean ${boolean}`

  this.expected = boolean

  this.pass = function (value) {
    return value === boolean
  }

  this.value = function (result) {
    if (!result || !result.value) {
      return false
    }

    return JSON.parse(result.value) || false
  }

  this.command = function (callback) {
    return this.api
      .waitForElementPresent(selector, waitTime)
      .waitForElementVisible(selector, waitTime)
      .getAttribute(selector, 'disabled', callback)
  }
}
